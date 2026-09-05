const fs = require('fs');

function cleanFile(filePath, transforms) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [pattern, replacement] of transforms) {
    content = content.replace(pattern, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. SuccessStoriesPage.tsx
cleanFile('srimatch-web/src/views/SuccessStoriesPage.tsx', [
  [
    /The horoscope\s+matching feature was particularly valuable to our parents!/,
    'The cultural and background compatibility features were particularly valuable to our parents!'
  ]
]);

// 2. SettingsPage.tsx
cleanFile('srimatch-web/src/views/SettingsPage.tsx', [
  [
    /<div className="set-toggle-row">\s*<div className="set-toggle-info">\s*<p>Show horoscope details<\/p>\s*<span>Make your detailed horoscope information visible to matches<\/span>\s*<\/div>\s*<Toggle defaultChecked \/>\s*<\/div>/,
    ''
  ]
]);

// 3. FAQPage.tsx
cleanFile('srimatch-web/src/views/FAQPage.tsx', [
  [
    /\{\s*id:\s*"m2",\s*q:\s*"How does horoscope compatibility work\?",[\s\S]*?\},/,
    `{
      id: "m2",
      q: "How does compatibility scoring work?",
      a: "We evaluate shared preferences, lifestyle choices, education, and cultural criteria to calculate an intuitive compatibility score. Premium members receive detailed compatibility insights to help make informed decisions.",
    },`
  ]
]);

// 4. AboutUsPage.tsx
cleanFile('srimatch-web/src/views/AboutUsPage.tsx', [
  [
    /heading:\s*"Horoscope Matching Goes Live",\s*text:\s*"We partnered with certified Jyotisha practitioners to build our horoscope compatibility engine — honouring a tradition that thousands of Sri Lankan families rely on when considering a match\.",/,
    `heading: "Smart Matching Goes Live",
                  text: "We partnered with relationship experts and cultural advisors to build our compatibility engine — honouring traditions and values that thousands of Sri Lankan families rely on when considering a match.",`
  ]
]);

console.log('CRLF replacement completed.');
