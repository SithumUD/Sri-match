const fs = require('fs');
const { execSync } = require('child_process');

let code = execSync('git show HEAD:srimatch-frontend/src/pages/MyProfilePage.jsx', { encoding: 'utf8' });

if (!code.startsWith('"use client"')) {
  code = '"use client";\n' + code;
}

// Imports & Next.js navigation
code = code.replace(/import\s+{\s*Link,\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
code = code.replace(/import\s+{\s*Link\s*}\s+from\s+['"]react-router-dom['"];?/, 'import Link from "next/link";');
code = code.replace(/import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/, 'import { useRouter } from "next/navigation";');
code = code.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
code = code.replace(/navigate\(/g, 'router.push(');
code = code.replace(/to=/g, 'href=');

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

// In Cultural section edit mode: remove horoscopeSign and horoscopeDetails grid
const culturalFormHoroscopeRegex = /<div className="mp-form-grid">\s*<div className="mp-form-group">\s*<label className="mp-form-label">Horoscope Sign<\/label>[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(culturalFormHoroscopeRegex, '');

// In Cultural section view mode: remove ["Horoscope", ...]
code = code.replace(/\s*\["Horoscope",\s*user\.horoscope\?[^\]]+\],/, '');

// In Privacy section: remove "Show horoscope details" toggle
code = code.replace(/\s*\{\s*label:\s*"Show horoscope details"[^\}]+\},/, '');

fs.writeFileSync('srimatch-web/src/views/MyProfilePage.tsx', code, 'utf8');
console.log('Regenerated MyProfilePage.tsx with correct div count!');
