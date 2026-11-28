export interface DailyWisdom {
  id: string;
  sourceType: "Quran" | "Hadith";
  sourceRef: string;
  arabic: string;
  translation: string;
  theme: string;
}

export const dailyWisdomList: DailyWisdom[] = [
  {
    id: "dw-1",
    sourceType: "Quran",
    sourceRef: "QS. Al-Baqarah: 153",
    theme: "Sabar & Shalat",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Sungguh, Allah beserta orang-orang yang sabar.",
  },
  {
    id: "dw-2",
    sourceType: "Hadith",
    sourceRef: "HR. Muslim no. 2699",
    theme: "Keutamaan Menuntut Ilmu",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    translation: "Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga.",
  },
  {
    id: "dw-3",
    sourceType: "Quran",
    sourceRef: "QS. Al-Insyirah: 5-6",
    theme: "Kemudahan Setelah Kesulitan",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Maka sesungguhnya bersama kesulitan ada kemudahan, sesungguhnya bersama kesulitan ada kemudahan.",
  },
  {
    id: "dw-4",
    sourceType: "Hadith",
    sourceRef: "HR. Bukhari no. 6412",
    theme: "Menjaga Waktu & Kesehatan",
    arabic: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ",
    translation: "Dua kenikmatan yang sering memperdaya banyak manusia: kesehatan dan waktu luang.",
  },
  {
    id: "dw-5",
    sourceType: "Quran",
    sourceRef: "QS. Ibrahim: 7",
    theme: "Kunci Tambahan Nikmat",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    translation: "Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu, tetapi jika kamu mengingkari (nikmat-Ku), maka sesungguhnya azab-Ku sangat pedih.",
  },
  {
    id: "dw-6",
    sourceType: "Hadith",
    sourceRef: "HR. At-Tirmidzi no. 2516",
    theme: "Penjagaan Allah",
    arabic: "احْفَظِ اللَّهَ يَحْفَظْكَ ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ",
    translation: "Jagalah Allah, niscaya Dia akan menjagamu. Jagalah Allah, niscaya engkau mendapati-Nya di hadapanmu.",
  },
  {
    id: "dw-7",
    sourceType: "Quran",
    sourceRef: "QS. At-Talaq: 3",
    theme: "Tawakkal yang Sempurna",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ",
    translation: "Dan barangsiapa bertawakkal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
  },
  {
    id: "dw-8",
    sourceType: "Hadith",
    sourceRef: "HR. Muslim no. 2999",
    theme: "Ketenangan Jiwa Mukmin",
    arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
    translation: "Sungguh menakjubkan urusan seorang mukmin, semua urusannya adalah baik baginya. Jika mendapatkan kesenangan ia bersyukur, dan itu baik baginya. Jika ditimpa kesulitan ia bersabar, dan itu pun baik baginya.",
  },
  {
    id: "dw-9",
    sourceType: "Quran",
    sourceRef: "QS. Al-Baqarah: 286",
    theme: "Keringanan dari Allah",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah tidak membebani seseorang melainkan sesuai dengan batas kesanggupannya.",
  },
  {
    id: "dw-10",
    sourceType: "Hadith",
    sourceRef: "HR. Bukhari no. 1",
    theme: "Keikhlasan Niat",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation: "Sesungguhnya setiap amal perbuatan tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.",
  },
  {
    id: "dw-11",
    sourceType: "Hadith",
    sourceRef: "HR. Ath-Thabrani, dinilai Hasan",
    theme: "Kemanfaatan Hidup",
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    translation: "Sebaik-baik manusia adalah yang paling bermanfaat bagi sesama manusia.",
  },
  {
    id: "dw-12",
    sourceType: "Quran",
    sourceRef: "QS. Az-Zumar: 53",
    theme: "Rahmat & Ampunan",
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Katakanlah: 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.'",
  },
];

const hadithWisdomList = dailyWisdomList.filter((item) => item.sourceType === "Hadith");

/**
 * Mendapatkan nasihat hadits harian secara acak dari daftar kurasi lokal (instant & fallback offline).
 * Jika seedDateStr diberikan (format YYYY-MM-DD), pilihan akan deterministik harian (berganti setiap hari),
 * sekaligus mendukung random murni saat diminta.
 */
export function getRandomDailyWisdom(seedDateStr?: string): DailyWisdom {
  const pool = hadithWisdomList.length > 0 ? hadithWisdomList : dailyWisdomList;
  if (seedDateStr) {
    let hash = 0;
    for (let i = 0; i < seedDateStr.length; i++) {
      hash = (hash * 31 + seedDateStr.charCodeAt(i)) & 0xffffffff;
    }
    const idx = Math.abs(hash) % pool.length;
    return pool[idx];
  }
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

const DAILY_WISDOM_CACHE_PREFIX = "qk_daily_wisdom_cache_";
const API_TIMEOUT_MS = 5000;

const HADITH_BOOKS = [
  { id: "bukhari", label: "HR. Bukhari", max: 3000 },
  { id: "muslim", label: "HR. Muslim", max: 2500 },
  { id: "tirmidzi", label: "HR. At-Tirmidzi", max: 2500 },
  { id: "abu-daud", label: "HR. Abu Daud", max: 2500 },
] as const;

function seededNumber(seed: string, maxExclusive: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33 + seed.charCodeAt(i)) & 0x7fffffff;
  }
  return hash % maxExclusive;
}

async function fetchJsonWithTimeout(url: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFromHadithApi(seedDateStr?: string): Promise<DailyWisdom | null> {
  const bookIdx = seedDateStr
    ? seededNumber(`${seedDateStr}-book`, HADITH_BOOKS.length)
    : Math.floor(Math.random() * HADITH_BOOKS.length);
  const book = HADITH_BOOKS[bookIdx];

  const hadithNo = seedDateStr
    ? seededNumber(`${seedDateStr}-hadith-no`, book.max) + 1
    : Math.floor(Math.random() * book.max) + 1;

  const json = await fetchJsonWithTimeout(
    `https://api.hadith.gading.dev/books/${book.id}/${hadithNo}`
  );
  const contents = json?.data?.contents;

  if (typeof contents?.arab !== "string" || typeof contents?.id !== "string") {
    return null;
  }

  const arabic = contents.arab.trim();
  const translation = contents.id.trim();
  if (!arabic || !translation) return null;

  const resolvedNumber = contents.number ?? hadithNo;
  return {
    id: `hadith-${book.id}-${resolvedNumber}`,
    sourceType: "Hadith",
    sourceRef: `${book.label} no. ${resolvedNumber}`,
    theme: "Hadits Pilihan",
    arabic,
    translation,
  };
}

function isValidWisdom(item: any): item is DailyWisdom {
  return Boolean(
    item &&
      typeof item.id === "string" &&
      (item.sourceType === "Quran" || item.sourceType === "Hadith") &&
      typeof item.sourceRef === "string" &&
      typeof item.arabic === "string" &&
      typeof item.translation === "string" &&
      typeof item.theme === "string" &&
      item.arabic.length > 0 &&
      item.translation.length > 0
  );
}

/**
 * Mengambil kutipan Hadits (Gading Hadith API) secara live,
 * dengan cache harian di localStorage dan fallback otomatis ke daftar hadits kurasi lokal jika offline.
 */
export async function fetchDailyWisdom(seedDateStr?: string): Promise<DailyWisdom> {
  if (seedDateStr && typeof window !== "undefined") {
    const cachedRaw = localStorage.getItem(`${DAILY_WISDOM_CACHE_PREFIX}${seedDateStr}`);
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw);
        if (isValidWisdom(parsed) && parsed.sourceType === "Hadith") {
          return parsed;
        }
      } catch {
        // ignore invalid cache
      }
    }
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fetchFromHadithApi(attempt === 0 ? seedDateStr : undefined);
      if (isValidWisdom(result) && result.sourceType === "Hadith") {
        if (seedDateStr && typeof window !== "undefined") {
          localStorage.setItem(
            `${DAILY_WISDOM_CACHE_PREFIX}${seedDateStr}`,
            JSON.stringify(result)
          );
        }
        return result;
      }
    } catch {
      // Retry once or fallback to local curated hadith
    }
  }

  return getRandomDailyWisdom(seedDateStr);
}

