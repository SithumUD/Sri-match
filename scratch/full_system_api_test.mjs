import { execSync } from 'child_process';
import fs from 'fs';

const BASE_URL = 'http://localhost:8080/api/v1';

const testResults = [];

async function recordTest(suite, testName, testFn) {
  const start = Date.now();
  try {
    const result = await testFn();
    const duration = Date.now() - start;
    const item = { suite, testName, status: 'PASSED', durationMs: duration, details: result };
    testResults.push(item);
    console.log(`✅ [PASS] [${suite}] ${testName} (${duration}ms)`);
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    const item = { suite, testName, status: 'FAILED', durationMs: duration, error: err.message, stack: err.stack };
    testResults.push(item);
    console.error(`❌ [FAIL] [${suite}] ${testName} (${duration}ms):`, err.message);
    return null;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertSuccess(res, message) {
  if (res.status !== 200) {
    throw new Error(`${message || 'Request failed'} [Status ${res.status}]: ${JSON.stringify(res.data)}`);
  }
}

function extractCookie(res, name) {
  if (typeof res.headers.getSetCookie === 'function') {
    const cookies = res.headers.getSetCookie();
    for (const c of cookies) {
      const match = c.match(new RegExp(`${name}=([^;]+)`));
      if (match) return match[1];
    }
  }
  const single = res.headers.get('set-cookie');
  if (single) {
    const match = single.match(new RegExp(`${name}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
    headers['Cookie'] = `accessToken=${options.token}`;
  }
  const config = {
    ...options,
    headers,
  };
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  return { status: res.status, ok: res.ok, data: json, headers: res.headers };
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('🚀 SRIMATCH FULL SYSTEM AUTOMATED TEST SUITE EXECUTION');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  const timestamp = Date.now();
  const testUserAEmail = `kasun_bandara_${timestamp}@srimatch.com`;
  const testUserBEmail = `sanduni_perera_${timestamp}@srimatch.com`;
  const testAdminEmail = `admin_${timestamp}@srimatch.com`;
  const testPassword = 'Password123!';

  let tokenA = null;
  let tokenB = null;
  let adminToken = null;
  let userAId = null;
  let userBId = null;
  let profileAId = null;
  let profileBId = null;

  // ──────────────────────────────────────────────────────────────────────────
  // 1. SYSTEM HEALTH & ACTUATOR
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('HEALTH', 'Spring Boot Actuator Health Probe (/actuator/health)', async () => {
    const res = await fetch('http://localhost:8080/api/actuator/health');
    const data = await res.json();
    assert(data && data.status, `Health endpoint did not return valid status: ${JSON.stringify(data)}`);
    return data;
  });

  function getLatestOtp(email) {
    const raw = execSync(`docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT otp FROM otp_verifications WHERE identifier = '${email}' ORDER BY created_at DESC LIMIT 1;"`).toString().trim();
    return raw;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. AUTHENTICATION & USER REGISTRATION
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('AUTH', 'Register User A (Kasun Bandara - Male)', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        firstName: 'Kasun',
        lastName: 'Bandara',
        email: testUserAEmail,
        password: testPassword,
        agreeToTerms: true,
        agreeToMarketing: true,
        captchaToken: 'dev-bypass'
      }
    });
    assert(res.status === 200, `Register failed with status ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.success === true, 'Response success should be true');
    return res.data;
  });

  await recordTest('AUTH', 'Verify Email for User A using Generated OTP', async () => {
    const otp = getLatestOtp(testUserAEmail);
    assert(otp && otp.length >= 4, `OTP not found in database for ${testUserAEmail}`);
    const res = await request('/auth/verify-email', {
      method: 'POST',
      body: {
        identifier: testUserAEmail,
        otp: otp
      }
    });
    assert(res.status === 200, `Verify Email failed: ${JSON.stringify(res.data)}`);
    return { verified: true, otp };
  });

  await recordTest('AUTH', 'Login with User A to get JWT Access Token', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testUserAEmail,
        password: testPassword,
        rememberMe: true
      }
    });
    assert(res.status === 200, `Login failed: ${JSON.stringify(res.data)}`);
    tokenA = res.data.data?.accessToken || extractCookie(res, 'accessToken');
    assert(tokenA, 'Access token (or cookie) required in login response');
    userAId = res.data.data?.userId || res.data.data?.user?.id;
    if (!userAId) {
      const idRaw = execSync(`docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT id FROM users WHERE email = '${testUserAEmail}';"`).toString().trim();
      userAId = parseInt(idRaw, 10);
    }
    return { tokenLength: tokenA.length, userAId };
  });

  await recordTest('AUTH', 'Register User B (Sanduni Perera - Female)', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        firstName: 'Sanduni',
        lastName: 'Perera',
        email: testUserBEmail,
        password: testPassword,
        agreeToTerms: true,
        agreeToMarketing: true,
        captchaToken: 'dev-bypass'
      }
    });
    assert(res.status === 200, `Register User B failed: ${JSON.stringify(res.data)}`);
    return res.data;
  });

  await recordTest('AUTH', 'Verify Email for User B using Generated OTP', async () => {
    const otp = getLatestOtp(testUserBEmail);
    assert(otp && otp.length >= 4, `OTP not found in database for ${testUserBEmail}`);
    const res = await request('/auth/verify-email', {
      method: 'POST',
      body: {
        identifier: testUserBEmail,
        otp: otp
      }
    });
    assert(res.status === 200, `Verify Email for User B failed: ${JSON.stringify(res.data)}`);
    return { verified: true, otp };
  });

  await recordTest('AUTH', 'Login with User B to get JWT Access Token', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testUserBEmail,
        password: testPassword,
        rememberMe: true
      }
    });
    assert(res.status === 200, `User B Login failed: ${JSON.stringify(res.data)}`);
    tokenB = res.data.data?.accessToken || extractCookie(res, 'accessToken');
    assert(tokenB, 'Access token (or cookie) required for User B');
    userBId = res.data.data?.userId || res.data.data?.user?.id;
    if (!userBId) {
      const idRaw = execSync(`docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT id FROM users WHERE email = '${testUserBEmail}';"`).toString().trim();
      userBId = parseInt(idRaw, 10);
    }
    return { tokenLength: tokenB.length, userBId };
  });

  await recordTest('AUTH', 'Login Failure on Incorrect Password', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testUserAEmail,
        password: 'WrongPassword123!'
      }
    });
    assert(res.status === 401 || res.status === 400 || res.status === 403, `Expected 401/400/403, got ${res.status}`);
    return { status: res.status, message: res.data.message };
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. PROFILE CREATION & MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('PROFILE', 'Create / Update Profile for User A (Male, Buddhist, Colombo)', async () => {
    const profilePayload = {
      firstName: 'Kasun',
      lastName: 'Bandara',
      gender: 'MALE',
      dateOfBirth: '1995-05-15',
      timeOfBirth: '08:30:00',
      placeOfBirth: 'Colombo',
      latitude: 6.9271,
      longitude: 79.8612,
      maritalStatus: 'NEVER_MARRIED',
      hasChildren: false,
      numberOfChildren: 0,
      district: 'COLOMBO',
      city: 'Colombo',
      religion: 'BUDDHIST',
      religiousPractices: 'Observes Sil on Poya days',
      ethnicity: 'SINHALESE',
      languages: ['Sinhala', 'English'],
      horoscopeSign: 'TAURUS',
      birthStar: 'Rohini',
      horoscopeDetails: 'Kethu 1st house, Guru 5th house auspicious placement',
      education: 'BACHELORS',
      fieldOfStudy: 'Computer Science',
      profession: 'Senior Software Architect',
      industry: 'Information Technology',
      employer: 'Tech Global Ltd',
      workLocation: 'Colombo 03',
      income: 'LKR 450,000 / month',
      height: 178,
      bodyType: 'ATHLETIC',
      complexion: 'MEDIUM',
      smoking: 'NEVER',
      drinking: 'OCCASIONALLY',
      dietaryPreferences: 'NON_VEGETARIAN',
      healthHabits: 'Daily gym and cycling',
      lifestyle: 'Active and balanced',
      familyBackground: 'Father retired engineer, mother teacher',
      culturalValues: 'Traditional Sri Lankan values with modern outlook',
      familyInvolvement: 'Close family ties',
      weddingPreferences: 'Traditional Poruwa ceremony',
      about: 'Passionate software architect looking for an educated, kind-hearted life partner.',
      interests: ['Coding', 'Photography', 'Travel', 'Badminton'],
      personalityTraits: 'Caring, ambitious, humorous',
      partnerPreferences: {
        minAge: 23,
        maxAge: 30,
        religion: 'BUDDHIST',
        ethnicity: 'SINHALESE',
        education: 'BACHELORS'
      }
    };

    const res = await request('/profile', {
      method: 'POST',
      token: tokenA,
      body: profilePayload
    });
    assertSuccess(res, 'Create Profile A failed');
    profileAId = res.data.data?.id;
    return res.data.data;
  });

  await recordTest('PROFILE', 'Get User A Own Profile (/v1/profile/me)', async () => {
    const res = await request('/profile/me', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get profile/me failed');
    return res.data.data;
  });

  await recordTest('PROFILE', 'Create / Update Profile for User B (Female, Buddhist, Kandy)', async () => {
    const profilePayload = {
      firstName: 'Sanduni',
      lastName: 'Perera',
      gender: 'FEMALE',
      dateOfBirth: '1997-08-20',
      timeOfBirth: '14:15:00',
      placeOfBirth: 'Kandy',
      latitude: 7.2906,
      longitude: 80.6337,
      maritalStatus: 'NEVER_MARRIED',
      hasChildren: false,
      numberOfChildren: 0,
      district: 'KANDY',
      city: 'Kandy',
      religion: 'BUDDHIST',
      religiousPractices: 'Regular temple visits',
      ethnicity: 'SINHALESE',
      languages: ['Sinhala', 'English'],
      horoscopeSign: 'LEO',
      birthStar: 'Magha',
      horoscopeDetails: 'Shukra and Budha in 4th house',
      education: 'MASTERS',
      fieldOfStudy: 'Medicine',
      profession: 'Medical Doctor',
      industry: 'Healthcare',
      employer: 'Kandy Teaching Hospital',
      workLocation: 'Kandy',
      income: 'LKR 380,000 / month',
      height: 165,
      bodyType: 'SLIM',
      complexion: 'FAIR',
      smoking: 'NEVER',
      drinking: 'NEVER',
      dietaryPreferences: 'VEGETARIAN',
      healthHabits: 'Yoga and mindfulness',
      lifestyle: 'Peaceful and healthy',
      familyBackground: 'Respectable Kandyan family',
      culturalValues: 'Values heritage and family unity',
      familyInvolvement: 'Strong family bonds',
      weddingPreferences: 'Traditional Kandyan wedding',
      about: 'Doctor dedicated to patient care who values culture, family, and shared happiness.',
      interests: ['Medicine', 'Reading', 'Gardening', 'Classical Music'],
      personalityTraits: 'Gentle, empathetic, intelligent',
      partnerPreferences: {
        minAge: 26,
        maxAge: 33,
        religion: 'BUDDHIST',
        ethnicity: 'SINHALESE'
      }
    };

    const res = await request('/profile', {
      method: 'POST',
      token: tokenB,
      body: profilePayload
    });
    assertSuccess(res, 'Create Profile B failed');
    profileBId = res.data.data?.id;
    return res.data.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PUBLIC DISCOVERY & SEARCH
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('DISCOVERY', 'Get Public Discovery Feed (/v1/profiles)', async () => {
    const res = await request('/profiles', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get discovery profiles failed');
    return res.data.data;
  });

  await recordTest('DISCOVERY', 'Search Profiles with Filters (district=KANDY, religion=BUDDHIST)', async () => {
    const res = await request('/profiles?district=KANDY&religion=BUDDHIST', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Search profiles failed');
    return res.data.data;
  });

  await recordTest('DISCOVERY', 'Get Single Public Profile by ID (/v1/profiles/{id})', async () => {
    assert(profileBId, 'Profile B ID must exist');
    const res = await request(`/profiles/${profileBId}`, {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get public profile failed');
    return res.data.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. LIKES & MUTUAL MATCH CREATION
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('LIKES', 'Check User A Daily Like Quota (/v1/likes/quota)', async () => {
    const res = await request('/likes/quota', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get like quota failed');
    return res.data.data;
  });

  await recordTest('LIKES', 'User A Sends LIKE to User B (/v1/likes/send)', async () => {
    const res = await request('/likes/send', {
      method: 'POST',
      token: tokenA,
      body: {
        receiverId: profileBId,
        type: 'NORMAL',
        message: 'Hello Sanduni, I found your profile very inspiring!'
      }
    });
    assertSuccess(res, 'User A like send failed');
    return res.data;
  });

  await recordTest('LIKES', 'User B Checks Received Likes (/v1/likes/received)', async () => {
    const res = await request('/likes/received', {
      method: 'GET',
      token: tokenB
    });
    assertSuccess(res, 'User B check received likes failed');
    return res.data.data;
  });

  await recordTest('LIKES', 'User B Sends LIKE to User A (Triggers MUTUAL MATCH)', async () => {
    const res = await request('/likes/send', {
      method: 'POST',
      token: tokenB,
      body: {
        receiverId: profileAId,
        type: 'NORMAL',
        message: 'Ayubowan Kasun, nice to connect!'
      }
    });
    assertSuccess(res, 'User B like send failed');
    return res.data;
  });

  let activeMatchId = null;
  await recordTest('MATCHES', 'User A Fetches Active Matches (/v1/matches)', async () => {
    const res = await request('/matches', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get matches failed');
    const matches = res.data.data || [];
    assert(matches.length > 0, 'User A should have at least 1 mutual match');
    activeMatchId = matches[0].id;
    return { totalMatches: matches.length, match: matches[0] };
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. CHAT & MESSAGING SYSTEM
  // ──────────────────────────────────────────────────────────────────────────
  let sentMessageId = null;
  await recordTest('CHAT', 'User A Sends Message to Match (/v1/chat/send)', async () => {
    assert(activeMatchId, 'activeMatchId must be present');
    const res = await request('/chat/send', {
      method: 'POST',
      token: tokenA,
      body: {
        matchId: activeMatchId,
        receiverId: userBId,
        content: 'Ayubowan Sanduni! Wishing you a wonderful day. Shall we discuss our horoscopes?',
        type: 'TEXT'
      }
    });
    assertSuccess(res, 'Send chat message failed');
    sentMessageId = res.data.data?.id;
    return res.data.data;
  });

  await recordTest('CHAT', 'User B Retrieves Chat History (/v1/chat/history/{matchId})', async () => {
    const res = await request(`/chat/history/${activeMatchId}`, {
      method: 'GET',
      token: tokenB
    });
    assertSuccess(res, 'Get chat history failed');
    const messages = res.data.data?.content || res.data.data || [];
    assert(messages.length > 0, 'Chat history should contain message');
    return { messageCount: messages.length, latest: messages[0]?.content || messages[messages.length - 1]?.content };
  });

  await recordTest('CHAT', 'User B Marks Message as Read (/v1/chat/messages/{id}/read)', async () => {
    if (!sentMessageId) return { skipped: true };
    const res = await request(`/chat/messages/${sentMessageId}/read`, {
      method: 'PATCH',
      token: tokenB
    });
    assertSuccess(res, 'Mark read failed');
    return res.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. HOROSCOPE PORUTHAM MATCHING
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('ASTROLOGY', 'Calculate Horoscope Compatibility (/v1/horoscope/match/{targetProfileId})', async () => {
    assert(profileBId, 'profileBId is required');
    const res = await request(`/horoscope/match/${profileBId}`, {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Horoscope match analysis failed');
    return res.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 8. MEMBERSHIP PACKAGES & BANK DETAILS
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('SUBSCRIPTION', 'Get All Active Membership Packages (/v1/packages)', async () => {
    const res = await request('/packages', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get packages failed');
    const pkgs = res.data.data || [];
    assert(pkgs.length > 0, 'Packages list should not be empty');
    return pkgs;
  });

  await recordTest('SUBSCRIPTION', 'Get User Current Subscription Status (/v1/subscriptions/my)', async () => {
    const res = await request('/subscriptions/my', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get current subscription failed');
    return res.data.data;
  });

  await recordTest('SUBSCRIPTION', 'Get Company Bank Transfer Details (/v1/bank-details)', async () => {
    const res = await request('/bank-details', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get bank details failed');
    return res.data.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 9. SUPPORT TICKETS & USER SAFETY REPORTING
  // ──────────────────────────────────────────────────────────────────────────
  let supportTicketId = null;
  await recordTest('SUPPORT', 'User A Creates Support Ticket (/v1/support/tickets)', async () => {
    const res = await request('/support/tickets', {
      method: 'POST',
      token: tokenA,
      body: {
        subject: 'Inquiry regarding VIP horoscope match analysis',
        category: 'BILLING',
        priority: 'MEDIUM',
        message: 'Could you please confirm if Vedic matching is included in Platinum plan?'
      }
    });
    assertSuccess(res, 'Create support ticket failed');
    supportTicketId = res.data.data?.id;
    return res.data.data;
  });

  await recordTest('SUPPORT', 'User A Gets Own Support Tickets List', async () => {
    const res = await request('/support/tickets', {
      method: 'GET',
      token: tokenA
    });
    assertSuccess(res, 'Get tickets failed');
    return res.data.data;
  });

  await recordTest('SAFETY', 'User A Submits Profile Report (/v1/reports)', async () => {
    const res = await request('/reports', {
      method: 'POST',
      token: tokenA,
      body: {
        reportedUserId: userBId,
        reason: 'OTHER',
        description: 'System automated safety workflow check.'
      }
    });
    assertSuccess(res, 'Report submission failed');
    return res.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 10. ADMIN DASHBOARD & MANAGEMENT SUITE
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('ADMIN_AUTH', 'Register and Escalate Admin User', async () => {
    // 1. Register admin user
    await request('/auth/register', {
      method: 'POST',
      body: {
        firstName: 'System',
        lastName: 'Admin',
        email: testAdminEmail,
        password: testPassword,
        agreeToTerms: true,
        captchaToken: 'dev-bypass'
      }
    });

    // 2. Verify Email with DB OTP
    const adminOtp = getLatestOtp(testAdminEmail);
    await request('/auth/verify-email', {
      method: 'POST',
      body: {
        identifier: testAdminEmail,
        otp: adminOtp
      }
    });

    // 3. Promote role to ADMIN directly in database
    execSync(`docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "UPDATE users SET role = 'ADMIN' WHERE email = '${testAdminEmail}';"`);

    // 4. Re-login to get refreshed JWT with ROLE_ADMIN authority
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testAdminEmail,
        password: testPassword
      }
    });
    adminToken = loginRes.data.data?.accessToken || extractCookie(loginRes, 'accessToken');
    assert(adminToken, 'Admin token should be obtained');
    return { adminEmail: testAdminEmail, tokenAcquired: true };
  });

  await recordTest('ADMIN', 'Admin Fetches Dashboard Analytics (/v1/admin/dashboard)', async () => {
    const res = await request('/admin/dashboard', {
      method: 'GET',
      token: adminToken
    });
    assertSuccess(res, 'Admin dashboard failed');
    return res.data;
  });

  await recordTest('ADMIN', 'Admin Lists System Users (/v1/admin/users)', async () => {
    const res = await request('/admin/users?page=0&size=10', {
      method: 'GET',
      token: adminToken
    });
    assertSuccess(res, 'Admin get users failed');
    return res.data;
  });

  await recordTest('ADMIN', 'Admin Views System Settings (/v1/admin/settings)', async () => {
    const res = await request('/admin/settings', {
      method: 'GET',
      token: adminToken
    });
    assertSuccess(res, 'Admin settings failed');
    return res.data;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 11. LOGOUT & JWT BLACKLIST SECURITY
  // ──────────────────────────────────────────────────────────────────────────
  await recordTest('AUTH_SECURITY', 'User A Logout & Token Invalidation (/v1/auth/logout)', async () => {
    const res = await request('/auth/logout', {
      method: 'POST',
      token: tokenA
    });
    assertSuccess(res, 'Logout failed');
    return res.data;
  });

  await recordTest('AUTH_SECURITY', 'Verify Blacklisted Token is Rejected', async () => {
    const res = await request('/profile/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert(res.status === 401 || res.status === 403, `Expected 401/403 for blacklisted token, got ${res.status}`);
    return { status: res.status, correctlyRejected: true };
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  const passed = testResults.filter(t => t.status === 'PASSED').length;
  const failed = testResults.filter(t => t.status === 'FAILED').length;
  const passRate = ((passed / testResults.length) * 100).toFixed(1);
  console.log(`📊 FINAL TEST RUN RESULTS: ${passed}/${testResults.length} PASSED (${passRate}%) | ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  return { total: testResults.length, passed, failed, passRate: `${passRate}%`, results: testResults };
}

runAllTests()
  .then(summary => {
    fs.writeFileSync('scratch/full_system_test_report.json', JSON.stringify(summary, null, 2));
    console.log('📄 Detailed report saved to: scratch/full_system_test_report.json');
  })
  .catch(err => {
    console.error('Fatal execution error:', err);
  });
