const fs = require('fs');

// 1. SRIMATCH_SYSTEM_AND_ARCHITECTURE_SPECIFICATION.md
{
  const path = 'SRIMATCH_SYSTEM_AND_ARCHITECTURE_SPECIFICATION.md';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    'External Integrations (Cloudinary, Brevo, Twilio, Prokerala, Firebase)',
    'External Integrations (Cloudinary, Brevo, Twilio, Firebase)'
  );
  code = code.replace(
    'ExtProkerala["Prokerala Astrology API"]\n',
    ''
  );
  code = code.replace(
    '    SpringBoot -->|Calculate Horoscope Kundali| ExtProkerala\n',
    ''
  );
  code = code.replace(
    'traditional cultural considerations (horoscope compatibility, family background, caste/religion practices, dietary habits)',
    'traditional cultural considerations (family background, cultural values, dietary habits)'
  );
  code = code.replace(
    'Horoscope Sign & Birth Star.',
    'Cultural & Family Values.'
  );
  code = code.replace(
    'lifestyle, horoscope, family, and partner preferences.',
    'lifestyle, family, and partner preferences.'
  );
  code = code.replace(
    '    horoscope_sign VARCHAR(30),\n',
    ''
  );
  code = code.replace(
    '    horoscope_details TEXT,\n',
    ''
  );
  code = code.replace(
    '| `HoroscopeSign` | `ARIES`, `TAURUS`, `GEMINI`, `CANCER`, `LEO`, `VIRGO`, `LIBRA`, `SCORPIO`, `SAGITTARIUS`, `CAPRICORN`, `AQUARIUS`, `PISCES` |\n',
    ''
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned SRIMATCH_SYSTEM_AND_ARCHITECTURE_SPECIFICATION.md');
}

// 2. FRONTEND_SYSTEM_TESTING_GUIDE.md
{
  const path = 'FRONTEND_SYSTEM_TESTING_GUIDE.md';
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    '- **Astrology Details**: Horoscope Sign (`Taurus / Vrishabha`), Birth Star (`Rohini`), Time of Birth (`08:30 AM`).\n',
    ''
  );
  code = code.replace(
    '1. Open your match\'s profile or click the **"Horoscope Match"** button in the chat header.',
    '1. Open your match\'s profile or view mutual compatibility details.'
  );
  code = code.replace(
    '10 Horoscope Matches, ',
    ''
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Cleaned FRONTEND_SYSTEM_TESTING_GUIDE.md');
}
