import importlib.util
import pathlib
import unittest

spec = importlib.util.spec_from_file_location(
    "dco_check", pathlib.Path(__file__).resolve().parents[1] / "scripts/dco_check.py"
)
dco = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dco)


def commit(message, sha="a" * 40, author_type="User", parents=1):
    return {"sha": sha, "author": {"type": author_type},
            "parents": [{}] * parents,
            "commit": {"author": {"name": "Example Developer", "email": "dev@example.com"},
                       "message": message}}


class DcoTest(unittest.TestCase):
    def test_matching_author_trailer_passes(self):
        self.assertEqual(dco.check_commits([commit(
            "Change\n\nSigned-off-by: Example Developer <dev@example.com>\n")], 1), [])

    def test_unsigned_commit_fails(self):
        self.assertTrue(dco.check_commits([commit("Change")], 1))

    def test_wrong_identity_fails(self):
        for signature in ["Other Developer <dev@example.com>", "Example Developer <other@example.com>"]:
            self.assertTrue(dco.check_commits([commit("Change\n\nSigned-off-by: " + signature)], 1))

    def test_body_mentions_are_not_signatures(self):
        body = "Change\n\nSigned-off-by: Example Developer <dev@example.com>\n\nThis body paragraph follows the example."
        self.assertTrue(dco.check_commits([commit(body)], 1))

    def test_every_commit_is_checked(self):
        valid = commit("Change\n\nSigned-off-by: Example Developer <dev@example.com>")
        self.assertTrue(dco.check_commits([valid, commit("Unsigned", sha="b" * 40)], 2))

    def test_missing_or_duplicate_metadata_fails_closed(self):
        valid = commit("Change\n\nSigned-off-by: Example Developer <dev@example.com>")
        self.assertTrue(dco.check_commits([], 0))
        self.assertTrue(dco.check_commits([valid], 2))
        self.assertTrue(dco.check_commits([valid, valid], 2))

    def test_merge_and_verified_bot_exemptions(self):
        self.assertEqual(dco.check_commits([commit("Merge", parents=2)], 1), [])
        self.assertEqual(dco.check_commits([commit("Dependency update", author_type="Bot")], 1), [])

    def test_unverified_identity_does_not_get_bot_exemption(self):
        item = commit("Change")
        item["commit"]["author"]["name"] = "pretend[bot]"
        self.assertTrue(dco.check_commits([item], 1))


if __name__ == "__main__":
    unittest.main()
