"""Validate real PR commits against the Developer Certificate of Origin.

Uses read-only GitHub metadata. GitHub Actions reports the check conclusion;
this script never creates or overrides commit statuses.
"""
import json
import os
import re
import subprocess
import sys
import urllib.request


def check_commits(commits, expected_count):
    errors = []
    if not commits or len(commits) != expected_count:
        return [f"Incomplete commit metadata: expected {expected_count}, got {len(commits)}"]
    seen = set()
    for item in commits:
        sha = item.get("sha", "")
        if not re.fullmatch(r"[0-9a-f]{40}", sha) or sha in seen:
            errors.append("Missing, invalid or duplicate commit SHA")
            continue
        seen.add(sha)
        # Match the DCO app's standard merge and verified bot exemptions.
        if len(item.get("parents", [])) > 1:
            continue
        if (item.get("author") or {}).get("type") == "Bot":
            continue
        commit = item.get("commit", {})
        author = commit.get("author") or {}
        name, email = author.get("name", ""), author.get("email", "")
        if not name or not re.fullmatch(r"[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+", email):
            errors.append(f"{sha}: missing or invalid author identity")
            continue
        # Parse trailers with Git, so an incidental body line cannot sign a commit.
        trailers = subprocess.run(
            ["git", "interpret-trailers", "--parse"],
            input=commit.get("message", ""), text=True, check=True,
            capture_output=True,
        ).stdout.splitlines()
        signatures = []
        for line in trailers:
            match = re.fullmatch(r"Signed-off-by:\s+(.+?)\s+<([^<>\s]+)>", line, re.I)
            if match:
                signatures.append((match[1].strip(), match[2].lower()))
        if (name.strip(), email.lower()) not in signatures:
            errors.append(f"{sha}: Signed-off-by must match author {name} <{email}>")
    return errors


def main():
    repo = os.environ["GITHUB_REPOSITORY"]
    pr = int(os.environ["DCO_PR_NUMBER"])
    if not re.fullmatch(r"[\w.-]+/[\w.-]+", repo) or pr <= 0:
        raise ValueError("Invalid repository or pull request")
    base = os.environ.get("GITHUB_API_URL", "https://api.github.com").rstrip("/")
    token = os.environ["GH_TOKEN"]

    def get(path):
        request = urllib.request.Request(base + path, headers={
            "Authorization": "Bearer " + token,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        })
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)

    metadata = get(f"/repos/{repo}/pulls/{pr}")
    # Avoid certifying a stale or different PR head after a concurrent push.
    event_file = os.environ.get("GITHUB_EVENT_PATH")
    if event_file:
        with open(event_file) as stream:
            event = json.load(stream)
        event_head = event.get("pull_request", {}).get("head", {}).get("sha")
        if event_head and metadata["head"]["sha"] != event_head:
            raise ValueError("PR head changed during validation; run the new head's check")
    commits = []
    for page in range(1, 101):
        batch = get(f"/repos/{repo}/pulls/{pr}/commits?per_page=100&page={page}")
        if not isinstance(batch, list):
            raise ValueError("Unexpected commits response")
        commits.extend(batch)
        if len(batch) < 100:
            break
    if not commits or commits[-1].get("sha") != metadata["head"]["sha"]:
        raise ValueError("Commit metadata does not end at the expected PR head")
    errors = check_commits(commits, metadata["commits"])
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        print("Add a matching git commit --signoff trailer to each authored commit.", file=sys.stderr)
        return 1
    print(f"DCO passed: all {len(commits)} PR commits checked at {metadata['head']['sha']}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
