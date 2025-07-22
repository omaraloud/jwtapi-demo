const http = require('http');

// Simple health check test
function healthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Health check passed - Server is running');
          resolve(true);
        } else {
          console.log(`❌ Health check failed - Status: ${res.statusCode}`);
          reject(new Error(`Health check failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Health check failed - ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('❌ Health check failed - Timeout');
      req.destroy();
      reject(new Error('Health check timeout'));
    });

    req.end();
  });
}

// API endpoint test
function testApiEndpoint() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 3000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          if (response.token && response.message === 'Login successful') {
            console.log('✅ API endpoint test passed - Login successful');
            resolve(true);
          } else {
            console.log('❌ API endpoint test failed - Invalid response');
            reject(new Error('Invalid API response'));
          }
        } else {
          console.log(`❌ API endpoint test failed - Status: ${res.statusCode}`);
          reject(new Error(`API test failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ API endpoint test failed - ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('❌ API endpoint test failed - Timeout');
      req.destroy();
      reject(new Error('API test timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Running health checks...\n');
  
  try {
    await healthCheck();
    await testApiEndpoint();
    
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.log(`\n💥 Tests failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for use in other files
module.exports = {
  healthCheck,
  testApiEndpoint,
  runTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
} 