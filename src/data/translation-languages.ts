// src/data/translation-languages.ts
// 15 core languages × 14 targets = 210 directional pair pages

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  slug: string;
  script: string;
  speakers: string;
  speakersShort: string;
  countries: string[];
  topCountry: string;
  offlineSupported: boolean;
  voiceCloneSupported: boolean;
  ocrSupported: boolean;
  arSupported: boolean;
  rtl: boolean;
  transliterationAvailable: boolean;
  funFact: string;
  greeting: string;
  thankYou: string;
  difficulty: string; // for English speakers
  dialects: string[];
  travelTip: string;
  formalityNote: string;
}

export const LANGUAGES: Language[] = [
  {
    code: 'en', name: 'English', nativeName: 'English', slug: 'english',
    script: 'Latin', speakers: '1.5 billion', speakersShort: '1.5B',
    countries: ['United States', 'United Kingdom', 'Australia', 'Canada', 'India', 'New Zealand', 'South Africa'],
    topCountry: 'United States', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'English borrows words from over 350 languages, making it one of the most lexically diverse languages in the world.',
    greeting: 'Hello', thankYou: 'Thank you', difficulty: '-',
    dialects: ['American English', 'British English', 'Australian English', 'Indian English'],
    travelTip: 'English is widely spoken as a second language in airports, hotels, and tourist areas globally.',
    formalityNote: 'English uses "you" for both formal and informal. Tone and word choice convey formality.',
  },
  {
    code: 'es', name: 'Spanish', nativeName: 'Español', slug: 'spanish',
    script: 'Latin', speakers: '559 million', speakersShort: '559M',
    countries: ['Spain', 'Mexico', 'Colombia', 'Argentina', 'Peru', 'Chile', 'Ecuador'],
    topCountry: 'Mexico', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'Spanish is the official language of 20 countries — more than any other language except English.',
    greeting: 'Hola', thankYou: 'Gracias', difficulty: 'Easy',
    dialects: ['Castilian (Spain)', 'Mexican Spanish', 'Rioplatense (Argentina)', 'Caribbean Spanish'],
    travelTip: 'In Latin America, "usted" (formal you) is used more broadly than in Spain. Use it with strangers.',
    formalityNote: 'Spanish has tú (informal) and usted (formal). Use usted in business and with elders.',
  },
  {
    code: 'fr', name: 'French', nativeName: 'Français', slug: 'french',
    script: 'Latin', speakers: '310 million', speakersShort: '310M',
    countries: ['France', 'Canada', 'Belgium', 'Switzerland', 'Senegal', 'Ivory Coast', 'Morocco'],
    topCountry: 'France', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'French is spoken on all five continents and is the second most studied language worldwide.',
    greeting: 'Bonjour', thankYou: 'Merci', difficulty: 'Moderate',
    dialects: ['Metropolitan French', 'Canadian French', 'Belgian French', 'Swiss French', 'African French'],
    travelTip: 'Always greet shopkeepers with "Bonjour" when entering — not doing so is considered rude in France.',
    formalityNote: 'French has tu (informal) and vous (formal). Always use vous with strangers and in business.',
  },
  {
    code: 'de', name: 'German', nativeName: 'Deutsch', slug: 'german',
    script: 'Latin', speakers: '134 million', speakersShort: '134M',
    countries: ['Germany', 'Austria', 'Switzerland', 'Luxembourg', 'Liechtenstein'],
    topCountry: 'Germany', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'German can create compound words of unlimited length — like "Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz."',
    greeting: 'Hallo', thankYou: 'Danke', difficulty: 'Moderate',
    dialects: ['Standard German', 'Austrian German', 'Swiss German', 'Bavarian'],
    travelTip: 'Germans value punctuality and directness. Small talk is less common than in English-speaking cultures.',
    formalityNote: 'German has du (informal) and Sie (formal). Use Sie in all professional and unfamiliar contexts.',
  },
  {
    code: 'hi', name: 'Hindi', nativeName: 'हिंदी', slug: 'hindi',
    script: 'Devanagari', speakers: '602 million', speakersShort: '602M',
    countries: ['India', 'Nepal', 'Fiji', 'Mauritius'],
    topCountry: 'India', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: false, transliterationAvailable: true,
    funFact: 'Hindi is written in Devanagari script, where every consonant carries an inherent "a" vowel sound.',
    greeting: 'नमस्ते (Namaste)', thankYou: 'धन्यवाद (Dhanyavaad)', difficulty: 'Hard',
    dialects: ['Standard Hindi', 'Urdu (mutually intelligible)', 'Braj', 'Awadhi', 'Rajasthani'],
    travelTip: 'In India, "Namaste" with palms together is the universal greeting — it works across all regions and religions.',
    formalityNote: 'Hindi has आप (aap, formal) and तुम (tum, informal). Use aap with elders and strangers.',
  },
  {
    code: 'ar', name: 'Arabic', nativeName: 'العربية', slug: 'arabic',
    script: 'Arabic', speakers: '422 million', speakersShort: '422M',
    countries: ['Saudi Arabia', 'Egypt', 'UAE', 'Morocco', 'Iraq', 'Jordan', 'Lebanon'],
    topCountry: 'Egypt', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: true, transliterationAvailable: true,
    funFact: 'Arabic is written right-to-left and has 28 letters that change shape based on their position in a word.',
    greeting: 'مرحبا (Marhaba)', thankYou: 'شكراً (Shukran)', difficulty: 'Very Hard',
    dialects: ['Modern Standard Arabic', 'Egyptian Arabic', 'Gulf Arabic', 'Levantine Arabic', 'Maghrebi Arabic'],
    travelTip: 'Arabic dialects vary greatly — Egyptian Arabic is the most widely understood due to Egyptian media.',
    formalityNote: 'Arabic formality is expressed through specific phrases and titles rather than pronoun changes.',
  },
  {
    code: 'ja', name: 'Japanese', nativeName: '日本語', slug: 'japanese',
    script: 'Kanji + Hiragana + Katakana', speakers: '125 million', speakersShort: '125M',
    countries: ['Japan'],
    topCountry: 'Japan', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: false, transliterationAvailable: true,
    funFact: 'Japanese uses three writing systems simultaneously — Kanji (Chinese characters), Hiragana, and Katakana.',
    greeting: 'こんにちは (Konnichiwa)', thankYou: 'ありがとう (Arigatou)', difficulty: 'Very Hard',
    dialects: ['Standard Japanese (Tokyo)', 'Kansai (Osaka/Kyoto)', 'Tohoku', 'Kyushu'],
    travelTip: 'Bowing is the standard greeting in Japan. A slight bow (15°) works for most casual situations.',
    formalityNote: 'Japanese has elaborate politeness levels — casual, polite (desu/masu), and honorific (keigo).',
  },
  {
    code: 'ko', name: 'Korean', nativeName: '한국어', slug: 'korean',
    script: 'Hangul', speakers: '81 million', speakersShort: '81M',
    countries: ['South Korea', 'North Korea'],
    topCountry: 'South Korea', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: false, transliterationAvailable: true,
    funFact: 'Hangul was scientifically designed by King Sejong in 1443 — each letter represents the mouth shape used to produce its sound.',
    greeting: '안녕하세요 (Annyeonghaseyo)', thankYou: '감사합니다 (Gamsahamnida)', difficulty: 'Hard',
    dialects: ['Seoul Standard', 'Gyeongsang (Busan)', 'Jeolla', 'Jeju'],
    travelTip: 'Age hierarchy is important in Korea. Ask someone\'s age early — it determines the speech level you use.',
    formalityNote: 'Korean has 7 speech levels. Use 합니다 (hapnida) style with strangers and in business.',
  },
  {
    code: 'zh', name: 'Chinese', nativeName: '中文', slug: 'chinese',
    script: 'Simplified Chinese / Traditional Chinese', speakers: '1.12 billion', speakersShort: '1.1B',
    countries: ['China', 'Taiwan', 'Singapore', 'Malaysia'],
    topCountry: 'China', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: false, transliterationAvailable: true,
    funFact: 'Mandarin Chinese has four tones — the same syllable "ma" can mean mother, hemp, horse, or scold depending on tone.',
    greeting: '你好 (Nǐ hǎo)', thankYou: '谢谢 (Xièxiè)', difficulty: 'Very Hard',
    dialects: ['Mandarin (Standard)', 'Cantonese', 'Shanghainese', 'Hokkien', 'Hakka'],
    travelTip: 'In mainland China, most apps and websites are blocked. Download offline translation before arrival.',
    formalityNote: 'Chinese uses 你 (nǐ, informal) and 您 (nín, formal). Use nín with elders and authority figures.',
  },
  {
    code: 'ru', name: 'Russian', nativeName: 'Русский', slug: 'russian',
    script: 'Cyrillic', speakers: '255 million', speakersShort: '255M',
    countries: ['Russia', 'Belarus', 'Kazakhstan', 'Kyrgyzstan', 'Ukraine'],
    topCountry: 'Russia', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: false, transliterationAvailable: true,
    funFact: 'Russian uses the Cyrillic alphabet with 33 letters, including some that look like Latin letters but sound completely different.',
    greeting: 'Привет (Privet)', thankYou: 'Спасибо (Spasibo)', difficulty: 'Hard',
    dialects: ['Standard Russian (Moscow)', 'Southern Russian', 'Northern Russian'],
    travelTip: 'Few people in Russia speak English outside major cities. Camera translation and offline mode are essential.',
    formalityNote: 'Russian has ты (ty, informal) and вы (vy, formal). Use вы with anyone you don\'t know well.',
  },
  {
    code: 'pt', name: 'Portuguese', nativeName: 'Português', slug: 'portuguese',
    script: 'Latin', speakers: '264 million', speakersShort: '264M',
    countries: ['Brazil', 'Portugal', 'Mozambique', 'Angola', 'Cape Verde'],
    topCountry: 'Brazil', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'Brazilian Portuguese and European Portuguese differ as much as American and British English — sometimes more.',
    greeting: 'Olá', thankYou: 'Obrigado/Obrigada', difficulty: 'Easy',
    dialects: ['Brazilian Portuguese', 'European Portuguese', 'African Portuguese'],
    travelTip: 'In Brazil, people are very warm and physical — hugs and cheek kisses are common greetings among acquaintances.',
    formalityNote: 'Portuguese has tu/você (informal) and o senhor/a senhora (formal). Brazil uses você more widely.',
  },
  {
    code: 'it', name: 'Italian', nativeName: 'Italiano', slug: 'italian',
    script: 'Latin', speakers: '68 million', speakersShort: '68M',
    countries: ['Italy', 'Switzerland', 'San Marino', 'Vatican City'],
    topCountry: 'Italy', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'Italian has more words for pasta shapes (over 350) than most languages have for any single food category.',
    greeting: 'Ciao', thankYou: 'Grazie', difficulty: 'Easy',
    dialects: ['Standard Italian (Tuscan)', 'Neapolitan', 'Sicilian', 'Venetian', 'Roman'],
    travelTip: 'In Italy, "ciao" is only for friends. Use "buongiorno" (good day) or "buonasera" (good evening) with strangers.',
    formalityNote: 'Italian has tu (informal) and Lei (formal). Use Lei in shops, restaurants, and with older people.',
  },
  {
    code: 'tr', name: 'Turkish', nativeName: 'Türkçe', slug: 'turkish',
    script: 'Latin', speakers: '88 million', speakersShort: '88M',
    countries: ['Turkey', 'Cyprus', 'Germany', 'Netherlands'],
    topCountry: 'Turkey', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'Turkish is agglutinative — you can express an entire English sentence in a single Turkish word by adding suffixes.',
    greeting: 'Merhaba', thankYou: 'Teşekkür ederim', difficulty: 'Moderate',
    dialects: ['Istanbul Turkish (Standard)', 'Anatolian dialects', 'Rumelian'],
    travelTip: 'Turkish hospitality is legendary — refusing tea (çay) can be seen as impolite. Accept at least one cup.',
    formalityNote: 'Turkish has sen (informal) and siz (formal). Use siz with elders, officials, and in business.',
  },
  {
    code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', slug: 'vietnamese',
    script: 'Latin (Vietnamese alphabet)', speakers: '85 million', speakersShort: '85M',
    countries: ['Vietnam'],
    topCountry: 'Vietnam', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: true, rtl: false, transliterationAvailable: false,
    funFact: 'Vietnamese has six tones — the word "ma" can mean ghost, mother, but, horse, tomb, or rice seedling depending on tone.',
    greeting: 'Xin chào', thankYou: 'Cảm ơn', difficulty: 'Hard',
    dialects: ['Northern (Hanoi)', 'Central (Huế)', 'Southern (Ho Chi Minh City)'],
    travelTip: 'In Vietnam, pointing with your finger is considered rude. Use your whole hand, palm facing down.',
    formalityNote: 'Vietnamese pronouns change based on age and relationship. Use "anh" (older male) or "chị" (older female) with strangers.',
  },
  {
    code: 'th', name: 'Thai', nativeName: 'ไทย', slug: 'thai',
    script: 'Thai', speakers: '61 million', speakersShort: '61M',
    countries: ['Thailand'],
    topCountry: 'Thailand', offlineSupported: true, voiceCloneSupported: true, ocrSupported: true, arSupported: false, rtl: false, transliterationAvailable: true,
    funFact: 'Thai has 44 consonants, 15 vowel symbols, and 5 tones. The Thai script has no spaces between words.',
    greeting: 'สวัสดี (Sawasdee)', thankYou: 'ขอบคุณ (Khob khun)', difficulty: 'Very Hard',
    dialects: ['Central Thai (Standard)', 'Northern Thai (Lanna)', 'Northeastern Thai (Isan)', 'Southern Thai'],
    travelTip: 'The Thai "wai" (palms pressed together with slight bow) is the standard greeting — return it when received.',
    formalityNote: 'Thai uses ครับ (khrap, male) and ค่ะ (kha, female) as polite particles at the end of sentences.',
  },
];

// Helper: get language by code
export function getLang(code: string): Language | undefined {
  return LANGUAGES.find(l => l.code === code);
}

// Helper: generate all directional pairs
export function getAllPairs(): Array<{ source: Language; target: Language; slug: string }> {
  const pairs: Array<{ source: Language; target: Language; slug: string }> = [];
  for (const source of LANGUAGES) {
    for (const target of LANGUAGES) {
      if (source.code !== target.code) {
        pairs.push({
          source,
          target,
          slug: `${source.slug}-to-${target.slug}`,
        });
      }
    }
  }
  return pairs;
}

// Common phrases for pair pages (English base — translations in phrases file)
export const PHRASE_KEYS = [
  'hello', 'goodbye', 'thank_you', 'please', 'sorry',
  'how_much', 'where_is', 'i_dont_understand', 'help',
  'yes', 'no', 'good_morning', 'good_night',
  'my_name_is', 'do_you_speak_english', 'bathroom',
  'restaurant', 'hotel', 'airport', 'hospital',
] as const;

export type PhraseKey = typeof PHRASE_KEYS[number];

export const PHRASE_LABELS: Record<PhraseKey, string> = {
  hello: 'Hello',
  goodbye: 'Goodbye',
  thank_you: 'Thank you',
  please: 'Please',
  sorry: 'Sorry / Excuse me',
  how_much: 'How much does it cost?',
  where_is: 'Where is...?',
  i_dont_understand: 'I don\'t understand',
  help: 'Help!',
  yes: 'Yes',
  no: 'No',
  good_morning: 'Good morning',
  good_night: 'Good night',
  my_name_is: 'My name is...',
  do_you_speak_english: 'Do you speak English?',
  bathroom: 'Where is the bathroom?',
  restaurant: 'Can you recommend a restaurant?',
  hotel: 'I have a reservation',
  airport: 'Where is the airport?',
  hospital: 'I need a hospital',
};