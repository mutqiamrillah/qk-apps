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

/**
 * Mendapatkan nasihat harian secara acak.
 * Jika seedDateStr diberikan (format YYYY-MM-DD), pilihan akan deterministik harian (berganti setiap hari),
 * sekaligus mendukung random murni saat diminta.
 */
export function getRandomDailyWisdom(seedDateStr?: string): DailyWisdom {
  if (seedDateStr) {
    let hash = 0;
    for (let i = 0; i < seedDateStr.length; i++) {
      hash = (hash * 31 + seedDateStr.charCodeAt(i)) & 0xffffffff;
    }
    const idx = Math.abs(hash) % dailyWisdomList.length;
    return dailyWisdomList[idx];
  }
  const idx = Math.floor(Math.random() * dailyWisdomList.length);
  return dailyWisdomList[idx];
}

