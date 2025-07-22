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

execSync('next build', {
  stdio: 'inherit',
});
