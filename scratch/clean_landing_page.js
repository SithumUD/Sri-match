const fs = require('fs');
const { execSync } = require('child_process');

let code = execSync('git show HEAD:srimatch-frontend/src/pages/LandingPage.jsx', { encoding: 'utf8' });

// Add 'use client'
if (!code.startsWith('"use client"')) {
  code = '"use client";\n' + code;
}

// Update imports
code = code.replace(/import\s+{\s*Link,\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
code = code.replace(/import\s+{\s*Link\s*}\s+from\s+['"]react-router-dom['"];?/, 'import Link from "next/link";');
code = code.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
code = code.replace(/navigate\(/g, 'router.push(');
code = code.replace(/to=/g, 'href=');

// FAQ 2
code = code.replace(
  /\{\s*q:\s*"How does horoscope compatibility work\?",\s*a:\s*"[^"]+",?\s*\},/,
  `{
    q: "How does compatibility matching work?",
    a: "We evaluate cultural alignment, preferences, lifestyle choices, and values to suggest the most suitable matches for meaningful connections.",
  },`
);

// FAQ 5
code = code.replace(
  'Upgrading to Premium unlocks unlimited likes, voice & video calls, advanced filters, horoscope matching, and much more.',
  'Upgrading to Premium unlocks unlimited likes, voice & video calls, advanced filters, mutual connections, and much more.'
);

// FAQ 6
code = code.replace(
  'Premium members also benefit from horoscope-weighted matching and priority placement.',
  'Premium members also benefit from priority discovery and placement.'
);

// Hero subtitle
code = code.replace(
  'traditions, and values — with horoscope matching, verified profiles,\n                and a community built on trust.',
  'traditions, and values — with verified profiles, intelligent compatibility,\n                and a community built on trust.'
);

// Feature 3
code = code.replace(
  /\{\s*icon:\s*<StarIcon size=\{22\} color="#fff" \/>,\s*title:\s*"Horoscope Matching",\s*text:\s*"[^"]+",?\s*\},/,
  `{
                  icon: <StarIcon size={22} color="#fff" />,
                  title: "Smart Compatibility",
                  text: "Deep preference and lifestyle compatibility built right into the platform — helping you find partners aligned with your family values.",
                },`
);

// Step 1
code = code.replace(
  'text: "Sign up free and complete your detailed profile — personal info, horoscope, preferences, and photos."',
  'text: "Sign up free and complete your detailed profile — personal info, background, preferences, and photos."'
);

// Step 3
code = code.replace(
  'text: "Explore compatible profiles filtered by your preferences, location, and horoscope compatibility."',
  'text: "Explore compatible profiles filtered by your preferences, location, education, and lifestyle."'
);

// Premium visual item 3
code = code.replace(
  'text: "Horoscope compatibility", sub: "Detailed chart analysis"',
  'text: "Value compatibility", sub: "Deep lifestyle analysis"'
);

// Premium list item 3
code = code.replace(
  'title: "Detailed horoscope reports", sub: "Full chart-to-chart compatibility analysis that your family will trust and respect."',
  'title: "Smart value alignment", sub: "In-depth compatibility analysis that ensures shared cultural and family principles."'
);

// Testimonial 1
code = code.replace(
  'quote: "SriMatch helped us find each other based on our traditional values and horoscope compatibility. We\'re now happily married for 2 years!"',
  'quote: "SriMatch helped us find each other based on our shared values and life goals. We\'re now happily married for 2 years!"'
);

// Testimonial 3
code = code.replace(
  'quote: "The horoscope matching feature was incredibly accurate! Our families were so impressed with how well our charts aligned. Thank you SriMatch!"',
  'quote: "The compatibility matching feature was incredibly accurate! Our families were so impressed with how well our values aligned. Thank you SriMatch!"'
);

// Trust row
code = code.replace(
  '<div className="lp-trust-item"><StarIcon size={12} /> Horoscope matching</div>',
  '<div className="lp-trust-item"><StarIcon size={12} /> Smart compatibility</div>'
);

fs.writeFileSync('srimatch-web/src/views/LandingPage.tsx', code, 'utf8');
console.log('LandingPage.tsx generated successfully!');
