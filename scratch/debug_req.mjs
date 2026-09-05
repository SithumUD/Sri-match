import { execSync } from 'child_process';

async function main() {
  const email = `test_create_profile_${Date.now()}@srimatch.com`;
  const reg = await fetch('http://localhost:8080/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify({
      firstName: 'Kasun',
      lastName: 'Bandara',
      email: email,
      password: 'Password123!',
      agreeToTerms: true,
      captchaToken: 'dev-bypass'
    })
  });
  console.log('Register status:', reg.status);

  const otp = execSync(`docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT otp FROM otp_verifications WHERE identifier = '${email}' ORDER BY created_at DESC LIMIT 1;"`).toString().trim();
  console.log('OTP:', otp);

  const verify = await fetch('http://localhost:8080/api/v1/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify({ identifier: email, otp })
  });
  console.log('Verify status:', verify.status);

  const login = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify({ email, password: 'Password123!', rememberMe: true })
  });
  console.log('Login status:', login.status);

  const cookies = login.headers.getSetCookie ? login.headers.getSetCookie() : [];
  let token = null;
  for (const c of cookies) {
    const match = c.match(/accessToken=([^;]+)/);
    if (match) token = match[1];
  }
  console.log('Token extracted:', !!token);

  // 1. Create Profile
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
    education: 'BACHELORS',
    profession: 'Senior Software Architect',
    height: 178,
    bodyType: 'ATHLETIC',
    complexion: 'MEDIUM',
    smoking: 'NON_SMOKER',
    drinking: 'OCCASIONAL',
    dietaryPreferences: 'NON_VEGETARIAN',
    about: 'Passionate software architect looking for life partner.',
    interests: ['Coding', 'Photography', 'Travel'],
    partnerPreferences: {
      minAge: 23,
      maxAge: 30,
      religion: 'BUDDHIST'
    }
  };

  const createProf = await fetch('http://localhost:8080/api/v1/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`,
      'Cookie': `accessToken=${token}`
    },
    body: JSON.stringify(profilePayload)
  });
  console.log('Create Profile status:', createProf.status);
  console.log('Create Profile body:', await createProf.text());

  // 2. Get Profile/me
  const getMe = await fetch('http://localhost:8080/api/v1/profile/me', {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`,
      'Cookie': `accessToken=${token}`
    }
  });
  console.log('Get Profile/me status:', getMe.status);
  console.log('Get Profile/me body:', await getMe.text());
}

main().catch(console.error);
