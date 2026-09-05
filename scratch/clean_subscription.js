const fs = require('fs');
const { execSync } = require('child_process');

let code = fs.readFileSync('srimatch-web/src/views/SubscriptionPage.tsx', 'utf8');

const missingBlock = `  const [boostPaymentMethod, setBoostPaymentMethod] = useState("manual");
  const [boostReceiptFile, setBoostReceiptFile] = useState(null);
  const [submittingBoostReceipt, setSubmittingBoostReceipt] = useState(false);

  // ── TikTok Spotlight modal states ──
  const [selectedTiktokPkg, setSelectedTiktokPkg] = useState(null);
  const [tiktokSlipFile, setTiktokSlipFile] = useState(null);
  const [showTiktokModal, setShowTiktokModal] = useState(false);
  const [submittingTiktok, setSubmittingTiktok] = useState(false);

  const features = [
    {
      name: "Daily Likes",
      icon: <HeartIcon size={14} style={{ color: "#c9856a" }} />,
      free: "5 per day",
      premium: "Unlimited",
    },
    {
      name: "See Who Liked You",
      icon: <EyeIcon size={14} style={{ color: "#3a6ea8" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Voice & Video Calls",
      icon: <PhoneCallIcon size={14} style={{ color: "#5aaa7a" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Advanced Filters",
      icon: <SlidersIcon size={14} style={{ color: "#6a40a8" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Message Before Connect",
      icon: <MessageCircleIcon size={14} style={{ color: "#c07030" }} />,
      free: "—",
      premium: "3 messages",
    },
    {
      name: "Profile Boost",
      icon: <TrendingUpIcon size={14} style={{ color: "#c93a1a" }} />,
      free: false,
      premium: "1 boost (5 days)",
    },
    {
      name: "Verified Badge",
      icon: <ShieldCheckIcon size={14} style={{ color: "#5aaa7a" }} />,
      free: false,
      premium: true,
    },
  ];

  const whyItems = [
    {
      icon: <HeartIcon size={18} color="#fff" />,
      title: "Find your match faster",
      text: "Premium members match 3× faster with unlimited likes and advanced filters.",
    },
    {
      icon: <EyeIcon size={18} color="#fff" />,
      title: "See who likes you",
      text: "Discover profiles that have already expressed interest in you.",
    },
    {
      icon: <ShieldCheckIcon size={18} color="#fff" />,
      title: "Trusted & verified",
      text: "Premium accounts get verified badges, building trust with potential matches.",
    },
  ];

  const testimonials = [
    {
      quote: "Within two weeks of upgrading, I found my now-fiancée. The advanced filters helped me find someone truly compatible.",
      name: "Kasun P.",
      loc: "Colombo",
      initials: "KP",
    },
    {
      quote: "The value and preference compatibility features are wonderful — very important for our families. Premium was absolutely worth it.",
      name: "Malini S.",
      loc: "Kandy",
      initials: "MS",
    },
    {
      quote: "Being able to message before connecting helped me feel comfortable before sharing contact details.",
      name: "Dinesh R.",
      loc: "Galle",
      initials: "DR",
    },
    {
      quote: "Profile boost got me so many more views! Met my husband within a month of using it.",
      name: "Thilini W.",
      loc: "Negombo",
      initials: "TW",
    },
  ];`;

code = code.replace(/const \[selectedBoostPkg, setSelectedBoostPkg\] = useState\(null\);[\s\S]*?name: "Thilini W\."[\s\S]*?initials: "TW",\s*\},\s*\];/, 'const [selectedBoostPkg, setSelectedBoostPkg] = useState(null);\n' + missingBlock);

fs.writeFileSync('srimatch-web/src/views/SubscriptionPage.tsx', code, 'utf8');
console.log('SubscriptionPage.tsx updated successfully');
