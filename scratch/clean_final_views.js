const fs = require('fs');

// 1. SuccessStoriesPage.tsx
{
  const path = 'srimatch-web/src/views/SuccessStoriesPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'The horoscope\n                  matching feature was particularly valuable to our parents!',
    'The cultural and background compatibility features were particularly valuable to our parents!'
  );
  fs.writeFileSync(path, code, 'utf8');
}

// 2. SettingsPage.tsx
{
  const path = 'srimatch-web/src/views/SettingsPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    `                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show horoscope details</p>
                        <span>Make your detailed horoscope information visible to matches</span>
                      </div>
                      <Toggle defaultChecked />
                    </div>`,
    ''
  );
  fs.writeFileSync(path, code, 'utf8');
}

// 3. FAQPage.tsx
{
  const path = 'srimatch-web/src/views/FAQPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    `    {
      id: "m2",
      q: "How does horoscope compatibility work?",
      a: "We use traditional Sri Lankan Jyotisha astrological principles to calculate chart-to-chart compatibility. When both members have entered their birth date, time, and place, we compute a detailed compatibility score. Premium members receive the full report — a document many Sri Lankan families use as part of their decision-making process.",
    },`,
    `    {
      id: "m2",
      q: "How does compatibility scoring work?",
      a: "We evaluate shared preferences, lifestyle choices, education, and cultural criteria to calculate an intuitive compatibility score. Premium members receive detailed compatibility insights to help make informed decisions.",
    },`
  );
  fs.writeFileSync(path, code, 'utf8');
}

// 4. AboutUsPage.tsx
{
  const path = 'srimatch-web/src/views/AboutUsPage.tsx';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    `                  heading: "Horoscope Matching Goes Live",
                  text: "We partnered with certified Jyotisha practitioners to build our horoscope compatibility engine — honouring a tradition that thousands of Sri Lankan families rely on when considering a match.",`,
    `                  heading: "Smart Matching Goes Live",
                  text: "We partnered with relationship experts and cultural advisors to build our compatibility engine — honouring traditions and values that thousands of Sri Lankan families rely on when considering a match.",`
  );
  fs.writeFileSync(path, code, 'utf8');
}

console.log('Final 4 views cleaned!');
