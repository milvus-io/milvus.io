const { execSync } = require('child_process');

const execOptions = {
  encoding: 'utf8',
};

const fileString = execSync('git diff --cached --name-only', execOptions);

const nginxConfChanged = fileString
  .trim()
  .split('\n')
  .some(item => item.includes('client.conf'));

if (nginxConfChanged) {
  try {
    execSync('nginx -v', execOptions);
  } catch (error) {
    console.info('Installing nginx...');
    execSync('brew install nginx', execOptions);
  }

  execSync('nginx -t -c $(pwd)/scripts/test.conf', execOptions);
} else {
  console.info('Skipping nginx test as client.conf is not changed.');
}
