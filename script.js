/* ============================= */
/*          تنظیمات و متغیرها     */
/* ============================= */
const EDITION = "quran-simple";

let displayedAyahs = [];
let favorites = [];
let currentAyah = null;

/* ============================= */
/*          داده‌ها               */
/* ============================= */
const surahNames = [
    "", "الفاتحه", "البقره", "آل عمران", "النساء", "المائده", "الأنعام", "الأعراف",
    "الأنفال", "التوبه", "یونس", "هود", "یوسف", "الرعد", "إبراهیم", "الحجر",
    "النحل", "الإسراء", "الکهف", "مریم", "طه", "الأنبیاء", "الحج", "المؤمنون",
    "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنکبوت", "الروم",
    "لقمان", "السجده", "الأحزاب", "سبأ", "فاطر", "یس", "الصافات", "ص", "الزمر",
    "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثیه", "الأحقاف", "محمد",
    "الفتح", "الحجرات", "ق", "الذاریات", "الطور", "النجم", "القمر", "الرحمن",
    "الواقعه", "الحدید", "المجادله", "الحشر", "الممتحنه", "الصف", "الجمعة",
    "المنافقون", "التغابن", "الطلاق", "التحریم", "الملک", "القلم", "الحاقه",
    "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القیامه", "الإنسان", "المرسلات",
    "النبأ", "النازعات", "عبس", "التکویر", "الإنفطار", "المطففین", "الإنشقاق",
    "البروج", "الطارق", "الأعلی", "الغاشیه", "الفجر", "البلد", "الشمس",
    "اللیل", "الضحی", "الشرح", "التین", "العلق", "القدر", "البینه", "الزلزله",
    "العادیات", "القارعه", "التکاثر", "العصر", "الهمزه", "الفیل", "قریش",
    "الماعون", "الکوثر", "الکافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

const suraVerses = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206,
    8: 75, 9: 129, 10: 109, 11: 123, 12: 111, 13: 43, 14: 52,
    15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135, 21: 112,
    22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88,
    29: 69, 30: 60, 31: 34, 32: 30, 33: 73, 34: 54, 35: 45,
    36: 83, 37: 182, 38: 88, 39: 75, 40: 85, 41: 54, 42: 53,
    43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18,
    50: 45, 51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96,
    57: 29, 58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11,
    64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
    71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50,
    78: 40, 79: 46, 80: 42, 81: 29, 82: 19, 83: 36, 84: 25,
    85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20, 91: 15,
    92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8,
    100: 11, 101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4,
    107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6
};

/* ============================= */
/*        عناصر DOM               */
/* ============================= */
const ayahContainer = document.getElementById("ayah-container");
const nextBtn = document.getElementById("next-btn");
const favoriteBtn = document.getElementById("favorite-btn");
const shareBtn = document.getElementById("share-btn");
const modeSwitch = document.getElementById("mode-switch");

/* ============================= */
/*       توابع کمکی              */
/* ============================= */
function populateSurahSelect() {
    const select = document.getElementById("surah-select");
    for (let num = 1; num <= 114; num++) {
        const option = document.createElement("option");
        option.value = num;
        option.textContent = `${num}. ${surahNames[num]}`;
        select.appendChild(option);
    }
}

async function fetchAyah(sura, ayahNum) {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${sura}:${ayahNum}/${EDITION}`);
    return response.json();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/* ============================= */
/*      بارگذاری آیه تصادفی      */
/* ============================= */
async function getRandomAyah() {
    const surahSelect = document.getElementById("surah-select").value;
    const sura = surahSelect || getRandomInt(114) + 1;

    while (true) {
        const ayahNum = getRandomInt(suraVerses[sura]) + 1;
        const key = `${sura}:${ayahNum}`;
        if (displayedAyahs.includes(key)) continue;

        try {
            const data = await fetchAyah(sura, ayahNum);
            if (data.data?.sajda?.obligatory) continue;

            displayedAyahs.push(key);
            currentAyah = {
                text: data.data.text,
                surah: data.data.surah.name,
                number: ayahNum
            };
            return `${data.data.text}\n\nسوره: ${data.data.surah.name}، آیه: ${ayahNum}`;
        } catch (err) {
            return `خطا در بارگذاری: ${err}`;
        }
    }
}

async function loadAyah() {
    ayahContainer.textContent = "در حال بارگذاری...";
    ayahContainer.textContent = await getRandomAyah();
}

/* ============================= */
/*        علاقه‌مندی‌ها           */
/* ============================= */
function addToFavorites() {
    if (currentAyah && !favorites.includes(`${currentAyah.surah}:${currentAyah.number}`)) {
        favorites.push(`${currentAyah.surah}:${currentAyah.number} - ${currentAyah.text}`);
        updateFavorites();
    }
}

function updateFavorites() {
    const container = document.getElementById('favorites');
    container.innerHTML = favorites.map(f => `<p>${f}</p>`).join('');
}

/* ============================= */
/*          ساعت نرم              */
/* ============================= */
function updateSoftClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' });
    document.getElementById("clock-soft").textContent = time;
}
setInterval(updateSoftClock, 1000);
updateSoftClock();

/* ============================= */
/*         دکمه‌ها و رویدادها     */
/* ============================= */
nextBtn.addEventListener("click", loadAyah);
favoriteBtn.addEventListener("click", addToFavorites);
shareBtn.addEventListener("click", () => {
    if (!currentAyah) return alert("آیه‌ای برای اشتراک‌گذاری موجود نیست!");
    navigator.clipboard.writeText(`${currentAyah.text}\n\nسوره: ${currentAyah.surah}، آیه: ${currentAyah.number}`)
        .then(() => alert("آیه کپی شد!"))
        .catch(err => alert("مشکل در کپی کردن آیه: " + err));
});

/* ============================= */
/*         حالت شب/روز           */
/* ============================= */
modeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", modeSwitch.checked);
});

function autoDarkMode() {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    document.body.classList.toggle("dark-mode", isNight);
    modeSwitch.checked = isNight;
}
autoDarkMode();
setInterval(autoDarkMode, 60000);
  const infoBox = document.getElementById('info-box');
  const closeBtn = document.getElementById('close-info');

  // بسته شدن با دکمه
  closeBtn.addEventListener('click', () => {
    infoBox.style.transition = 'opacity 0.5s';
    infoBox.style.opacity = '0';
    setTimeout(() => infoBox.remove(), 500);
  });

  // نمایش خودکار 5 ثانیه بعد
  setTimeout(() => {
    if(infoBox) {
      infoBox.style.transition = 'opacity 0.5s';
      infoBox.style.opacity = '0';
      setTimeout(() => infoBox.remove(), 500);
    }
  }, 5000);
/* ============================= */
/*        بارگذاری اولیه         */
/* ============================= */
populateSurahSelect();
loadAyah();
