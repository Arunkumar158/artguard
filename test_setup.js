#!/usr/bin/env node

/**
 * Test script to verify ArtGuard backend connection and setup
 * Run with: node test_setup.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const HEALTH_ENDPOINT = `${BACKEND_URL}/health/`;

console.log('🔍 ArtGuard Backend Connection Test');
console.log('=====================================\n');

// Test 1: Check if backend is accessible
async function testBackendHealth() {
  console.log('1. Testing backend health endpoint...');
  console.log(`   URL: ${HEALTH_ENDPOINT}`);
  
  return new Promise((resolve) => {
    const url = new URL(HEALTH_ENDPOINT);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('   ✅ Backend is healthy!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Message: ${response.message}`);
            console.log(`   Version: ${response.version}`);
            resolve(true);
          } catch (error) {
            console.log('   ⚠️  Backend responded but with invalid JSON');
            console.log(`   Response: ${data}`);
            resolve(false);
          }
        } else {
          console.log(`   ❌ Backend responded with status ${res.statusCode}`);
          console.log(`   Response: ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('   ❌ Failed to connect to backend');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ❌ Request timed out');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 2: Check environment variables
function testEnvironmentVariables() {
  console.log('\n2. Checking environment variables...');
  
  const requiredVars = [
    'VITE_API_BASE_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${varName.includes('KEY') || varName.includes('SECRET') ? '***' : value}`);
    } else {
      console.log(`   ❌ ${varName}: Not set`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Test 3: Check if ports are available
async function testPortAvailability() {
  console.log('\n3. Checking port availability...');
  
  const testPort = (port) => {
    return new Promise((resolve) => {
      const server = http.createServer();
      
      server.listen(port, () => {
        server.close();
        resolve(true);
      });
      
      server.on('error', () => {
        resolve(false);
      });
    });
  };
  
  const port8000 = await testPort(8000);
  if (port8000) {
    console.log('   ✅ Port 8000 is available');
  } else {
    console.log('   ❌ Port 8000 is in use');
  }
  
  return port8000;
}

// Main test function
async function runTests() {
  const healthTest = await testBackendHealth();
  const envTest = testEnvironmentVariables();
  const portTest = await testPortAvailability();
  
  console.log('\n=====================================');
  console.log('📊 Test Results Summary');
  console.log('=====================================');
  console.log(`Backend Health: ${healthTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Environment Variables: ${envTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Port Availability: ${portTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (healthTest && envTest && portTest) {
    console.log('\n🎉 All tests passed! Your setup looks good.');
    console.log('You can now start your frontend and test the upload functionality.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
    
    if (!healthTest) {
      console.log('\n💡 To fix backend issues:');
      console.log('   1. Ensure Django server is running: python manage.py runserver');
      console.log('   2. Check if the server is accessible at http://localhost:8000');
      console.log('   3. Verify the API endpoints are working');
    }
    
    if (!envTest) {
      console.log('\n💡 To fix environment issues:');
      console.log('   1. Create a .env file in the artguard_backend directory');
      console.log('   2. Add all required environment variables');
      console.log('   3. Restart the Django server');
    }
    
    if (!portTest) {
      console.log('\n💡 To fix port issues:');
      console.log('   1. Check what is using port 8000: lsof -i :8000');
      console.log('   2. Kill the process or use a different port');
      console.log('   3. Update your environment variables accordingly');
    }
  }
}

// Run the tests
runTests().catch(console.error); 