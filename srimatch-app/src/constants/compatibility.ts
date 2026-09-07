export interface CompatibilityQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface CompatibilityCategory {
  category: string;
  icon: string;
  questions: CompatibilityQuestion[];
}

export const COMPATIBILITY_CATEGORIES: CompatibilityCategory[] = [
  {
    category: 'Values & Beliefs',
    icon: '🌍',
    questions: [
      { id: 'religion_importance', question: 'How important is religion in your life?', options: ['Very Important', 'Somewhat Important', 'Not Important'] },
      { id: 'religion_partner', question: 'Should your partner follow your religion?', options: ['Must', 'Preferred', 'Not necessary'] },
      { id: 'cultural_values', question: 'How important are cultural traditions?', options: ['Very Important', 'Moderate', 'Not Important'] },
      { id: 'political_views', question: 'Do political views matter in a relationship?', options: ['Very Important', 'Somewhat', 'Not Important'] },
    ],
  },
  {
    category: 'Relationship Goals',
    icon: '💍',
    questions: [
      { id: 'relationship_goal', question: 'What are you looking for?', options: ['Marriage', 'Serious relationship', 'Friendship first', 'Not sure'] },
      { id: 'marriage_timeline', question: 'When do you plan to get married?', options: ['Soon', '1-2 years', '3+ years', 'Not sure'] },
      { id: 'long_distance', question: 'Are you open to long-distance relationships?', options: ['Yes', 'Maybe', 'No'] },
    ],
  },
  {
    category: 'Family & Lifestyle',
    icon: '🏡',
    questions: [
      { id: 'family_size', question: "What's your ideal family size?", options: ['1–2 children', '3+ children', 'No children', 'Open'] },
      { id: 'living_arrangement', question: 'Preferred living arrangement after marriage?', options: ['With family', 'Nuclear', 'Close to parents', 'Open'] },
      { id: 'family_involvement', question: 'How involved should families be in your relationship?', options: ['Very involved', 'Moderate', 'Minimal'] },
    ],
  },
  {
    category: 'Career & Money',
    icon: '💼',
    questions: [
      { id: 'career_priority', question: 'How important is career in your life?', options: ['Very Important', 'Balanced', 'Less Important'] },
      { id: 'partner_work', question: 'Should both partners work?', options: ['Yes', 'Optional', 'Prefer one works'] },
      { id: 'financial_management', question: 'How should finances be handled?', options: ['Shared', 'Separate', 'Mixed'] },
    ],
  },
  {
    category: 'Location & Future',
    icon: '📍',
    questions: [
      { id: 'relocation', question: 'Would you consider relocating?', options: ['Anywhere', 'Sri Lanka only', 'Maybe', 'No'] },
      { id: 'abroad_plans', question: 'Do you plan to migrate abroad?', options: ['Yes', 'Maybe', 'No'] },
    ],
  },
  {
    category: 'Personality & Lifestyle',
    icon: '❤️',
    questions: [
      { id: 'social_type', question: 'Are you more introverted or extroverted?', options: ['Introvert', 'Extrovert', 'Ambivert'] },
      { id: 'free_time', question: 'How do you prefer to spend free time?', options: ['At home', 'Outdoor', 'Social events', 'Mixed'] },
      { id: 'travel_interest', question: 'How important is travel to you?', options: ['Very Important', 'Sometimes', 'Not Important'] },
    ],
  },
  {
    category: 'Habits',
    icon: '🚬',
    questions: [
      { id: 'smoking', question: 'Do you smoke?', options: ['Yes', 'Occasionally', 'No'] },
      { id: 'partner_smoking', question: 'Are you okay with a partner who smokes?', options: ['Yes', 'No', 'Depends'] },
      { id: 'drinking', question: 'Do you drink alcohol?', options: ['Yes', 'Occasionally', 'No'] },
      { id: 'partner_drinking', question: 'Are you okay with a partner who drinks?', options: ['Yes', 'No', 'Depends'] },
    ],
  },
  {
    category: 'Relationship Style',
    icon: '💞',
    questions: [
      { id: 'love_language', question: 'What is your love language?', options: ['Words', 'Actions', 'Gifts', 'Time', 'Touch'] },
      { id: 'conflict_resolution', question: 'How do you handle conflicts?', options: ['Talk immediately', 'Take time then talk', 'Avoid conflict'] },
      { id: 'jealousy', question: 'How do you feel about jealousy in a relationship?', options: ['Normal', 'Sometimes', 'Not acceptable'] },
    ],
  },
  {
    category: 'Children & Responsibility',
    icon: '🧒',
    questions: [
      { id: 'children_importance', question: 'How important is having children?', options: ['Very Important', 'Optional', 'Not Important'] },
      { id: 'parenting_style', question: 'Preferred parenting style?', options: ['Strict', 'Balanced', 'Relaxed'] },
    ],
  },
  {
    category: 'Modern Factors',
    icon: '📱',
    questions: [
      { id: 'social_media', question: 'How active are you on social media?', options: ['Very active', 'Moderate', 'Not active'] },
      { id: 'privacy_level', question: 'How private are you?', options: ['Very private', 'Moderate', 'Open'] },
    ],
  },
];
