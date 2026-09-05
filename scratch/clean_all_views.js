const fs = require('fs');

// 1. SuccessStoriesPage.tsx
{
  const path = 'srimatch-web/src/views/SuccessStoriesPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'Our families were thrilled when they discovered our horoscopes were highly compatible.',
    'Our families were thrilled when they discovered how well our life goals and values aligned.'
  );
  code = code.replace(
    'The horoscope\n                  matching feature was particularly valuable to our parents!',
    'The cultural and background compatibility features were particularly valuable to our parents!'
  );
  code = code.replace(
    'The horoscope matching feature was particularly valuable to our parents!',
    'The cultural and background compatibility features were particularly valuable to our parents!'
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned SuccessStoriesPage.tsx');
}

// 2. HowItWorksPage.tsx
{
  const path = 'srimatch-web/src/views/HowItWorksPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    '"Horoscope details (optional but highly recommended by families)",',
    '"Background details (education, career, and lifestyle)",'
  );
  code = code.replace(
    'Our algorithm weighs cultural compatibility, location, education, lifestyle — and horoscope if you choose.',
    'Our algorithm weighs cultural compatibility, location, education, and lifestyle.'
  );
  code = code.replace(
    '"Horoscope compatibility score on every profile",',
    '"Detailed compatibility highlights on every profile",'
  );
  code = code.replace(
    'title: "Detailed Horoscope Reports",',
    'title: "In-Depth Compatibility Highlights",'
  );
  code = code.replace(
    'title: "Include Your Horoscope",',
    'title: "Complete Your Profile Details",'
  );
  code = code.replace(
    'text: "Even if you\'re undecided about astrology, adding your horoscope details opens the door to families who consider it important."',
    'text: "Adding complete details about your background and interests opens the door to members who share your values."'
  );
  code = code.replace(
    '<div className="hiw-trust-item"><StarIcon size={12} /> Horoscope matching</div>',
    '<div className="hiw-trust-item"><StarIcon size={12} /> Smart compatibility</div>'
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned HowItWorksPage.tsx');
}

// 3. HelpCenterPage.tsx
{
  const path = 'srimatch-web/src/views/HelpCenterPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'id: "horoscope-matching",',
    'id: "compatibility-matching",'
  );
  code = code.replace(
    'title: "Understanding horoscope compatibility",',
    'title: "Understanding compatibility scores",'
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned HelpCenterPage.tsx');
}

// 4. FAQPage.tsx
{
  const path = 'srimatch-web/src/views/FAQPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'We combine traditional values — horoscope compatibility, family involvement, cultural and religious matching — with modern technology',
    'We combine traditional values — family involvement, cultural and religious matching — with modern technology'
  );
  code = code.replace(
    'traditional Jyotisha horoscope matching, ',
    ''
  );
  code = code.replace(
    'Upgrading to Premium unlocks unlimited likes, voice & video calls, horoscope reports, advanced search filters, and much more.',
    'Upgrading to Premium unlocks unlimited likes, voice & video calls, advanced search filters, mutual matches, and much more.'
  );
  code = code.replace(
    'cultural background, horoscope information, and photos.',
    'cultural background, lifestyle preferences, and photos.'
  );
  code = code.replace(
    'Premium members also receive horoscope-weighted matching, where astrological compatibility influences suggestions.',
    'Premium members also receive prioritized profile visibility and enhanced discovery suggestions.'
  );
  code = code.replace(
    'q: "How does horoscope compatibility work?",\n      a: "We use traditional Sri Lankan astrological principles to calculate compatibility between two horoscope charts. Our system evaluates planetary positions, nakshatras, and porondam compatibility to generate a detailed compatibility score that helps families make informed decisions."',
    'q: "How does compatibility matching work?",\n      a: "Our algorithm assesses shared cultural values, lifestyle preferences, education, and mutual criteria to generate comprehensive compatibility scores that help individuals and families make informed decisions."'
  );
  code = code.replace(
    'detailed Jyotisha horoscope compatibility reports, ',
    ''
  );
  code = code.replace(
    'placeholder="e.g. horoscope matching, NIC verification, cancel premium…"',
    'placeholder="e.g. compatibility matching, NIC verification, cancel premium…"'
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned FAQPage.tsx');
}

// 5. ContactUsPage.tsx
{
  const path = 'srimatch-web/src/views/ContactUsPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'from account questions to horoscope guidance.',
    'from account questions to profile verification.'
  );
  code = code.replace(
    '<option value="horoscope">Horoscope Matching</option>',
    '<option value="compatibility">Compatibility & Matching</option>'
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned ContactUsPage.tsx');
}

// 6. AboutUsPage.tsx
{
  const path = 'srimatch-web/src/views/AboutUsPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'bio: "Certified Jyotisha practitioner ensuring our horoscope matching honours authentic Sri Lankan astrological traditions."',
    'bio: "Relationship counselor ensuring our compatibility matching honours authentic Sri Lankan family values."'
  );
  code = code.replace(
    'heading: "Horoscope Matching Goes Live",\n                  text: "We partnered with certified Jyotisha practitioners to build our horoscope compatibility engine — honouring a tradition that thousands of Sri Lankan families rely on when considering a match."',
    'heading: "Smart Matching Goes Live",\n                  text: "We partnered with cultural advisors to build our value compatibility engine — honouring traditions that thousands of Sri Lankan families rely on when considering a match."'
  );
  code = code.replace(
    '{ icon: <StarIcon size={22} color="#fff" />, title: "Horoscope Matching", text: "Traditional astrological compatibility built right into the platform — a feature your parents will appreciate as much as you do." },',
    '{ icon: <StarIcon size={22} color="#fff" />, title: "Smart Compatibility", text: "Deep cultural and lifestyle compatibility built right into the platform — a feature your parents will appreciate as much as you do." },'
  );
  code = code.replace(
    'AI matching, horoscope engines, video calling',
    'AI matching, lifestyle discovery, video calling'
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned AboutUsPage.tsx');
}
