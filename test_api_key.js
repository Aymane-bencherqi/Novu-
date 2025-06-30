const https = require('https');
const http = require('http');

// Test the API key directly
async function testApiKey() {
  const apiKey = 'sk_19cc3710f7b4a999fe90304a7013ee35';
  const environmentId = '67f30867a1b4e056c957263c';
  const baseUrl = 'http://localhost:3000';

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/v1/notifications',
    method: 'GET',
    headers: {
      'Authorization': `ApiKey ${apiKey}`,
      'Content-Type': 'application/json',
      'Novu-Environment-Id': environmentId,
    }
  };

  console.log('Testing API key with headers:', options.headers);

  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response Body:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
}

// Also test with Bearer to see the difference
async function testBearer() {
  const apiKey = 'sk_19cc3710f7b4a999fe90304a7013ee35';
  const environmentId = '67f30867a1b4e056c957263c';
  const baseUrl = 'http://localhost:3000';

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/v1/notifications',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Novu-Environment-Id': environmentId,
    }
  };

  console.log('\nTesting Bearer with headers:', options.headers);

  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response Body:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
}

// Test environment endpoint to verify the API key
async function testEnvironment() {
  const apiKey = 'sk_19cc3710f7b4a999fe90304a7013ee35';
  const environmentId = '67f30867a1b4e056c957263c';

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/v1/environments/me',
    method: 'GET',
    headers: {
      'Authorization': `ApiKey ${apiKey}`,
      'Content-Type': 'application/json',
      'Novu-Environment-Id': environmentId,
    }
  };

  console.log('\nTesting environment endpoint with headers:', options.headers);

  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response Body:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
}

// Run tests
testApiKey();
setTimeout(testBearer, 1000);
setTimeout(testEnvironment, 2000); 
