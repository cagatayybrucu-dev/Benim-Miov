import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "benim-miov-web-data-v6";

const AGE_OPTIONS = [
  "0-2 aylık",
  "2-4 aylık",
  "4-6 aylık",
  "6-12 aylık",
  "1 yaş",
  "2 yaş",
  "3 yaş",
  "4 yaş",
  "5 yaş",
  "6 yaş",
  "7 yaş",
  "8 yaş",
  "9 yaş",
  "10+ yaş",
];

const TURKEY_CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

const VACCINE_SCHEDULE = {
  "İç Parazit": { days: 60, label: "60 gün sonra" },
  "Dış Parazit": { days: 30, label: "30 gün sonra" },
  "Karma Aşı": { days: 365, label: "Yılda bir" },
  Kuduz: { days: 365, label: "Yılda bir" },
  "Lösemi Aşısı": { days: 365, label: "Yılda bir" },
  "Gençlik Aşısı": { days: 365, label: "Yılda bir" },
};

const GPS_DATA = {
  1: { status: "Canlı Konum Aktif", battery: 82, accuracy: "2.4 m", location: "Kadıköy / Moda Parkı Yakını", lastSeen: "2 dk önce", safeZone: "Ev Bölgesi", activity: "Hafif hareketli" },
  2: { status: "Canlı Konum Aktif", battery: 67, accuracy: "4.1 m", location: "Beşiktaş / Ihlamur Çevresi", lastSeen: "1 dk önce", safeZone: "Veteriner Rotası", activity: "Dinleniyor" },
};

const FOOD_RECOMMENDATIONS = [
  { id: 1, brand: "Royal Canin", product: "Sterilised Kitten", category: "Kısır yavru", usage: "6-12 aylık kısır yavrularda günlük porsiyon bölünerek verilir.", when: "Kısırlaştırılmış yavru kediler", notes: "Büyüme ve sindirim dengesine odaklı.", logo: "https://www.royalcanin.com/favicon.ico", site: "https://www.royalcanin.com/" },
  { id: 2, brand: "Royal Canin", product: "Indoor Adult", category: "Indoor", usage: "Evde yaşayan yetişkin kedilerde günlük ana mama olarak kullanılabilir.", when: "Indoor yaşam ve hairball kontrolü", notes: "Ev yaşamına uygun enerji dengesi.", logo: "https://www.royalcanin.com/favicon.ico", site: "https://www.royalcanin.com/" },
  { id: 3, brand: "Hill's Science Diet", product: "Sensitive Stomach & Skin", category: "Hassas mide / deri", usage: "Sindirim veya deri hassasiyeti olan yetişkin kedilerde düzenli kullanım.", when: "Hassas mide, deri ve tüy desteği", notes: "Kolay sindirilebilir içerik ve Omega desteği.", logo: "https://www.hillspet.com/favicon.ico", site: "https://www.hillspet.com/" },
  { id: 4, brand: "Hill's Science Diet", product: "Urinary & Hairball Control", category: "Üriner + hairball", usage: "Tüy yumağı ve üriner sistem desteği gereken kedilerde günlük kullanım.", when: "İdrar yolu desteği ve hairball ihtiyacı", notes: "Doğal lif ve mineral dengesi odaklı.", logo: "https://www.hillspet.com/favicon.ico", site: "https://www.hillspet.com/" },
  { id: 5, brand: "Purina Pro Plan", product: "Sensitive Skin & Stomach", category: "Hassas sistem", usage: "Mide hassasiyeti olan kediler için kademeli geçişle başlanır.", when: "Sindirim ve deri hassasiyeti", notes: "Sindirim sağlığı ve tüy kalitesi odağı vardır.", logo: "https://www.purina.com/favicon.ico", site: "https://www.purina.com/" },
  { id: 6, brand: "Farmina N&D", product: "Quinoa Neutered", category: "Kısır", usage: "Kısır kedilerde kilo kontrolü odağıyla kullanılabilir.", when: "Kilo alma eğilimi olan kısır kediler", notes: "Neutered ihtiyaçlarına özel yaklaşım.", logo: "https://www.farmina.com/favicon.ico", site: "https://www.farmina.com/" },
  { id: 7, brand: "Acana", product: "Indoor Entrée", category: "Indoor / kondisyon", usage: "Evde yaşayan ve kondisyon takibi gereken kedilerde günlük kullanılabilir.", when: "Indoor yaşam ve kilo yönetimi", notes: "Hairball ve kondisyon yönetimine yardımcı olur.", logo: "https://www.acana.com/favicon.ico", site: "https://www.acana.com/" },
  { id: 8, brand: "Orijen", product: "Guardian 8", category: "Genel sağlık", usage: "Yüksek proteinli beslenme isteyen yetişkin kedilerde tercih edilebilir.", when: "Genel sağlık desteği ve aktif kediler", notes: "Çoklu sağlık odağına sahip seri.", logo: "https://www.orijenpetfoods.com/favicon.ico", site: "https://www.orijenpetfoods.com/" },
];

const REMINDERS = [
  { title: "Aşı Hatırlatması", detail: "Hera için karma aşı randevusu 24 Nisan'da.", icon: "💉" },
  { title: "Mama Stoğu", detail: "Kuru mama azalmaya başladı, stok kontrolü yap.", icon: "🍗" },
  { title: "Vitamin Takibi", detail: "Misket için omega desteği yarın verilecek.", icon: "💊" },
];

const FEATURED_CITY_VETS = {
  "İstanbul": [
    { id: 1, name: "ModaVet Klinik", district: "Kadıköy", distance: "1.2 km", eta: "6 dk", address: "Moda Caddesi No:14", phone: "0212 555 10 10" },
    { id: 2, name: "Beşiktaş Pet Sağlık", district: "Beşiktaş", distance: "3.8 km", eta: "11 dk", address: "Ihlamur Yolu No:8", phone: "0212 555 20 20" },
    { id: 3, name: "Şişli Acil Vet", district: "Şişli", distance: "5.1 km", eta: "16 dk", address: "Halaskargazi Cd. No:77", phone: "0212 555 30 30" }
  ],
  "Ankara": [
    { id: 1, name: "Çankaya Vet Merkezi", district: "Çankaya", distance: "1.5 km", eta: "7 dk", address: "Tunalı Hilmi No:52", phone: "0312 555 10 10" },
    { id: 2, name: "Koru Hayvan Kliniği", district: "Yenimahalle", distance: "4.2 km", eta: "13 dk", address: "Koru Mah. 1420 Sokak", phone: "0312 555 20 20" },
    { id: 3, name: "Bilkent Pet Acil", district: "Bilkent", distance: "6.0 km", eta: "18 dk", address: "Üniversiteler Mah. 1600 Cad.", phone: "0312 555 30 30" }
  ],
  "İzmir": [
    { id: 1, name: "Alsancak Pet Clinic", district: "Konak", distance: "1.1 km", eta: "5 dk", address: "Kıbrıs Şehitleri Cad.", phone: "0232 555 10 10" },
    { id: 2, name: "Karşıyaka Veteriner", district: "Karşıyaka", distance: "3.4 km", eta: "10 dk", address: "Girne Bulvarı No:24", phone: "0232 555 20 20" }
  ],
  "Bursa": [
    { id: 1, name: "Nilüfer Vet House", district: "Nilüfer", distance: "1.7 km", eta: "8 dk", address: "FSM Bulvarı", phone: "0224 555 10 10" }
  ],
  "Antalya": [
    { id: 1, name: "Lara Pet Care", district: "Muratpaşa", distance: "1.4 km", eta: "6 dk", address: "Lara Cad. No:93", phone: "0242 555 10 10" }
  ]
};

const INITIAL_ADOPTIONS = [
  { id: 1, name: "Boncuk", age: "6-12 aylık", breed: "British Shorthair", city: "İstanbul", note: "Oyuncu, kum eğitimi var, sakin bir eve uyum sağlar.", image: "https://cdn2.thecatapi.com/images/dbQ6j9zO8.jpg", owner: "Sena A." },
  { id: 2, name: "Tarçın", age: "2 yaş", breed: "Scottish Fold", city: "Ankara", note: "Sessiz yapılı, düzenli veteriner kontrolleri yapıldı.", image: "https://cdn2.thecatapi.com/images/3btzAjRh1.jpg", owner: "Mert K." },
];

const INITIAL_CATS = [
  { id: 1, name: "Hera", age: "2 yaş", breed: "Scottish Fold", breedId: "sfol", nextVaccine: "24 Nisan 2026", foodLevel: 68, vitaminStatus: "Bugün verildi", healthNote: "Enerjisi iyi, iştahı normal.", image: "https://cdn2.thecatapi.com/images/3btzAjRh1.jpg", weight: "4.2 kg", gender: "Dişi", lastVetVisit: "12 Nisan 2026", notes: [{ id: 1, text: "Bugün su tüketimi iyiydi.", createdAt: "20 Nisan 2026" }, { id: 2, text: "Sabah oyun süresi uzundu, enerjisi yüksekti.", createdAt: "19 Nisan 2026" }], vaccines: [{ id: 1, name: "Karma Aşı", date: "24 Nisan 2026", status: "Yaklaşıyor", nextDate: "24 Nisan 2027", intervalLabel: "Yılda bir" }, { id: 2, name: "İç Parazit", date: "10 Mart 2026", status: "Tamamlandı", nextDate: "09 Mayıs 2026", intervalLabel: "60 gün sonra" }], routines: [{ id: 1, label: "Sabah Maması", value: "Tamamlandı" }, { id: 2, label: "Vitamin", value: "Verildi" }] },
  { id: 2, name: "Misket", age: "8 aylık", breed: "Aegean", breedId: "aege", nextVaccine: "30 Nisan 2026", foodLevel: 42, vitaminStatus: "Yarın verilecek", healthNote: "Su tüketimi takip edilmeli.", image: "https://cdn2.thecatapi.com/images/ozEvzdVM-.jpg", weight: "3.1 kg", gender: "Erkek", lastVetVisit: "05 Nisan 2026", notes: [{ id: 1, text: "Akşam mamasını yarım bıraktı.", createdAt: "20 Nisan 2026" }], vaccines: [{ id: 1, name: "Gençlik Aşısı", date: "30 Nisan 2026", status: "Yaklaşıyor", nextDate: "30 Nisan 2027", intervalLabel: "Yılda bir" }], routines: [{ id: 1, label: "Akşam Maması", value: "Bekliyor" }, { id: 2, label: "Omega Desteği", value: "Yarın" }] },
];

const BREED_IMAGE_MAP = {
  abys: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
  aege: "https://cdn2.thecatapi.com/images/ozEvzdVM-.jpg",
  bamb: "https://cdn2.thecatapi.com/images/5iYq9NmT1.jpg",
  beng: "https://cdn2.thecatapi.com/images/O3btzLlsO.png",
  birm: "https://cdn2.thecatapi.com/images/HOrX5gwLS.jpg",
  bomb: "https://cdn2.thecatapi.com/images/5iYq9NmT1.jpg",
  bsho: "https://cdn2.thecatapi.com/images/dbQ6j9zO8.jpg",
  bslo: "https://cdn2.thecatapi.com/images/vJB8rwfdX.jpg",
  bure: "https://cdn2.thecatapi.com/images/BkwndLArl.jpg",
  char: "https://cdn2.thecatapi.com/images/KoI_Yz8r3.jpg",
  drex: "https://cdn2.thecatapi.com/images/8pCFG7t2x.jpg",
  kora: "https://cdn2.thecatapi.com/images/DbwiefiaY.png",
  maine: "https://cdn2.thecatapi.com/images/OOI-aI6vd.jpg",
  norw: "https://cdn2.thecatapi.com/images/2N8dH3Q8f.jpg",
  ocic: "https://cdn2.thecatapi.com/images/JAx-08Y0n.jpg",
  pers: "https://cdn2.thecatapi.com/images/-Zfz5z2jK.jpg",
  ragd: "https://cdn2.thecatapi.com/images/7J5f4xmgM.jpg",
  siam: "https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg",
  sphy: "https://cdn2.thecatapi.com/images/BDb8ZXb1v.jpg",
  sfol: "https://cdn2.thecatapi.com/images/3btzAjRh1.jpg",
  sib: "https://cdn2.thecatapi.com/images/3bkZAjRh1.jpg",
  tonk: "https://cdn2.thecatapi.com/images/9siHAkl9r.jpg",
  turi: "https://cdn2.thecatapi.com/images/pXFxGe7zx.jpg",
};

const TEMPERAMENT_TR = {
  Active: "Aktif", Agile: "Atik", Alert: "Dikkatli", Affectionate: "Sevecen", Amiable: "Uyumlu", Athletic: "Atletik", Calm: "Sakin", Clever: "Zeki", Curious: "Meraklı", Demanding: "İlgi isteyen", Dependent: "Bağlı", Devoted: "Sadık", EasyGoing: "Rahat", Energetic: "Enerjik", Friendly: "Dost canlısı", Gentle: "Nazik", Independent: "Bağımsız", Intelligent: "Akıllı", Interactive: "Etkileşimi seven", Lively: "Canlı", Loving: "Sevgi dolu", Loyal: "Sadık", Mischievous: "Yaramaz", Moderate: "Dengeli", Outgoing: "Dışa dönük", Patient: "Sabırlı", Peaceful: "Huzurlu", Playful: "Oyuncu", Quiet: "Sessiz", Reserved: "Mesafeli", Responsive: "Tepkili", Sensitive: "Hassas", Social: "Sosyal", Sweet: "Tatlı huylu", Talkative: "Konuşkan", Trainable: "Eğitilebilir",
};

function formatDateForDisplay(value) {
  if (!value) return "Tarih yok";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function normalizeCity(city) {
  if (!city) return city;
  if (city === "Istanbul") return "İstanbul";
  if (city === "Izmir") return "İzmir";
  return city;
}

function getBreedImage(breed) {
  return BREED_IMAGE_MAP[breed?.id] || breed?.image?.url || "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg";
}

async function fetchBreedImageFromApi(breedId) {
  if (!breedId) return "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg";
  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${breedId}`);
    const data = await response.json();
    return data?.[0]?.url || BREED_IMAGE_MAP[breedId] || "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg";
  } catch {
    return BREED_IMAGE_MAP[breedId] || "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg";
  }
}

function translateTemperamentList(text) {
  if (!text) return [];
  return text.split(",").map((item) => item.trim()).filter(Boolean).map((item) => TEMPERAMENT_TR[item] || item).slice(0, 6);
}

function calculateNextVaccineDate(vaccineName, appliedDate) {
  if (!vaccineName || !appliedDate) return { nextDate: "Tarih yok", intervalLabel: "Belirsiz" };
  const rule = VACCINE_SCHEDULE[vaccineName];
  if (!rule) return { nextDate: "Elle planlanmalı", intervalLabel: "Özel plan" };
  const base = new Date(appliedDate);
  if (Number.isNaN(base.getTime())) return { nextDate: "Geçersiz tarih", intervalLabel: rule.label };
  const next = new Date(base);
  next.setDate(next.getDate() + rule.days);
  return { nextDate: formatDateForDisplay(next.toISOString().slice(0, 10)), intervalLabel: rule.label };
}

function getOverallNextVaccine(vaccines) {
  const datedVaccines = vaccines.filter((item) => item.nextDate && item.nextDate !== "Elle planlanmalı").map((item) => ({ ...item, ts: Date.parse(item.nextDate) })).filter((item) => !Number.isNaN(item.ts)).sort((a, b) => a.ts - b.ts);
  return datedVaccines[0]?.nextDate || "Henüz eklenmedi";
}

function getVitaminSummary(routines) {
  const found = routines.find((item) => /vitamin|omega|takviye/i.test(item.label));
  return found?.value || "Planlanmadı";
}

function getStatusMeta(status) {
  if (status === "Tamamlandı") return { badge: "✔ Tamamlandı", style: styles.statusDone };
  if (status === "Yaklaşıyor") return { badge: "● Yaklaşıyor", style: styles.statusSoon };
  return { badge: "○ Planlandı", style: styles.statusPlanned };
}

function getBreedSupportGuide(breed) {
  const breedName = breed?.name || "Bu ırk";
  const temperament = translateTemperamentList(breed?.temperament);
  const longHair = /long|semi-long/i.test(breed?.coat || "") || /Persian|Maine|Norwegian|Siberian|Ragdoll|Birman/i.test(breedName);
  const hairless = /Sphynx|Peterbald|Donskoy/i.test(breedName);
  const brachy = /Persian|Exotic|Himalayan/i.test(breedName);
  const large = /Maine|Norwegian|Siberian|Ragdoll|Savannah/i.test(breedName);
  const active = (breed?.energy_level || 3) >= 4 || /Abyssinian|Bengal|Oriental|Savannah|Siamese/i.test(breedName);
  const sensitive = (breed?.adaptability || 3) <= 2 || /Scottish|Fold|Persian|British/i.test(breedName);

  let description = `${breedName} için düzenli veteriner kontrolü, uygun kilo yönetimi, kaliteli ana beslenme ve günlük gözlem çok önemlidir.`;
  const risks = [];
  const vitamins = ["Kaliteli ana mamada yeterli taurin, vitamin ve mineral dengesi temel öncelik olmalı.", "Tüy ve deri kalitesi için Omega-3 ve Omega-6 desteği veteriner onayıyla değerlendirilebilir."];
  const malt = [];
  const lifestyle = [];
  const care = [];

  if (brachy) {
    description = `${breedName} basık yüz yapısı nedeniyle göz, burun ve solunum takibine daha çok ihtiyaç duyabilir.`;
    risks.push("Basık yüz yapısına bağlı solunum zorluğu, göz akıntısı ve göz çevresi tahrişi görülebilir.");
    vitamins.push("Göz ve deri bariyerini destekleyen Omega bazlı destekler yararlı olabilir.");
    care.push("Yüz kıvrımları ve göz çevresi günlük nazik temizlikle takip edilmelidir.");
  }
  if (/Scottish Fold/i.test(breedName)) {
    description = "Scottish Fold ırkında kıkırdak ve eklem yapısı hassas olabileceği için eklem sağlığı öncelikli takip edilmelidir.";
    risks.push("Kıkırdak gelişimi ve eklem yapısına bağlı ağrı, hareket kısıtlılığı veya sertlik görülebilir.");
    risks.push("Uzun dönemde merdiven çıkmada isteksizlik, zıplamada azalma ve kuyruk sertliği yakından izlenmelidir.");
    vitamins.push("Eklem desteği için glukozamin, kondroitin, MSM ve kolajen içeren destekler veteriner önerisiyle düşünülebilir.");
    vitamins.push("Omega-3 (özellikle EPA/DHA) eklem çevresi inflamasyon yükünü azaltmaya yardımcı olabilir.");
    vitamins.push("Kilo kontrolü eklem yükünü azaltacağı için düşük kalorili dengeli beslenme önemlidir.");
    lifestyle.push("Yüksek zıplama gerektiren düzen yerine alçak platformlar ve yumuşak iniş alanları tercih edilmelidir.");
    lifestyle.push("Uzun oyun yerine kısa ama düzenli hareket seansları daha konforlu olabilir.");
    care.push("Topallama, dokununca hassasiyet veya hareket isteğinde azalma fark edilirse erken veteriner değerlendirmesi gerekir.");
  }
  if (/Maine Coon|Ragdoll|British Shorthair/i.test(breedName)) {
    risks.push("Büyük yapılı ırklarda kilo artışı kalp ve eklem yükünü artırabilir; düzenli kontrol gerekir.");
    vitamins.push("Eklem-kıkırdak destekleri ve kilo kontrolü odaklı beslenme planı yararlı olabilir.");
  }
  if (/Sphynx/i.test(breedName)) {
    description = "Sphynx ırkında deri bariyeri, ısı dengesi ve kulak-cilt temizliği ön planda olmalıdır.";
    risks.push("Ciltte yağ birikimi, güneş hassasiyeti ve ısı değişimlerine duyarlılık olabilir.");
    vitamins.push("Deri bariyerini destekleyen yağ asidi destekleri ve yeterli hidrasyon önemlidir.");
    care.push("Düzenli cilt temizliği, kulak bakımı ve ısı kontrolü gerekir.");
  }
  if (/Persian|Exotic|Birman/i.test(breedName)) {
    risks.push("Göz, ağız ve tüy bakımı düzenli yapılmazsa kronik rahatsızlıklar kolayca ilerleyebilir.");
    care.push("Ağız-diş bakımı, göz çevresi bakımı ve günlük tarama öne çıkar.");
  }
  if (large) {
    vitamins.push("Büyük ırklarda eklem sağlığı için glukozamin/kondroitin desteği daha anlamlı olabilir.");
    lifestyle.push("Kilo yönetimi ve düzenli hareket eklem yükünü azaltır.");
  }
  if (active) {
    lifestyle.push("Günlük interaktif oyun, tırmanma alanı ve zihin egzersizi şarttır.");
    vitamins.push("Yoğun aktivite dönemlerinde veteriner onaylı enerji ve kas desteği planlanabilir.");
  } else {
    lifestyle.push("Sakin ama düzenli oyun rutini ve güvenli dinlenme alanları önemlidir.");
  }
  if (sensitive) lifestyle.push("Ani stres değişimlerinden uzak, daha sabit ve sakin bir ev düzeni önerilir.");
  if (longHair) {
    malt.push("Uzun tüylü yapıda haftada 2-3 kez malt desteği hairball riskini azaltmada yardımcı olabilir.");
    malt.push("Yoğun tüy döküm dönemlerinde malt ile birlikte düzenli tarama şarttır.");
    care.push("Günlük ya da sık tarama ile düğüm oluşumu ve deri havasız kalması önlenmelidir.");
  } else {
    malt.push("Hairball eğilimine göre haftada 1-2 kez malt desteği düşünülebilir.");
    malt.push("Malt desteği mutlaka su tüketimi ve tarama rutini ile desteklenmelidir.");
    care.push("Haftalık tarama deri ve tüy sağlığını destekler.");
  }
  if (hairless) lifestyle.push("Sıcaklık kontrolü ve güneşten korunma önemlidir.");
  risks.push("Diş sağlığı, kilo kontrolü ve yıllık check-up tüm ırklar için temel takip alanıdır.");
  care.push("Ağız-diş hijyeni, tırnak kesimi ve kulak kontrolü ihmal edilmemelidir.");
  care.push("Temiz su, düzenli kum kabı bakımı ve yıllık veteriner planı standart olmalıdır.");
  return { title: `${breedName} için önerilen destek planı`, description, temperament, risks, vitamins, malt, lifestyle, care };
}

function ProgressBar({ value }) {
  return <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${value}%` }} /></div>;
}

function StatCard({ stat }) {
  return <div style={styles.statCard}><div style={styles.statIcon}>{stat.icon}</div><div style={styles.statValue}>{stat.value}</div><div style={styles.statLabel}>{stat.label}</div></div>;
}

function CatCard({ cat, isActive, onSelect }) {
  return (
    <button type="button" style={{ ...styles.catCard, ...(isActive ? styles.catCardActive : {}) }} onClick={() => onSelect(cat)}>
      <img src={cat.image} alt={cat.name} style={styles.catImage} />
      <div style={styles.catContent}>
        <div style={styles.catHeader}>
          <div><div style={styles.catName}>{cat.name}</div><div style={styles.catMeta}>{cat.breed} • {cat.age}</div></div>
          <div style={styles.statusPill}>{isActive ? "Seçildi" : "Aktif"}</div>
        </div>
        <div style={styles.infoGrid}>
          <div style={styles.infoBox}><div style={styles.infoLabel}>Sonraki Aşı</div><div style={styles.infoValueGreen}>{cat.nextVaccine}</div></div>
          <div style={styles.infoBox}><div style={styles.infoLabel}>Vitamin</div><div style={styles.infoValueAmber}>{cat.vitaminStatus}</div></div>
        </div>
        <div style={styles.infoBoxLarge}><div style={styles.rowBetween}><div style={styles.infoLabel}>Mama Stoğu</div><div style={styles.infoValue}>%{cat.foodLevel}</div></div><ProgressBar value={cat.foodLevel} /></div>
        <div style={styles.noteCard}><div style={styles.noteTitle}>Günlük Not</div><div style={styles.noteText}>{cat.healthNote}</div></div>
      </div>
    </button>
  );
}

export default function BenimMiovWebPreview() {
  const [activePage, setActivePage] = useState("home");
  const [cats, setCats] = useState(() => {
    if (typeof window === "undefined") return INITIAL_CATS;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CATS;
    } catch {
      return INITIAL_CATS;
    }
  });
  const [selectedCatId, setSelectedCatId] = useState(INITIAL_CATS[0].id);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const [profileTab, setProfileTab] = useState("overview");
  const [breedOptions, setBreedOptions] = useState([]);
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [supplementBreedId, setSupplementBreedId] = useState("");
  const [supportBreedImage, setSupportBreedImage] = useState("https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg");
  const [vetCity, setVetCity] = useState("İstanbul");
  const [adoptions, setAdoptions] = useState(() => {
    if (typeof window === "undefined") return INITIAL_ADOPTIONS;
    try {
      const saved = window.localStorage.getItem(`${STORAGE_KEY}-adoptions`);
      return saved ? JSON.parse(saved) : INITIAL_ADOPTIONS.map((item) => ({ ...item, city: normalizeCity(item.city) }));
    } catch {
      return INITIAL_ADOPTIONS;
    }
  });

  const [newCatForm, setNewCatForm] = useState({ name: "", breed: "", breedId: "", age: AGE_OPTIONS[4], gender: "Dişi", weight: "", image: "" });
  const [vaccineForm, setVaccineForm] = useState({ name: "İç Parazit", date: "", status: "Planlandı" });
  const [routineForm, setRoutineForm] = useState({ label: "", value: "" });
  const [vetVisitDate, setVetVisitDate] = useState("");
  const [dailyNote, setDailyNote] = useState("");
  const [adoptionForm, setAdoptionForm] = useState({ name: "", breedId: "", breed: "", age: AGE_OPTIONS[3], city: "İstanbul", note: "", image: "", owner: "" });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cats)); } catch {}
  }, [cats]);

  useEffect(() => {
    try { window.localStorage.setItem(`${STORAGE_KEY}-adoptions`, JSON.stringify(adoptions)); } catch {}
  }, [adoptions]);

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const res = await fetch("https://api.thecatapi.com/v1/breeds");
        const data = await res.json();
        setBreedOptions(data);
        if (data.length > 0) {
          const first = data[0];
          setSupplementBreedId(first.id);
          setSupportBreedImage(getBreedImage(first));
          setNewCatForm((prev) => ({ ...prev, breed: first.name, breedId: first.id, image: getBreedImage(first) }));
          setAdoptionForm((prev) => ({ ...prev, breed: first.name, breedId: first.id, image: getBreedImage(first), city: "İstanbul" }));
        }
      } catch {
        setBreedOptions([]);
      } finally {
        setBreedsLoading(false);
      }
    };
    loadBreeds();
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchBreedImageFromApi(supplementBreedId).then((url) => {
      if (mounted) setSupportBreedImage(url);
    });
    return () => {
      mounted = false;
    };
  }, [supplementBreedId]);

  useEffect(() => {
    if (!cats.find((cat) => cat.id === selectedCatId) && cats.length > 0) setSelectedCatId(cats[0].id);
  }, [cats, selectedCatId]);

  const selectedCat = useMemo(() => cats.find((cat) => cat.id === selectedCatId) || cats[0], [cats, selectedCatId]);
  const selectedGps = GPS_DATA[selectedCat?.id] || { status: "Takip Pasif", battery: 0, accuracy: "--", location: "Konum bekleniyor", lastSeen: "Veri yok", safeZone: "Tanımsız", activity: "Bilinmiyor" };
  const selectedSupplementBreed = useMemo(() => breedOptions.find((breed) => breed.id === supplementBreedId) || breedOptions[0], [breedOptions, supplementBreedId]);
  const supplementGuide = useMemo(() => getBreedSupportGuide(selectedSupplementBreed), [selectedSupplementBreed]);
  const vaccinePreview = useMemo(() => calculateNextVaccineDate(vaccineForm.name, vaccineForm.date), [vaccineForm.name, vaccineForm.date]);
  const vetResults = FEATURED_CITY_VETS[vetCity] || [];
  const googleVetSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(vetCity + " veteriner kliniği")}`;
  const yandexVetSearchUrl = `https://yandex.com.tr/harita/?text=${encodeURIComponent(vetCity + " veteriner kliniği")}`;

  const stats = useMemo(() => [
    { label: "Toplam Dost", value: String(cats.length), icon: "🐱" },
    { label: "Yaklaşan Aşı", value: String(cats.reduce((sum, cat) => sum + cat.vaccines.filter((v) => v.status === "Yaklaşıyor").length, 0)), icon: "💉" },
    { label: "Aktif Hatırlatma", value: String(REMINDERS.length), icon: "🔔" },
  ], [cats]);

  const calendarItems = useMemo(() => {
    const items = cats.flatMap((cat) => cat.vaccines.map((vaccine) => ({ id: `${cat.id}-${vaccine.id}`, catName: cat.name, title: vaccine.name, date: vaccine.nextDate, status: vaccine.status })));
    return items.filter((item) => (calendarFilter === "all" ? true : item.status === calendarFilter));
  }, [cats, calendarFilter]);

  const handleBreedChange = (breedId) => {
    const picked = breedOptions.find((item) => item.id === breedId);
    setNewCatForm((prev) => ({ ...prev, breedId, breed: picked?.name || "", image: getBreedImage(picked) || prev.image }));
  };

  const handleAdoptionBreedChange = (breedId) => {
    const picked = breedOptions.find((item) => item.id === breedId);
    setAdoptionForm((prev) => ({ ...prev, breedId, breed: picked?.name || "", image: getBreedImage(picked) || prev.image }));
  };

  const handleImageUpload = (event, type = "profile") => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      if (type === "profile") setNewCatForm((prev) => ({ ...prev, image: result }));
      if (type === "adoption") setAdoptionForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddCat = () => {
    if (!newCatForm.name.trim() || !newCatForm.breed.trim() || !newCatForm.age.trim()) return;
    const nextId = Date.now();
    const createdCat = { id: nextId, name: newCatForm.name.trim(), age: newCatForm.age.trim(), breed: newCatForm.breed.trim(), breedId: newCatForm.breedId, nextVaccine: "Henüz eklenmedi", foodLevel: 50, vitaminStatus: "Planlanmadı", healthNote: "Henüz not eklenmedi.", image: newCatForm.image.trim() || getBreedImage({ id: newCatForm.breedId }), weight: newCatForm.weight.trim() || "Belirtilmedi", gender: newCatForm.gender.trim() || "Belirtilmedi", lastVetVisit: "Henüz eklenmedi", notes: [], vaccines: [], routines: [] };
    setCats((prev) => [createdCat, ...prev]);
    setSelectedCatId(nextId);
    setShowProfileForm(false);
    setActivePage("home");
    setNewCatForm({ name: "", breed: breedOptions[0]?.name || "", breedId: breedOptions[0]?.id || "", age: AGE_OPTIONS[4], gender: "Dişi", weight: "", image: getBreedImage(breedOptions[0]) || "" });
  };

  const handleAddVaccine = () => {
    if (!selectedCat || !vaccineForm.name.trim() || !vaccineForm.date) return;
    const formattedDate = formatDateForDisplay(vaccineForm.date);
    const preview = calculateNextVaccineDate(vaccineForm.name, vaccineForm.date);
    setCats((prev) => prev.map((cat) => {
      if (cat.id !== selectedCat.id) return cat;
      const updatedVaccines = [{ id: Date.now(), name: vaccineForm.name.trim(), date: formattedDate, status: vaccineForm.status, nextDate: preview.nextDate, intervalLabel: preview.intervalLabel }, ...cat.vaccines];
      return { ...cat, nextVaccine: getOverallNextVaccine(updatedVaccines), vaccines: updatedVaccines };
    }));
    setVaccineForm({ name: "İç Parazit", date: "", status: "Planlandı" });
  };

  const handleAddRoutine = () => {
    if (!selectedCat || !routineForm.label.trim() || !routineForm.value.trim()) return;
    setCats((prev) => prev.map((cat) => {
      if (cat.id !== selectedCat.id) return cat;
      const updatedRoutines = [{ id: Date.now(), label: routineForm.label.trim(), value: routineForm.value.trim() }, ...cat.routines];
      return { ...cat, routines: updatedRoutines, vitaminStatus: getVitaminSummary(updatedRoutines) };
    }));
    setRoutineForm({ label: "", value: "" });
  };

  const handleUpdateVetVisit = () => {
    if (!selectedCat || !vetVisitDate) return;
    const formattedDate = formatDateForDisplay(vetVisitDate);
    setCats((prev) => prev.map((cat) => cat.id === selectedCat.id ? { ...cat, lastVetVisit: formattedDate } : cat));
    setVetVisitDate("");
  };

  const handleAddDailyNote = () => {
    if (!selectedCat || !dailyNote.trim()) return;
    const createdAt = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
    setCats((prev) => prev.map((cat) => cat.id === selectedCat.id ? { ...cat, healthNote: dailyNote.trim(), notes: [{ id: Date.now(), text: dailyNote.trim(), createdAt }, ...cat.notes] } : cat));
    setDailyNote("");
  };

  const openProfilePage = (cat) => {
    setSelectedCatId(cat.id);
    setProfileTab("overview");
    setActivePage("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCat = (catId) => {
    const target = cats.find((cat) => cat.id === catId);
    const ok = window.confirm(`${target?.name || "Bu profil"} silinsin mi?`);
    if (!ok) return;
    const updated = cats.filter((cat) => cat.id !== catId);
    setCats(updated);
    if (updated.length === 0) { setActivePage("home"); return; }
    if (selectedCatId === catId) { setSelectedCatId(updated[0].id); setActivePage("home"); }
  };

  const handleAddAdoption = () => {
    if (!adoptionForm.name.trim() || !adoptionForm.breed.trim() || !adoptionForm.city.trim()) return;
    const newListing = { id: Date.now(), name: adoptionForm.name.trim(), age: adoptionForm.age, breed: adoptionForm.breed, city: adoptionForm.city, note: adoptionForm.note.trim() || "Sahiplendirme için iletişime geçiniz.", image: adoptionForm.image.trim() || getBreedImage({ id: adoptionForm.breedId }), owner: adoptionForm.owner.trim() || "Anonim kullanıcı" };
    setAdoptions((prev) => [newListing, ...prev]);
    setAdoptionForm({ name: "", breedId: breedOptions[0]?.id || "", breed: breedOptions[0]?.name || "", age: AGE_OPTIONS[3], city: "İstanbul", note: "", image: getBreedImage(breedOptions[0]) || "", owner: "" });
  };

  const renderChecklist = (title, items, emoji) => <div style={styles.supportCard}><div style={styles.supportCardTitle}>{emoji} {title}</div><div style={styles.supportList}>{items.map((item, index) => <div key={`${title}-${index}`} style={styles.supportListItem}>• {item}</div>)}</div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div style={styles.logoWrap}><div style={styles.logoIcon}>🐾</div><div><div style={styles.logoText}>Benim Miov</div><div style={styles.headerSubtitle}>Minik dostlarının yaşam asistanı</div></div></div>
          <div style={styles.developerCard}><div style={styles.developerBadge}>Geliştirici</div><div style={styles.developerName}>Çağatay B</div><div style={styles.developerMeta}>Benim Miov • Product Builder</div></div>
        </div>

        <div style={styles.topNav}>
          {[
            { key: "home", label: "Ana Sayfa" },
            { key: "foods", label: "Mama Tavsiyeleri" },
            { key: "calendar", label: "Takvimi Gör" },
            { key: "gps", label: "GPS Takip" },
            { key: "support", label: "Kullanılması Tavsiye Edilen Takviyeler" },
            { key: "vets", label: "En Yakın Veteriner" },
            { key: "adopt", label: "Sahiplendirme" },
          ].map((item) => <button key={item.key} type="button" style={{ ...styles.navButton, ...(activePage === item.key ? styles.navButtonActive : {}) }} onClick={() => setActivePage(item.key)}>{item.label}</button>)}
        </div>

        {activePage === "home" && (
          <>
            <div style={styles.heroCard}>
              <img src="https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg" alt="Benim Miov kapak" style={styles.heroImage} />
              <div style={styles.heroOverlay}>
                <div style={styles.heroBadge}>Premium Kedi Takip Deneyimi</div>
                <h1 style={styles.heroTitle}>Sağlık, beslenme ve günlük rutinler artık tek yerde.</h1>
                <p style={styles.heroText}>Aşı takvimi, mama stoğu, vitamin notları ve günlük sağlık geçmişini şık bir panelde yönet.</p>
                <div style={styles.heroButtonRow}><button type="button" style={styles.primaryButton} onClick={() => setShowProfileForm((p) => !p)}>{showProfileForm ? "Formu Gizle" : "Yeni Profil Ekle"}</button><button type="button" style={styles.glassButton} onClick={() => setActivePage("calendar")}>Takvimi Gör</button></div>
              </div>
            </div>

            {showProfileForm && (
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Yeni kedi profili oluştur</div>
                <input placeholder="Kedi Adı" style={styles.input} value={newCatForm.name} onChange={(e) => setNewCatForm((p) => ({ ...p, name: e.target.value }))} />
                <label style={styles.inputLabel}>Irk Seç</label>
                <select style={styles.select} value={newCatForm.breedId} onChange={(e) => handleBreedChange(e.target.value)}>{breedsLoading ? <option>Irklar yükleniyor...</option> : breedOptions.map((breed) => <option key={breed.id} value={breed.id}>{breed.name}</option>)}</select>
                <label style={styles.inputLabel}>Yaş Seç</label>
                <select style={styles.select} value={newCatForm.age} onChange={(e) => setNewCatForm((p) => ({ ...p, age: e.target.value }))}>{AGE_OPTIONS.map((age) => <option key={age} value={age}>{age}</option>)}</select>
                {newCatForm.image && <img src={newCatForm.image} alt={newCatForm.breed || "Seçili ırk"} style={styles.breedPreviewImage} />}
                <label style={styles.inputLabel}>Cinsiyet</label>
                <select style={styles.select} value={newCatForm.gender} onChange={(e) => setNewCatForm((p) => ({ ...p, gender: e.target.value }))}><option>Dişi</option><option>Erkek</option></select>
                <input placeholder="Kilo" style={styles.input} value={newCatForm.weight} onChange={(e) => setNewCatForm((p) => ({ ...p, weight: e.target.value }))} />
                <label style={styles.inputLabel}>Telefondan / bilgisayardan görsel yükle</label>
                <input type="file" accept="image/*" style={styles.fileInput} onChange={(e) => handleImageUpload(e, "profile")} />
                <label style={styles.inputLabel}>İnternetten görsel URL ekle</label>
                <input placeholder="https://..." style={styles.input} value={newCatForm.image} onChange={(e) => setNewCatForm((p) => ({ ...p, image: e.target.value }))} />
                <button type="button" style={styles.primaryButtonFull} onClick={handleAddCat}>Profili Kaydet</button>
              </div>
            )}

            <div style={styles.statsRow}>{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</div>
            <div style={styles.sectionHeader}><div style={styles.sectionTitle}>Kedi Profilleri</div><div style={styles.sectionSubtle}>Profilde eklediğin aşı ve vitamin bilgileri ana sayfaya da yansır.</div></div>
            <div style={styles.cardsGrid}>{cats.map((cat) => <CatCard key={cat.id} cat={cat} isActive={selectedCat.id === cat.id} onSelect={openProfilePage} />)}</div>
          </>
        )}

        {activePage === "profile" && selectedCat && (
          <div style={styles.profilePageWrap}>
            <div style={styles.profileHero}><img src={selectedCat.image} alt={selectedCat.name} style={styles.profileHeroImage} /><div style={styles.profileHeroOverlay}><div style={styles.profileHeroActions}><button type="button" style={styles.backButton} onClick={() => setActivePage("home")}>← Ana Sayfaya Dön</button><button type="button" style={styles.deleteButton} onClick={() => handleDeleteCat(selectedCat.id)}>Profili Sil</button></div><div style={styles.profileHeroTop}><div><div style={styles.selectedCatMini}>Kedi Profili</div><div style={styles.profileHeroTitle}>{selectedCat.name}</div><div style={styles.selectedCatSub}>{selectedCat.breed} • {selectedCat.gender} • {selectedCat.weight}</div></div><div style={styles.selectedCatDate}>Son veteriner: {selectedCat.lastVetVisit}</div></div></div></div>
            <div style={styles.profileTabs}><button type="button" style={{ ...styles.profileTabButton, ...(profileTab === "overview" ? styles.profileTabButtonActive : {}) }} onClick={() => setProfileTab("overview")}>Genel Bakış</button><button type="button" style={{ ...styles.profileTabButton, ...(profileTab === "records" ? styles.profileTabButtonActive : {}) }} onClick={() => setProfileTab("records")}>Kayıtlar</button><button type="button" style={{ ...styles.profileTabButton, ...(profileTab === "manage" ? styles.profileTabButtonActive : {}) }} onClick={() => setProfileTab("manage")}>Ekle / Yönet</button></div>
            <div style={styles.profileSummaryGrid}><div style={styles.summaryCard}><div style={styles.summaryLabel}>Yaş</div><div style={styles.summaryValue}>{selectedCat.age}</div></div><div style={styles.summaryCard}><div style={styles.summaryLabel}>Sonraki Aşı</div><div style={styles.summaryValue}>{selectedCat.nextVaccine}</div></div><div style={styles.summaryCard}><div style={styles.summaryLabel}>Mama Stoğu</div><div style={styles.summaryValue}>%{selectedCat.foodLevel}</div></div><div style={styles.summaryCard}><div style={styles.summaryLabel}>Vitamin</div><div style={styles.summaryValue}>{selectedCat.vitaminStatus}</div></div></div>

            {profileTab === "overview" && <div style={styles.recordsGrid}><div style={styles.detailCard}><div style={styles.detailTitle}>Aşı Durumu</div><div style={styles.detailList}>{selectedCat.vaccines.map((item) => { const statusMeta = getStatusMeta(item.status); return <div key={item.id} style={styles.detailItem}><div><div style={styles.detailItemTitle}>{item.name}</div><div style={styles.detailItemMeta}>Uygulama: {item.date} • Sonraki: {item.nextDate}</div></div><div style={{ ...styles.detailStatus, ...statusMeta.style }}>{statusMeta.badge}</div></div>; })}</div></div><div style={styles.detailCard}><div style={styles.detailTitle}>Son Not</div><div style={styles.noteHighlight}>{selectedCat.healthNote}</div><div style={styles.detailTitleSmall}>Rutin Özeti</div><div style={styles.detailList}>{selectedCat.routines.map((item) => <div key={item.id} style={styles.detailItem}><div><div style={styles.detailItemTitle}>{item.label}</div><div style={styles.detailItemMeta}>Takip kaydı</div></div><div style={styles.detailValue}>{item.value}</div></div>)}</div></div></div>}

            {profileTab === "records" && <div style={styles.recordsGrid}><div style={styles.detailCard}><div style={styles.detailTitle}>Aşı Geçmişi</div><div style={styles.detailList}>{selectedCat.vaccines.map((item) => { const statusMeta = getStatusMeta(item.status); return <div key={item.id} style={styles.detailItem}><div><div style={styles.detailItemTitle}>{item.name}</div><div style={styles.detailItemMeta}>Uygulama: {item.date} • Sonraki: {item.nextDate}</div></div><div style={styles.detailRightBlock}><div style={{ ...styles.detailStatus, ...statusMeta.style }}>{statusMeta.badge}</div><div style={styles.intervalText}>{item.intervalLabel}</div></div></div>; })}</div></div><div style={styles.detailCard}><div style={styles.detailTitle}>Rutinler</div><div style={styles.detailList}>{selectedCat.routines.map((item) => <div key={item.id} style={styles.detailItem}><div><div style={styles.detailItemTitle}>{item.label}</div><div style={styles.detailItemMeta}>Bugünkü kayıt</div></div><div style={styles.detailValue}>{item.value}</div></div>)}</div></div></div>}

            {profileTab === "manage" && <div style={styles.selectedCatGrid}><div style={styles.detailCard}><div style={styles.detailTitle}>Aşı Ekle</div><div style={styles.formInset}><label style={styles.inputLabel}>Aşı Türü</label><select style={styles.select} value={vaccineForm.name} onChange={(e) => setVaccineForm((prev) => ({ ...prev, name: e.target.value }))}>{Object.keys(VACCINE_SCHEDULE).map((ruleName) => <option key={ruleName} value={ruleName}>{ruleName}</option>)}<option value="Özel Aşı">Özel Aşı</option></select><div style={styles.inlineGrid}><div><label style={styles.inputLabel}>Uygulama Tarihi</label><input type="date" style={styles.input} value={vaccineForm.date} onChange={(e) => setVaccineForm((prev) => ({ ...prev, date: e.target.value }))} /></div><div><label style={styles.inputLabel}>Durum</label><select style={styles.select} value={vaccineForm.status} onChange={(e) => setVaccineForm((prev) => ({ ...prev, status: e.target.value }))}><option>Planlandı</option><option>Yaklaşıyor</option><option>Tamamlandı</option></select></div></div><div style={styles.calculationCard}><div style={styles.calculationLabel}>Tekrar Aralığı</div><div style={styles.calculationValue}>{vaccinePreview.intervalLabel}</div><div style={styles.calculationLabel}>Otomatik Sonraki Tarih</div><div style={styles.calculationValuePrimary}>{vaccinePreview.nextDate}</div></div><button type="button" style={styles.primaryButtonFull} onClick={handleAddVaccine}>Aşı Ekle</button></div></div><div style={styles.detailCard}><div style={styles.detailTitle}>Rutin / Vitamin Ekle</div><div style={styles.formInset}><label style={styles.inputLabel}>Rutin Başlığı</label><input style={styles.input} placeholder="Örn: Omega Desteği" value={routineForm.label} onChange={(e) => setRoutineForm((prev) => ({ ...prev, label: e.target.value }))} /><label style={styles.inputLabel}>Durum / Not</label><input style={styles.input} placeholder="Örn: Bugün verildi" value={routineForm.value} onChange={(e) => setRoutineForm((prev) => ({ ...prev, value: e.target.value }))} /><button type="button" style={styles.primaryButtonFull} onClick={handleAddRoutine}>Kaydı Ekle</button></div></div><div style={styles.detailCard}><div style={styles.detailTitle}>Veteriner Ziyareti Güncelle</div><div style={styles.formInset}><label style={styles.inputLabel}>Son veteriner gidiş tarihi</label><input type="date" style={styles.input} value={vetVisitDate} onChange={(e) => setVetVisitDate(e.target.value)} /><button type="button" style={styles.primaryButtonFull} onClick={handleUpdateVetVisit}>Tarihi Kaydet</button></div></div></div>}

            <div style={styles.twoColumnLayout}><div style={styles.card}><div style={styles.sectionTitle}>Günlük Not Ekle</div><textarea style={styles.textArea} placeholder="Bugün gözlemlediğin notu yaz..." value={dailyNote} onChange={(e) => setDailyNote(e.target.value)} /><button type="button" style={styles.primaryButtonFull} onClick={handleAddDailyNote}>Notu Kaydet</button></div><div style={styles.detailCard}><div style={styles.detailTitle}>Not Geçmişi</div><div style={styles.detailList}>{selectedCat.notes.map((note) => <div key={note.id} style={styles.noteHistoryItem}><div style={styles.noteHistoryDate}>{note.createdAt}</div><div style={styles.noteHistoryText}>{note.text}</div></div>)}</div></div></div>
          </div>
        )}

        {activePage === "foods" && <div style={styles.card}><div style={styles.sectionTitle}>Mama Tavsiyeleri</div><div style={styles.foodGridLarge}>{FOOD_RECOMMENDATIONS.map((food) => <div key={food.id} style={styles.foodCardLarge}><div style={styles.foodTopRow}><img src={food.logo} alt={food.brand} style={styles.foodBrandImage} onError={(e) => { e.currentTarget.style.display = "none"; }} /><a href={food.site} target="_blank" rel="noreferrer" style={styles.foodSiteLink}>Resmi Site</a></div><div style={styles.foodBrand}>{food.brand}</div><div style={styles.foodProduct}>{food.product}</div><div style={styles.foodMeta}>{food.category}</div><div style={styles.foodBlockTitle}>Ne zaman?</div><div style={styles.foodText}>{food.when}</div><div style={styles.foodBlockTitle}>Kullanım şekli</div><div style={styles.foodText}>{food.usage}</div><div style={styles.foodBlockTitle}>Not</div><div style={styles.foodText}>{food.notes}</div></div>)}</div></div>}

        {activePage === "calendar" && <div style={styles.card}><div style={styles.sectionTitle}>Takvim Görünümü</div><div style={styles.calendarToolbar}>{[{ key: "all", label: "Tümü" }, { key: "Yaklaşıyor", label: "Yaklaşıyor" }, { key: "Planlandı", label: "Planlandı" }, { key: "Tamamlandı", label: "Tamamlandı" }].map((item) => <button key={item.key} type="button" style={{ ...styles.filterChip, ...(calendarFilter === item.key ? styles.filterChipActive : {}) }} onClick={() => setCalendarFilter(item.key)}>{item.label}</button>)}</div><div style={styles.calendarList}>{calendarItems.length === 0 ? <div style={styles.emptyState}>Bu filtre için kayıt bulunamadı.</div> : calendarItems.map((item) => { const statusMeta = getStatusMeta(item.status); return <div key={item.id} style={styles.calendarItem}><div><div style={styles.calendarDate}>{item.date}</div><div style={styles.calendarTitle}>{item.catName} • {item.title}</div></div><div style={{ ...styles.detailStatus, ...statusMeta.style }}>{statusMeta.badge}</div></div>; })}</div></div>}

        {activePage === "gps" && <div style={styles.gpsSection}><div style={styles.sectionHeader}><div style={styles.sectionTitle}>GPS Takip Merkezi</div><div style={styles.sectionSubtle}>Her kedi için ayrı canlı takip ekranı</div></div><div style={styles.gpsHeroCard}><div style={styles.gpsMapVisual}><div style={styles.gpsMapGrid} /><div style={styles.gpsPulse} /><div style={styles.gpsPin}>📍</div><div style={styles.gpsSafeZone}>Güvenli Alan</div></div><div style={styles.gpsHeroContent}><div style={styles.gpsLiveBadge}>{selectedGps.status}</div><div style={styles.gpsHeroTitle}>{selectedCat.name} için canlı takip</div><div style={styles.gpsHeroMeta}>{selectedGps.location}</div><div style={styles.gpsMiniGrid}><div style={styles.gpsMiniCard}><div style={styles.gpsMiniLabel}>Pil</div><div style={styles.gpsMiniValue}>%{selectedGps.battery}</div></div><div style={styles.gpsMiniCard}><div style={styles.gpsMiniLabel}>Hassasiyet</div><div style={styles.gpsMiniValue}>{selectedGps.accuracy}</div></div><div style={styles.gpsMiniCard}><div style={styles.gpsMiniLabel}>Son Görülme</div><div style={styles.gpsMiniValue}>{selectedGps.lastSeen}</div></div><div style={styles.gpsMiniCard}><div style={styles.gpsMiniLabel}>Aktivite</div><div style={styles.gpsMiniValue}>{selectedGps.activity}</div></div></div></div></div><div style={styles.gpsGrid}>{cats.map((cat) => { const gps = GPS_DATA[cat.id] || selectedGps; return <button key={cat.id} type="button" style={{ ...styles.gpsTrackerCard, ...(selectedCat.id === cat.id ? styles.gpsTrackerCardActive : {}) }} onClick={() => setSelectedCatId(cat.id)}><div style={styles.gpsTrackerHeader}><div><div style={styles.gpsTrackerName}>{cat.name}</div><div style={styles.gpsTrackerSub}>{cat.breed}</div></div><div style={styles.gpsTrackerDot} /></div><div style={styles.gpsTrackerLocation}>{gps.location}</div><div style={styles.gpsTrackerMetaRow}><span>Pil %{gps.battery}</span><span>{gps.lastSeen}</span></div><div style={styles.gpsTrackerSafeZone}>{gps.safeZone}</div></button>; })}</div></div>}

        {activePage === "support" && <div style={styles.supportPageWrap}><div style={styles.sectionHeader}><div style={styles.sectionTitle}>Kullanılması Tavsiye Edilen Takviyeler</div><div style={styles.sectionSubtle}>Irka göre genetik eğilimler, destek ürünleri, yaşam ve bakım önerileri</div></div><div style={styles.supportHero}><div style={styles.supportHeroText}><div style={styles.heroBadge}>Irk Bazlı Rehber</div><div style={styles.supportHeroTitle}>{selectedSupplementBreed?.name || "Irk seç"}</div><div style={styles.supportHeroDescription}>{supplementGuide.description}</div><label style={styles.inputLabel}>Kedi ırkı seç</label><select style={styles.select} value={supplementBreedId} onChange={(e) => setSupplementBreedId(e.target.value)}>{breedsLoading ? <option>Irklar yükleniyor...</option> : breedOptions.map((breed) => <option key={breed.id} value={breed.id}>{breed.name}</option>)}</select><div style={styles.supportTagRow}>{(supplementGuide.temperament || []).map((item) => <span key={item} style={styles.supportTag}>{item}</span>)}</div></div><div style={styles.supportHeroImageWrap}><img src={supportBreedImage} alt={selectedSupplementBreed?.name || "Irk"} style={styles.supportHeroImage} /></div></div><div style={styles.supportGrid}>{renderChecklist("Genetik / yapısal dikkat edilmesi gerekenler", supplementGuide.risks, "🧬")}{renderChecklist("Kullanılması düşünülebilecek vitamin destekleri", supplementGuide.vitamins, "💊")}{renderChecklist("Malt ve hairball yönetimi", supplementGuide.malt, "🧴")}{renderChecklist("Nasıl bir yaşam sürmeli", supplementGuide.lifestyle, "🏡")}{renderChecklist("Bakım önerileri", supplementGuide.care, "🪮")}</div></div>}

        {activePage === "vets" && <div style={styles.card}><div style={styles.sectionHeader}><div style={styles.sectionTitle}>Konuma Göre En Yakın Veterinerler</div><div style={styles.sectionSubtle}>81 il seçimi, öne çıkan klinikler ve canlı harita araması</div></div><div style={styles.vetToolbar}><div style={styles.vetSelectorWrap}><label style={styles.inputLabel}>Şehir seç</label><select style={styles.select} value={vetCity} onChange={(e) => setVetCity(e.target.value)}>{TURKEY_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}</select></div><div style={styles.routeHint}>Seçilen şehir için öne çıkan klinikler aşağıda listelenir. Tüm güncel veterinerleri görmek için harita arama bağlantılarını kullan.<div style={styles.vetLinkRow}><a href={googleVetSearchUrl} target="_blank" rel="noreferrer" style={styles.vetLinkButton}>Google Maps'te Ara</a><a href={yandexVetSearchUrl} target="_blank" rel="noreferrer" style={styles.vetLinkButton}>Yandex'te Ara</a></div></div></div><div style={styles.vetGrid}>{vetResults.length > 0 ? vetResults.map((vet) => <div key={`${vetCity}-${vet.id}`} style={styles.vetCard}><div style={styles.vetTop}><div><div style={styles.vetName}>{vet.name}</div><div style={styles.vetDistrict}>{vet.district}</div></div><div style={styles.vetDistance}>{vet.distance}</div></div><div style={styles.vetAddress}>{vet.address}</div><div style={styles.vetMetaRow}><span>🚗 {vet.eta}</span><span>📞 {vet.phone}</span></div><a href={`https://www.google.com/maps/search/${encodeURIComponent(vet.name + ' ' + vet.address)}`} target="_blank" rel="noreferrer" style={styles.vetRouteButton}>Yol Tarifini Aç</a></div>) : <div style={styles.emptyState}>Bu şehir için öne çıkan demo klinik eklenmedi. Canlı sonuçlar için üstteki harita aramasını kullan.</div>}</div></div>}

        {activePage === "adopt" && <div style={styles.adoptWrap}><div style={styles.sectionHeader}><div style={styles.sectionTitle}>Evcil Hayvan Sahiplendirme</div><div style={styles.sectionSubtle}>İlan ver, fotoğraf yükle, diğer kullanıcıların ilanlarını modern kartlarla gör.</div></div><div style={styles.adoptLayout}><div style={styles.card}><div style={styles.detailTitle}>Yeni İlan Oluştur</div><input placeholder="Kedi adı" style={styles.input} value={adoptionForm.name} onChange={(e) => setAdoptionForm((prev) => ({ ...prev, name: e.target.value }))} /><label style={styles.inputLabel}>Irk seç</label><select style={styles.select} value={adoptionForm.breedId} onChange={(e) => handleAdoptionBreedChange(e.target.value)}>{breedsLoading ? <option>Irklar yükleniyor...</option> : breedOptions.map((breed) => <option key={breed.id} value={breed.id}>{breed.name}</option>)}</select><label style={styles.inputLabel}>Yaş seç</label><select style={styles.select} value={adoptionForm.age} onChange={(e) => setAdoptionForm((prev) => ({ ...prev, age: e.target.value }))}>{AGE_OPTIONS.map((age) => <option key={age} value={age}>{age}</option>)}</select><label style={styles.inputLabel}>Şehir seç</label><select style={styles.select} value={adoptionForm.city} onChange={(e) => setAdoptionForm((prev) => ({ ...prev, city: e.target.value }))}>{TURKEY_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}</select>{adoptionForm.image && <img src={adoptionForm.image} alt={adoptionForm.breed || "İlan görseli"} style={styles.adoptPreviewImage} />}<label style={styles.inputLabel}>Görsel yükle</label><input type="file" accept="image/*" style={styles.fileInput} onChange={(e) => handleImageUpload(e, "adoption")} /><label style={styles.inputLabel}>İlan notu</label><textarea style={styles.textArea} placeholder="Karakteri, sağlık durumu, kısırlaştırma bilgisi..." value={adoptionForm.note} onChange={(e) => setAdoptionForm((prev) => ({ ...prev, note: e.target.value }))} /><input placeholder="İlan sahibi adı" style={styles.input} value={adoptionForm.owner} onChange={(e) => setAdoptionForm((prev) => ({ ...prev, owner: e.target.value }))} /><button type="button" style={styles.primaryButtonFull} onClick={handleAddAdoption}>İlanı Yayınla</button></div><div style={styles.adoptListWrap}>{adoptions.map((item) => <div key={item.id} style={styles.adoptCard}><img src={item.image} alt={item.name} style={styles.adoptImage} /><div style={styles.adoptContent}><div style={styles.adoptTop}><div><div style={styles.adoptName}>{item.name}</div><div style={styles.adoptMeta}>{item.breed} • {item.age}</div></div><div style={styles.adoptCity}>{item.city}</div></div><div style={styles.adoptNote}>{item.note}</div><div style={styles.adoptOwner}>İlan sahibi: {item.owner}</div><button type="button" style={styles.glassButton}>İlanla İlgileniyorum</button></div></div>)}</div></div></div>}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", height: "100vh", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", background: "radial-gradient(circle at top, #172554 0%, #0b1120 45%, #050816 100%)", color: "#fff", fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  container: { maxWidth: 1280, margin: "0 auto", padding: 24, paddingBottom: 80 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  logoWrap: { display: "flex", alignItems: "center", gap: 14 },
  logoIcon: { width: 58, height: 58, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8b5cf6 0%, #22c55e 100%)", boxShadow: "0 16px 40px rgba(124,58,237,0.35)", fontSize: 26 },
  logoText: { fontSize: 32, fontWeight: 800, letterSpacing: -0.8 },
  headerSubtitle: { marginTop: 6, color: "#94a3b8", fontSize: 14 },
  developerCard: { padding: "14px 16px", borderRadius: 20, background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.08)", minWidth: 240, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" },
  developerBadge: { color: "#a78bfa", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 },
  developerName: { fontSize: 20, fontWeight: 800, marginBottom: 4 },
  developerMeta: { color: "#94a3b8", fontSize: 13 },
  topNav: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 },
  navButton: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(17, 28, 45, 0.72)", color: "#e2e8f0", padding: "12px 16px", borderRadius: 14, cursor: "pointer", fontWeight: 700 },
  navButtonActive: { background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "#fff", boxShadow: "0 10px 30px rgba(124,58,237,0.25)" },
  heroCard: { position: "relative", overflow: "hidden", borderRadius: 32, border: "1px solid rgba(255,255,255,0.08)", background: "#0f172a", minHeight: 380, marginBottom: 24, boxShadow: "0 20px 80px rgba(0,0,0,0.35)" },
  heroImage: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: { position: "relative", zIndex: 1, minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, background: "linear-gradient(180deg, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.88) 80%, rgba(2,6,23,0.96) 100%)" },
  heroBadge: { alignSelf: "flex-start", padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12, fontWeight: 700, marginBottom: 14, backdropFilter: "blur(10px)" },
  heroTitle: { fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, margin: 0, marginBottom: 12, fontWeight: 800, maxWidth: 820, letterSpacing: -1.4 },
  heroText: { margin: 0, color: "#dbe4f0", fontSize: 16, lineHeight: 1.6, marginBottom: 20, maxWidth: 760 },
  heroButtonRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  primaryButton: { border: "none", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "#fff", padding: "14px 18px", borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px rgba(124,58,237,0.35)" },
  primaryButtonFull: { width: "100%", border: "none", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "#fff", padding: "14px 18px", borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: "pointer", textDecoration: "none", display: "inline-block", boxSizing: "border-box", textAlign: "center" },
  glassButton: { border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.12)", color: "#fff", padding: "14px 18px", borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: "pointer", backdropFilter: "blur(10px)" },
  card: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 18, marginBottom: 24 },
  fileInput: { width: "100%", marginBottom: 14, color: "#e2e8f0" },
  breedPreviewImage: { width: "100%", height: 220, objectFit: "cover", borderRadius: 20, marginBottom: 14, display: "block" },
  profilePageWrap: { display: "flex", flexDirection: "column", gap: 20 },
  profileHero: { position: "relative", borderRadius: 30, overflow: "hidden", minHeight: 340, border: "1px solid rgba(255,255,255,0.08)", background: "#0f172a" },
  profileHeroImage: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  profileHeroOverlay: { position: "relative", zIndex: 1, minHeight: 340, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0.85) 80%, rgba(2,6,23,0.96) 100%)" },
  profileHeroActions: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 },
  backButton: { alignSelf: "flex-start", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.12)", color: "#fff", padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 700 },
  deleteButton: { alignSelf: "flex-start", border: "1px solid rgba(248,113,113,0.28)", background: "rgba(127,29,29,0.42)", color: "#fecaca", padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 700 },
  profileHeroTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" },
  profileHeroTitle: { fontSize: 40, fontWeight: 900, letterSpacing: -1.4 },
  profileTabs: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 },
  profileTabButton: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(17, 28, 45, 0.72)", color: "#e2e8f0", padding: "10px 14px", borderRadius: 999, cursor: "pointer", fontWeight: 700 },
  profileTabButtonActive: { background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "#fff", border: "1px solid rgba(139,92,246,0.4)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, marginTop: 4, flexWrap: "wrap" },
  sectionTitle: { fontSize: 24, fontWeight: 800, letterSpacing: -0.6, marginBottom: 8 },
  sectionSubtle: { color: "#94a3b8", fontSize: 14, marginBottom: 12 },
  inputLabel: { display: "block", color: "#e2e8f0", fontSize: 14, marginBottom: 8, fontWeight: 700 },
  input: { width: "100%", boxSizing: "border-box", background: "#121d31", color: "#fff", border: "1px solid #24344b", borderRadius: 16, padding: "12px 14px", marginBottom: 14, fontSize: 14, outline: "none" },
  select: { width: "100%", boxSizing: "border-box", background: "#121d31", color: "#fff", border: "1px solid #24344b", borderRadius: 16, padding: "12px 14px", marginBottom: 14, fontSize: 14, outline: "none" },
  textArea: { width: "100%", minHeight: 120, boxSizing: "border-box", background: "#121d31", color: "#fff", border: "1px solid #24344b", borderRadius: 16, padding: "12px 14px", marginBottom: 14, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 },
  statCard: { background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 18, textAlign: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.18)" },
  statIcon: { fontSize: 22, marginBottom: 10 },
  statValue: { fontSize: 28, fontWeight: 800 },
  statLabel: { marginTop: 6, color: "#94a3b8", fontSize: 13 },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 24 },
  catCard: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 28, overflow: "hidden", boxShadow: "0 18px 48px rgba(0,0,0,0.18)", padding: 0, textAlign: "left", color: "inherit", cursor: "pointer" },
  catCardActive: { outline: "2px solid rgba(139, 92, 246, 0.9)", transform: "translateY(-2px)", boxShadow: "0 20px 52px rgba(124,58,237,0.18)" },
  catImage: { width: "100%", height: 220, objectFit: "cover", display: "block" },
  catContent: { padding: 18 },
  catHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 },
  catName: { fontSize: 26, fontWeight: 800 },
  catMeta: { color: "#94a3b8", fontSize: 13, marginTop: 4 },
  statusPill: { background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "8px 12px", borderRadius: 999, color: "#6ee7b7", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 10 },
  infoBox: { background: "#121d31", borderRadius: 18, padding: 14 },
  infoBoxLarge: { background: "#121d31", borderRadius: 18, padding: 14, marginBottom: 10 },
  infoLabel: { color: "#94a3b8", fontSize: 13, marginBottom: 6 },
  infoValue: { color: "#fff", fontSize: 15, fontWeight: 700 },
  infoValueGreen: { color: "#6ee7b7", fontSize: 15, fontWeight: 700 },
  infoValueAmber: { color: "#fbbf24", fontSize: 15, fontWeight: 700 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 12 },
  progressTrack: { width: "100%", height: 10, background: "#334155", borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #8b5cf6 0%, #c084fc 100%)", borderRadius: 999 },
  noteCard: { background: "#0b1423", borderRadius: 18, padding: 14 },
  noteTitle: { color: "#cbd5e1", fontSize: 13, marginBottom: 6, fontWeight: 700 },
  noteText: { color: "#fff", fontSize: 14, lineHeight: 1.6 },
  selectedCatMini: { color: "#a78bfa", textTransform: "uppercase", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, marginBottom: 8 },
  selectedCatSub: { color: "#94a3b8", fontSize: 14 },
  selectedCatDate: { color: "#cbd5e1", background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "10px 12px", fontSize: 13 },
  profileSummaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 18 },
  summaryCard: { background: "#121d31", borderRadius: 18, padding: 14, border: "1px solid rgba(255,255,255,0.05)" },
  summaryLabel: { color: "#94a3b8", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
  summaryValue: { color: "#fff", fontSize: 15, fontWeight: 700 },
  selectedCatGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 },
  recordsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 },
  detailCard: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22, padding: 16 },
  detailTitle: { fontSize: 18, fontWeight: 800, marginBottom: 12 },
  detailTitleSmall: { fontSize: 15, fontWeight: 800, marginBottom: 12, color: "#cbd5e1" },
  noteHighlight: { background: "#121d31", borderRadius: 18, padding: 16, color: "#fff", lineHeight: 1.7, marginBottom: 14 },
  formInset: { background: "#10192b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 14, marginBottom: 14 },
  calculationCard: { background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 18, padding: 14, marginBottom: 14 },
  calculationLabel: { color: "#c4b5fd", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  calculationValue: { fontSize: 14, color: "#f5f3ff", marginBottom: 10 },
  calculationValuePrimary: { fontSize: 18, color: "#ffffff", fontWeight: 800 },
  inlineGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  detailList: { display: "flex", flexDirection: "column", gap: 10 },
  detailItem: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.06)", background: "#121d31", borderRadius: 18, padding: "12px 14px", color: "inherit", textAlign: "left" },
  detailItemTitle: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  detailItemMeta: { color: "#94a3b8", fontSize: 12 },
  detailRightBlock: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 },
  detailStatus: { borderRadius: 999, padding: "8px 10px", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" },
  statusDone: { background: "rgba(34,197,94,0.16)", color: "#86efac", border: "1px solid rgba(34,197,94,0.28)" },
  statusSoon: { background: "rgba(251,191,36,0.16)", color: "#fcd34d", border: "1px solid rgba(251,191,36,0.28)" },
  statusPlanned: { background: "rgba(96,165,250,0.16)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.28)" },
  intervalText: { fontSize: 11, color: "#cbd5e1" },
  detailValue: { color: "#e9d5ff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" },
  noteHistoryItem: { background: "#121d31", borderRadius: 16, padding: 14 },
  noteHistoryDate: { color: "#a78bfa", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  noteHistoryText: { color: "#fff", lineHeight: 1.5, fontSize: 14 },
  twoColumnLayout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  foodGridLarge: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  foodCardLarge: { background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22, padding: 18 },
  foodTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10 },
  foodBrandImage: { width: 42, height: 42, borderRadius: 10, background: "#fff", padding: 4, objectFit: "contain" },
  foodSiteLink: { color: "#c4b5fd", fontWeight: 700, textDecoration: "none", fontSize: 13 },
  foodBrand: { color: "#a78bfa", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 },
  foodProduct: { fontSize: 20, fontWeight: 800, marginBottom: 6 },
  foodMeta: { color: "#86efac", fontWeight: 700, marginBottom: 10, fontSize: 13 },
  foodBlockTitle: { color: "#cbd5e1", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, marginTop: 8 },
  foodText: { color: "#dbe4f0", lineHeight: 1.6, fontSize: 14 },
  calendarToolbar: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 },
  filterChip: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(17, 28, 45, 0.72)", color: "#e2e8f0", padding: "10px 14px", borderRadius: 999, cursor: "pointer", fontWeight: 700 },
  filterChipActive: { background: "rgba(139,92,246,0.18)", color: "#fff", border: "1px solid rgba(139,92,246,0.45)" },
  calendarList: { display: "flex", flexDirection: "column", gap: 12 },
  calendarItem: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 16 },
  calendarDate: { color: "#a78bfa", fontWeight: 800, marginBottom: 4 },
  calendarTitle: { fontSize: 16, fontWeight: 700 },
  gpsSection: { marginBottom: 28 },
  gpsHeroCard: { display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18, background: "linear-gradient(135deg, rgba(17,28,45,0.98) 0%, rgba(14,20,36,0.98) 100%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 18, marginBottom: 18, overflow: "hidden" },
  gpsMapVisual: { position: "relative", minHeight: 280, borderRadius: 24, background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" },
  gpsMapGrid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "34px 34px" },
  gpsPulse: { position: "absolute", top: "48%", left: "44%", width: 140, height: 140, borderRadius: "50%", background: "rgba(34,197,94,0.18)", transform: "translate(-50%, -50%)", boxShadow: "0 0 0 22px rgba(34,197,94,0.08), 0 0 0 44px rgba(34,197,94,0.04)" },
  gpsPin: { position: "absolute", top: "46%", left: "44%", transform: "translate(-50%, -50%)", fontSize: 42 },
  gpsSafeZone: { position: "absolute", bottom: 16, left: 16, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 999, padding: "10px 14px", fontWeight: 700 },
  gpsHeroContent: { display: "flex", flexDirection: "column", justifyContent: "center" },
  gpsLiveBadge: { alignSelf: "flex-start", background: "rgba(34,197,94,0.18)", color: "#86efac", border: "1px solid rgba(34,197,94,0.24)", borderRadius: 999, padding: "8px 12px", fontWeight: 800, marginBottom: 12 },
  gpsHeroTitle: { fontSize: 30, fontWeight: 900, marginBottom: 8, letterSpacing: -0.8 },
  gpsHeroMeta: { color: "#cbd5e1", fontSize: 15, marginBottom: 16 },
  gpsMiniGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  gpsMiniCard: { background: "#121d31", borderRadius: 18, padding: 14, border: "1px solid rgba(255,255,255,0.05)" },
  gpsMiniLabel: { color: "#94a3b8", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
  gpsMiniValue: { fontSize: 16, fontWeight: 800 },
  gpsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 },
  gpsTrackerCard: { textAlign: "left", background: "rgba(17,28,45,0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22, padding: 16, cursor: "pointer", color: "#fff" },
  gpsTrackerCardActive: { outline: "2px solid rgba(139,92,246,0.85)", boxShadow: "0 12px 40px rgba(124,58,237,0.18)" },
  gpsTrackerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  gpsTrackerName: { fontSize: 20, fontWeight: 800 },
  gpsTrackerSub: { color: "#94a3b8", fontSize: 13, marginTop: 4 },
  gpsTrackerDot: { width: 12, height: 12, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 18px rgba(34,197,94,0.7)" },
  gpsTrackerLocation: { color: "#e2e8f0", lineHeight: 1.5, marginBottom: 10 },
  gpsTrackerMetaRow: { display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 13, marginBottom: 10 },
  gpsTrackerSafeZone: { color: "#c4b5fd", fontWeight: 700, fontSize: 13 },
  supportPageWrap: { display: "flex", flexDirection: "column", gap: 18 },
  supportHero: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, background: "linear-gradient(135deg, rgba(17,28,45,0.98) 0%, rgba(14,20,36,0.98) 100%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 30, padding: 20, overflow: "hidden" },
  supportHeroText: { display: "flex", flexDirection: "column", justifyContent: "center" },
  supportHeroTitle: { fontSize: 34, fontWeight: 900, letterSpacing: -1, marginBottom: 10 },
  supportHeroDescription: { color: "#dbe4f0", lineHeight: 1.7, marginBottom: 14 },
  supportTagRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 },
  supportTag: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.08)", color: "#f8fafc", padding: "8px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  supportHeroImageWrap: { minHeight: 340, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" },
  supportHeroImage: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  supportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  supportCard: { background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 18 },
  supportCardTitle: { fontSize: 17, fontWeight: 800, marginBottom: 12 },
  supportList: { display: "flex", flexDirection: "column", gap: 10 },
  supportListItem: { color: "#dbe4f0", lineHeight: 1.6, fontSize: 14 },
  vetToolbar: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 18, marginBottom: 18, alignItems: "end" },
  vetSelectorWrap: { background: "#121d31", borderRadius: 22, padding: 16 },
  routeHint: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 18, color: "#dbe4f0", lineHeight: 1.6 },
  vetLinkRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
  vetLinkButton: { display: "inline-block", textDecoration: "none", background: "rgba(139,92,246,0.16)", color: "#e9d5ff", padding: "10px 14px", borderRadius: 14, fontWeight: 700, border: "1px solid rgba(139,92,246,0.28)" },
  vetGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
  vetCard: { background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 18 },
  vetTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 },
  vetName: { fontSize: 20, fontWeight: 800 },
  vetDistrict: { color: "#94a3b8", marginTop: 4 },
  vetDistance: { background: "rgba(34,197,94,0.16)", color: "#86efac", borderRadius: 999, padding: "8px 10px", fontWeight: 800, fontSize: 12 },
  vetAddress: { color: "#dbe4f0", lineHeight: 1.6, marginBottom: 12 },
  vetMetaRow: { display: "flex", justifyContent: "space-between", gap: 12, color: "#cbd5e1", marginBottom: 14 },
  vetRouteButton: { width: "100%", textDecoration: "none", border: "none", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "#fff", padding: "14px 18px", borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: "pointer", display: "inline-block", boxSizing: "border-box", textAlign: "center" },
  adoptWrap: { display: "flex", flexDirection: "column", gap: 16 },
  adoptLayout: { display: "grid", gridTemplateColumns: "420px 1fr", gap: 18 },
  adoptListWrap: { display: "grid", gridTemplateColumns: "1fr", gap: 16 },
  adoptCard: { display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, background: "rgba(17, 28, 45, 0.92)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, overflow: "hidden" },
  adoptImage: { width: "100%", height: "100%", minHeight: 220, objectFit: "cover", display: "block" },
  adoptContent: { padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  adoptTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10 },
  adoptName: { fontSize: 24, fontWeight: 800 },
  adoptMeta: { color: "#94a3b8", marginTop: 4 },
  adoptCity: { background: "rgba(139,92,246,0.16)", color: "#ddd6fe", borderRadius: 999, padding: "8px 10px", fontWeight: 800, fontSize: 12 },
  adoptNote: { color: "#e2e8f0", lineHeight: 1.7, marginBottom: 12 },
  adoptOwner: { color: "#cbd5e1", fontWeight: 700, marginBottom: 14 },
  adoptPreviewImage: { width: "100%", height: 220, objectFit: "cover", borderRadius: 20, marginBottom: 14, display: "block" },
  emptyState: { background: "#121d31", borderRadius: 16, padding: 14, color: "#94a3b8", fontSize: 14 },
};
