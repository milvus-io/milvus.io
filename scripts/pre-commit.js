const { execSync } = require('child_process');
const path = require('path');

const execOptions = { encoding: 'utf8' };

// Paths
const confDir = path.resolve(__dirname, '../conf');
const dockerfilePath = path.resolve(__dirname, '../Nginx.Dockerfile');
const imageName = 'nginx-geoip2-test';
const containerName = 'nginx-test-container';

try {
  // Build Docker image using Nginx.Dockerfile
  console.info('Building Docker image...');
  execSync(`docker build -f ${dockerfilePath} -t ${imageName} .`, execOptions);

  // Run container to test Nginx configuration
  console.info('Running container to test Nginx configuration...');
  execSync(
    `docker run --rm --name ${containerName} -v ${confDir}:/etc/nginx/conf.d ${imageName} nginx -t`,
    execOptions
  );

  console.info('Nginx configuration test passed!');
} catch (error) {
  console.error('Nginx configuration test failed:', error.stderr || error.message);
  process.exit(1);
}
