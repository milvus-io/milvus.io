const { execFileSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

try {
  for (const dockerfile of ['Builder.Dockerfile', 'Preview.Dockerfile']) {
    console.info(`Validating Nginx configuration in ${dockerfile}...`);
    execFileSync('docker', ['build', '--platform', 'linux/amd64', '--target', 'nginx-runtime', '-f', dockerfile, '.'], {
      cwd: root,
      stdio: 'inherit',
    });
  }
} catch (error) {
  console.error('Nginx configuration test failed:', error.message);
  process.exit(1);
}
