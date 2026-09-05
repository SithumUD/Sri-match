const fs = require('fs');
const { execSync } = require('child_process');

function convertToNextJs(source) {
  let code = source;
  if (!code.startsWith('"use client"')) {
    code = '"use client";\n' + code;
  }
  code = code.replace(/import\s+{\s*Link,\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  code = code.replace(/import\s+{\s*Link\s*}\s+from\s+['"]react-router-dom['"];?/, 'import Link from "next/link";');
  code = code.replace(/import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/, 'import { useRouter } from "next/navigation";');
  code = code.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
  code = code.replace(/navigate\(/g, 'router.push(');
  code = code.replace(/to=/g, 'href=');
  return code;
}

// 1. SuccessStoriesPage.tsx
{
  let code = execSync('git show HEAD:srimatch-frontend/src/pages/SuccessStoriesPage.jsx', { encoding: 'utf8' });
  code = convertToNextJs(code);
  code = code.replace(
    'Our families were thrilled when they discovered our horoscopes were highly compatible.',
    'Our families were thrilled when they discovered how compatible our values and life goals were.'
  );
  code = code.replace(
    /The horoscope\s+matching feature was particularly valuable to our parents!/,
    'The cultural and background compatibility features were particularly valuable to our parents!'
  );
  fs.writeFileSync('srimatch-web/src/views/SuccessStoriesPage.tsx', code, 'utf8');
  console.log('Regenerated SuccessStoriesPage.tsx');
}

// 2. AboutUsPage.tsx
{
  let code = execSync('git show HEAD:srimatch-frontend/src/pages/AboutUsPage.jsx', { encoding: 'utf8' });
  code = convertToNextJs(code);
  code = code.replace('Astrology & Culture Advisor', 'Family & Culture Advisor');
  code = code.replace(
    /bio:\s*"Certified Jyotisha practitioner ensuring our horoscope matching honours authentic Sri Lankan astrological traditions\.",/,
    'bio: "Relationship counselor ensuring our compatibility matching honours authentic Sri Lankan family values.",'
  );
  code = code.replace(
    /heading:\s*"Horoscope Matching Goes Live",\s*text:\s*"We partnered with certified Jyotisha practitioners to build our horoscope compatibility engine — honouring a tradition that thousands of Sri Lankan families rely on when considering a match\.",/,
    `heading: "Smart Matching Goes Live",
                  text: "We partnered with relationship experts and cultural advisors to build our compatibility engine — honouring traditions and values that thousands of Sri Lankan families rely on when considering a match.",`
  );
  code = code.replace(
    /\{\s*icon:\s*<StarIcon size=\{22\} color="#fff" \/>,\s*title:\s*"Horoscope Matching",\s*text:\s*"[^"]+",?\s*\},/,
    `{
                icon: <StarIcon size={22} color="#fff" />,
                title: "Smart Compatibility",
                text: "Deep cultural and lifestyle compatibility built right into the platform — a feature your parents will appreciate as much as you do.",
              },`
  );
  code = code.replace(
    'AI matching, horoscope engines, video calling',
    'AI matching, lifestyle discovery, video calling'
  );
  fs.writeFileSync('srimatch-web/src/views/AboutUsPage.tsx', code, 'utf8');
  console.log('Regenerated AboutUsPage.tsx');
}

// 3. MyProfilePage.tsx
{
  let code = execSync('git show HEAD:srimatch-frontend/src/pages/MyProfilePage.jsx', { encoding: 'utf8' });
  code = convertToNextJs(code);
  
  // Add CityAutocomplete import
  code = code.replace(
    /import ProfileService from [^\n]+;/,
    'import CityAutocomplete from "../components/common/CityAutocomplete";\nimport ProfileService from "../services/profile.service";'
  );
  
  // Remove horoscope from PROFILE_OPTIONS
  code = code.replace(/\s*horoscope:\s*\[[\s\S]*?\],/, '');
  
  // Remove horoscopeSign from mapEnum update
  code = code.replace(/\s*if\s*\(mappedData\.horoscopeSign\)[^\n]+;/, '');
  
  // Replace city input with CityAutocomplete
  code = code.replace(
    /<div className="mp-form-group">\s*<label className="mp-form-label">City<\/label>\s*<input[^>]+name="city"[^>]+>\s*<\/div>/,
    `<div className="mp-form-group">
                              <label className="mp-form-label">City</label>
                              <CityAutocomplete
                                value={formData.city || ""}
                                onChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
                                placeholder="e.g. Colombo, Kandy, Galle"
                                variant="form"
                              />
                            </div>`
  );
  
  // Replace placeOfBirth input with CityAutocomplete
  code = code.replace(
    /<div className="mp-form-group">\s*<label className="mp-form-label">Place of Birth<\/label>\s*<input[^>]+name="placeOfBirth"[^>]+>\s*<\/div>/,
    `<div className="mp-form-group">
                              <label className="mp-form-label">Place of Birth</label>
                              <CityAutocomplete
                                value={formData.placeOfBirth || ""}
                                onChange={(val) => setFormData(prev => ({ ...prev, placeOfBirth: val }))}
                                placeholder="e.g. Matara, Kandy"
                                variant="form"
                              />
                            </div>`
  );
  
  // Remove horoscope sign & details inputs from Cultural section
  code = code.replace(
    /<div className="mp-form-grid">\s*<div className="mp-form-group">\s*<label className="mp-form-label">Horoscope Sign<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    ''
  );
  
  // Remove horoscope from info grid in Cultural section
  code = code.replace(/\s*\["Horoscope Sign"[^\]]+\],/, '');
  code = code.replace(/\s*\["Horoscope Details"[^\]]+\],/, '');
  
  // Remove horoscope toggle from privacy section
  code = code.replace(/\s*\{\s*label:\s*"Show horoscope details"[^\}]+\},/, '');
  
  fs.writeFileSync('srimatch-web/src/views/MyProfilePage.tsx', code, 'utf8');
  console.log('Regenerated MyProfilePage.tsx');
}
