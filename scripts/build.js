const { execSync } = require('child_process');

const args = process.argv.slice(2);
let envArgs = {};

args.forEach(arg => {
  if (arg.startsWith('--env=')) {
    const [key, value] = arg.replace('--env=', '').split('=');
    envArgs[key] = value;
  }
});

process.env.NEXT_PUBLIC_INKEEP_API_KEY = envArgs.INKEEP_API_KEY;
process.env.REPO_STATICS_KEY = envArgs.REPO_STATICS_KEY;
process.env.NEXT_PUBLIC_IS_PREVIEW = envArgs.IS_PREVIEW;
process.env.NEXT_PUBLIC_MSERVICE_URL = envArgs.MSERVICE_URL;
process.env.NEXT_PUBLIC_CMS_BASE_URL = envArgs.CMS_BASE_URL;

// The webpack compile step needs more than Node's default ~4GB heap. CI sets
// this explicitly; default it here so local `pnpm build` matches CI and does
// not OOM. An explicitly provided NODE_OPTIONS (e.g. from CI) is left intact.
if (!/max[-_]old[-_]space[-_]size/.test(process.env.NODE_OPTIONS || '')) {
  process.env.NODE_OPTIONS =
    `${process.env.NODE_OPTIONS || ''} --max-old-space-size=8192`.trim();
}

execSync('next build', {
  stdio: 'inherit',
});
