const BASE_URL = 'https://edusphere-course-platform.onrender.com/api';
const ROOT_URL = 'https://edusphere-course-platform.onrender.com';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

const runTests = async () => {
  console.log(`${colors.bold}${colors.cyan}=====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}     EDUSPHERE AUTOMATED LIVE INTEGRATION TEST SUITE  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}=====================================================${colors.reset}\n`);

  let testCount = 0;
  let passCount = 0;

  const logResult = (testName, passed, details = '') => {
    testCount++;
    if (passed) {
      passCount++;
      console.log(`[${colors.green}PASS${colors.reset}] - ${testName}`);
    } else {
      console.log(`[${colors.red}FAIL${colors.reset}] - ${testName}`);
    }
    if (details) console.log(`       ${details}`);
  };

  // Test 1: API Root Health Check
  try {
    const res = await fetch(ROOT_URL);
    const data = await res.json();
    const passed = res.ok && data.status === 'healthy' && data.database === 'mongodb_atlas';
    logResult(
      'API Root Health Check & Cloud Database Status', 
      passed, 
      `Status: ${data.status}, Database: ${data.database}`
    );
  } catch (error) {
    logResult('API Root Health Check & Cloud Database Status', false, error.message);
  }

  // Test 2: Get Courses Catalog List
  try {
    const res = await fetch(`${BASE_URL}/courses`);
    const data = await res.json();
    const passed = res.ok && Array.isArray(data) && data.length > 0;
    logResult(
      'Courses Retrieval Catalog Endpoint', 
      passed, 
      `Found ${Array.isArray(data) ? data.length : 0} courses in active catalog.`
    );
  } catch (error) {
    logResult('Courses Retrieval Catalog Endpoint', false, error.message);
  }

  // Test 3: Authenticated User Registration
  const testEmail = `test_student_${Date.now()}@edusphere.com`;
  const testPassword = 'SecurePassword123!';
  let authToken = '';

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester Student',
        email: testEmail,
        password: testPassword,
        role: 'student'
      })
    });
    const data = await res.json();
    const passed = res.status === 201 && data.token && data.email === testEmail;
    if (passed) authToken = data.token;
    logResult(
      'New Student Registration Endpoint', 
      passed, 
      passed ? `Registered Email: ${data.email}` : `Error: ${data.message}`
    );
  } catch (error) {
    logResult('New Student Registration Endpoint', false, error.message);
  }

  // Test 4: Authenticated User Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const data = await res.json();
    const passed = res.ok && data.token && data.email === testEmail;
    logResult(
      'Registered Student Login Endpoint', 
      passed, 
      passed ? `Successfully logged in, generated valid session JWT.` : `Error: ${data.message}`
    );
  } catch (error) {
    logResult('Registered Student Login Endpoint', false, error.message);
  }

  // Test 5: Fetch Profile Using JWT Token
  if (authToken) {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${authToken}` 
        }
      });
      const data = await res.json();
      const passed = res.ok && data.email === testEmail;
      logResult(
        'Get Authenticated User Profile (via Header JWT)', 
        passed, 
        passed ? `Authenticated User: ${data.name} [Role: ${data.role}]` : `Error: ${data.message}`
      );
    } catch (error) {
      logResult('Get Authenticated User Profile (via Header JWT)', false, error.message);
    }
  } else {
    logResult('Get Authenticated User Profile (via Header JWT)', false, 'Skipped because registration failed.');
  }

  console.log(`\n${colors.bold}${colors.cyan}=====================================================${colors.reset}`);
  console.log(`${colors.bold}SUMMARY: Passed ${passCount} of ${testCount} tests (${Math.round((passCount/testCount)*100)}%)${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}=====================================================${colors.reset}\n`);
};

runTests();
