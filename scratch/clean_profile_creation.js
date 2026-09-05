const fs = require('fs');
let code = fs.readFileSync('scratch/ProfileCreationPage_clean.tsx', 'utf8');

// Ensure 'use client'
if (!code.startsWith('"use client"')) {
  code = '"use client";\n' + code;
}

// Update imports
code = code.replace(/import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/, 'import { useRouter } from "next/navigation";');
code = code.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
code = code.replace(/navigate\(/g, 'router.push(');

// Remove horoscope from PROFILE_OPTIONS
code = code.replace(/\s*horoscope:\s*\[[^\]]+\],?/, '');

// Remove horoscopeSign and horoscopeDetails from payload
code = code.replace(/\s*horoscopeSign:\s*mapEnum\([^)]+\),?/, '');
code = code.replace(/\s*birthStar:\s*profileCreationData\.birthStar,?/, '');
code = code.replace(/\s*horoscopeDetails:\s*profileCreationData\.horoscopeDetails,?/, '');

// Remove Horoscope Sign and additional horoscope fields from Step 5 form
const horoscopeFormRegex = /<div className="pc-grid-2">\s*<div className="pc-field">\s*<label className="pc-label">Horoscope \/ Zodiac Sign[\s\S]*?<\/p>\s*<\/div>/;
code = code.replace(horoscopeFormRegex, '');

// Remove horoscope review items from Step 7
code = code.replace(/\["Horoscope Sign"[^\n]+,\n/, '');
code = code.replace(/\["Birth Star"[^\n]+,\n/, '');
code = code.replace(/\{\s*profileCreationData\.horoscopeDetails[\s\S]*?\}\s*\)/, '');

// Add CityAutocomplete import if missing
if (!code.includes('CityAutocomplete')) {
  code = code.replace(/import ProfileService from [^\n]+;/, 'import ProfileService from "../services/profile.service";\nimport CityAutocomplete from "../components/common/CityAutocomplete";');
}

// Replace raw city input with CityAutocomplete
code = code.replace(
  /<div className="pc-field">\s*<label className="pc-label">City \/ Current Town <span className="req">\*<\/span><\/label>\s*<input[^>]+name="city"[^>]+>\s*<\/div>/,
  `<div className="pc-field">
                <label className="pc-label">City / Current Town <span className="req">*</span></label>
                <CityAutocomplete
                  value={profileCreationData.city || ""}
                  onChange={(val) => updateProfileCreationData({ city: val })}
                  placeholder="e.g. Colombo, Kandy, Galle"
                  variant="form"
                />
              </div>`
);

// Replace raw placeOfBirth input with CityAutocomplete
code = code.replace(
  /<div className="pc-field">\s*<label className="pc-label">Place of Birth<\/label>\s*<input[^>]+name="placeOfBirth"[^>]+>\s*<\/div>/,
  `<div className="pc-field">
                <label className="pc-label">Place of Birth</label>
                <CityAutocomplete
                  value={profileCreationData.placeOfBirth || ""}
                  onChange={(val) => updateProfileCreationData({ placeOfBirth: val })}
                  placeholder="e.g. Matara, Kandy"
                  variant="form"
                />
              </div>`
);

fs.writeFileSync('srimatch-web/src/views/ProfileCreationPage.tsx', code, 'utf8');
console.log('ProfileCreationPage.tsx successfully generated!');
