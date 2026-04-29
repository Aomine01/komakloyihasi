import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'komakchilar-data.json');

const formattedDescriptions: Record<string, string> = {
  'akromov-izzatillo-murodjon-ogli': `ISM_FAMILIYA: Akramov Izzatillo Murodjon o'g'li
LAVOZIM: "Idrok School LC" o'quv markazi rahbari va ingliz tili o'qituvchisi
TУГИЛГАН_САНА: 2000-yil
ТУҒИЛГАН_ЖОЙ: Andijon viloyati, Marhamat tumani
ЯШАШ_ЖОЙИ: Andijon viloyati, Marhamat tumani

ТАЪЛИМ:
- 2024: Andijon iqtisodiyot va qurilish instituti, Iqtisodiyot yo'nalishi (bakalavr)

ФАОЛИЯТ:
- 2022-2024: "Renessans 2022" o'quv markazi, ingliz tili o'qituvchisi (700+ o'quvchi)
- 2025: C1 sertifikatini 3 marta qo'lga kiritgan
- 2023: "Islom Karimov davlat stipendiyasi" sohibi

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2024-yil dekabr
SSUDA_MAQSADI: O'zining "Idrok School LC" o'quv markaziga asos solish va Robototexnika, kompyuter savodxonligi kurslarini ochish

КЕЛАЖАК_МАҚСАДИ: Yoshlarning iqtidorini yuzaga chiqarish, zamonaviy va an'anaviy kasblarga o'qitadigan inkubatsion markazlar tashkil etish va jahon bozoriga yetakchi mutaxassislarni yetishtirish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm
- 2.jpg: Markazning oldingi holati
- 3.jpg: O'quv xonasining hozirgi holati`,
  'ashirbekov-otkirbek-umarbek-ogli': `ISM_FAMILIYA: Ashirbekov O'tkirbek Umarbek o'g'li
LAVOZIM: "Ai Hikma Academy" o'quv markazi rahbari va ingliz tili o'qituvchisi
TУГИЛГАН_САНА: 2005-yil
ТУҒИЛГАН_ЖОЙ: Andijon viloyati, Shahrixon tumani
ЯШАШ_ЖОЙИ: Andijon viloyati, Bo'ston tumani

ТАЪЛИМ:
- Andijon chet tillari instituti (talaba)

ФАОЛИЯТ:
- Yoshlarga ingliz tilini o'rganish va xalqaro sertifikatlar olishga yordam bermoqda

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil yanvar
SSUDA_MAQSADI: Bo'ston tumani Guzar MFY da "Ai Hikma Academy" o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Yoshlarni zamonaviy va innovatsion kasblarga o'qitadigan va ish bilan ta'minlaydigan inkubatsion markazlar tashkil etish. Kutubxona, shaxmat to'garaklari va IT kurslarini tashkillashtirish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm
- 2.jpg: O'quv xonasining holati`,
  'nodirbek-maxmudov': `ISM_FAMILIYA: Maxmudov Nodirbek Ma'rufjon o'g'li
LAVOZIM: "Arizon" o'quv markazi rahbari
TУГИЛГАН_САНА: 1997-yil 19-fevral
ТУҒИЛГАН_ЖОЙ: Andijon viloyati, Xo'jaobod tumani
ЯШАШ_ЖОЙИ: Andijon viloyati, Xo'jaobod tumani

ТАЪЛИМ:
- 2016: Xo'jaobod tuman qurilish kasb-hunar kolleji

ФАОЛИЯТ:
- 2023-hozirgacha: "Arizon" o'quv markazi rahbari

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2023-yil
SSUDA_MAQSADI: "Arizon" o'quv markazi faoliyatini boshlash

КЕЛАЖАК_МАҚСАДИ: O'quv markazi faoliyatini yanada rivojlantirish va yoshlarga sifatli ta'lim berish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm
- 2.jpg: Markaz faoliyati`,
  'tulanboyev-shoxsuvor-dilmurod-ogli': `ISM_FAMILIYA: Yunusov Ilyos Fayozjon o'g'li
LAVOZIM: Ilm Learning Centre asoschisi va ingliz tili o'qituvchisi
TУГИЛГАН_САНА: 1997-yil 22-avgust
ТУҒИЛГАН_ЖОЙ: Buxoro viloyati, G'ijduvon tumani
ЯШАШ_ЖОЙИ: Navoiy viloyati, Zarafshon shahri

ТАЪЛИМ:
- 2004–2008: Zarafshon 3-umumta'lim maktabi (boshlang'ich sinf)
- 2008–2013: Zarafshon 10-umumta'lim maktabi (yuqori sinf)
- 2013–2016: Zarafshon Akademik litseyi, ijtimoiy fanlar yo'nalishi
- 2017–2021: Navoiy Davlat Pedagogika Instituti, Milliy g'oya yo'nalishi

ФАОЛИЯТ:
- 2021–2024: Zarafshon 3-umumta'lim maktabi, o'qituvchi
- 2021: "Ilm" ingliz tili o'quv markaziga asos solgan
- 1000+ o'quvchi o'qitgan, 100+ sertifikat sohiblari

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil fevral
SSUDA_MAQSADI: O'quv markazining moddiy-texnika bazasini yaxshilash va faoliyatini kengaytirish

КЕЛАЖАК_МАҚСАДИ: Zamonaviy ta'lim tizimini rivojlantirish, yoshlarni xalqaro darajada raqobatbardosh kadrlar sifatida tayyorlash va inkubatsion ta'lim markazlarini tashkil etish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm
- 2.jpg: Markazning oldingi holati
- 3.jpg: O'quv xonasining hozirgi holati`,
  'odilov-dilshodbek-dilmurod-ogli': `ISM_FAMILIYA: Odilov Dilshodbek Dilmurod o'g'li
LAVOZIM: Ingliz tili o'qituvchisi, YaTT
TУГИЛГАН_САНА: 1999-yil 3-fevral
ТУҒИЛГАН_ЖОЙ: Buxoro viloyati, Jondor tumani
ЯШАШ_ЖОЙИ: Buxoro viloyati, Jondor tumani

ТАЪЛИМ:
- Buxoro Neft va Gaz kolleji
- Buxoro muhandislik texnologiya instituti (neft va gaz yo'nalishi)

ФАОЛИЯТ:
- 3 yildan beri ingliz tilidan dars berib keladi
- IELTS: 7.5
- 500 dan ortiq o'quvchilarga IELTS va CEFR sertifikatlariga tayyorlashda yordam bergan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2024-yil dekabr
SSUDA_MAQSADI: O'quv markaziga asos solish va zamonaviy ta'lim sharoitlarini yaratish

КЕЛАЖАК_МАҚСАДИ: Yoshlarni zamonaviy bilimlarga o'qitish orqali xalqaro sertifikatlar olishga ko'maklashish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'abdumuxtorova-masturaxon-mominjon-qizi': `ISM_FAMILIYA: Abdumuxtorova Masturaxon Mo'minjon qizi
LAVOZIM: "Farobiy Borliq ilmi" o'quv markazi asoschisi
TУГИЛГАН_САНА: 2002-yil
ТУҒИЛГАН_ЖОЙ: Farg'ona viloyati, Furqat tumani
ЯШАШ_ЖОЙИ: Farg'ona viloyati, Furqat tumani

ТАЪЛИМ:
- Qo'qon davlat pedagogika instituti (Davlat granti)

ФАОЛИЯТ:
- Mutaxassis darajasidan 1-toifali ustoz darajasiga erishgan
- Yoshlarni xalqaro va milliy sertifikatlar olishga tayyorlamoqda

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil fevral
SSUDA_MAQSADI: Furqat tumani Navbahor shaharchasida "Farobiy Borliq ilmi" o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: O'quv markazlar faoliyatini kengaytirish, chekka hududlarda innovatsion maktabga asos solib, o'quvchilarni kreativ qilib tarbiyalash

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'eminov-jamshid-vositxon': `ISM_FAMILIYA: Eminov Jamshid Vositxon o'g'li
LAVOZIM: Ingliz tili o'qituvchisi va ta'lim menejeri
TУГИЛГАН_САНА: 2004-yil
ТУҒИЛГАН_ЖОЙ: Farg'ona viloyati, Rishton tumani
ЯШАШ_ЖОЙИ: Farg'ona viloyati, Rishton tumani

ТАЪЛИМ:
- Farg'ona viloyati Rishton tumani 27-sonli o'rta maktab
- Westminster International University in Tashkent (Biznes boshqaruvi va Marketing)

ФАОЛИЯТ:
- ANKLAF hududida xususiy o'quv markaziga asos solgan va muvaffaqiyatli boshqarmoqda

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: Xususiy o'quv markazini modernizatsiya qilish

КЕЛАЖАК_МАҚСАДИ: Ta'lim tizimida ajdodlarimiz hayoti va ilmiy merosiga asoslangan alohida fan joriy etish orqali yoshlarning milliy o'zligiga sodiqligini kuchaytirish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'hoshimjonov-xurramshox-yolqinjon-ogli': `ISM_FAMILIYA: Hoshimjonov Xurramshox Yolqinjon o'g'li
LAVOZIM: LingoValley va Smart Edu Cram School asoschisi
TУГИЛГАН_САНА: 1999-yil
ТУҒИЛГАН_ЖОЙ: Farg'ona viloyati
ЯШАШ_ЖОЙИ: Farg'ona viloyati

ТАЪЛИМ:
- 2019-2023: Alisher Navoiy nomidagi Toshkent davlat o'zbek tili va adabiyoti universiteti (Tarjima nazariyasi va amaliyoti)
- 2024: Webster universiteti, TESOL (Magistratura)

ФАОЛИЯТ:
- 2024: LingoValley til markazini tashkil etgan
- 2025: Smart Edu Cram School o'quv markazini tashkil etgan
- 4 nafar yosh o'qituvchini ish bilan ta'minlagan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: O'quv markazi binosini ta'mirlash va zamonaviy jihozlar (televizor, 7 kompyuter) xarid qilish

КЕЛАЖАК_МАҚСАДИ: Yoshlarga zamonaviy texnologiyalar asosida ta'lim olish imkoniyatini kengaytirish va professional o'qituvchilarni qo'llab-quvvatlash

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'umarova-sogdiyona-gofurjon-qizi': `ISM_FAMILIYA: Umarova So'g'diyona G'ofurjon qizi
LAVOZIM: Legacy Education Center asoschisi
TУГИЛГАН_САНА: 2005-yil
ТУҒИЛГАН_ЖОЙ: Farg'ona viloyati, Beshariq tumani
ЯШАШ_ЖОЙИ: Farg'ona viloyati, Beshariq tumani

ТАЪЛИМ:
- Toshkent Xalqaro Westminster Universiteti, Iqtisodiyot va moliya (4-bosqich talabasi)

ФАОЛИЯТ:
- CEFR B2 va IELTS 7 ball olgan o'quvchilarni yetishtirib chiqarmoqda

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil dekabr
SSUDA_MAQSADI: Beshariq tumanida Legacy Education Center o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Moliya va iqtisodiyot sohasida yetuk mutaxassis bo'lish, yoshlarni zamonaviy bilim va xalqaro sertifikatlar orqali kelajakka tayyorlovchi ta'lim ekotizimini kengaytirish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'xudayorov-farmonqul-anarboy': `ISM_FAMILIYA: Xudayorov Farmonqul Anarboy o'g'li
LAVOZIM: "DUOLINGO" o'quv markazi asoschisi
TУГИЛГАН_САНА: 1996-yil
ТУҒИЛГАН_ЖОЙ: Jizzax viloyati, Zarbdor tumani
ЯШАШ_ЖОЙИ: Jizzax viloyati, Zarbdor tumani

ТАЪЛИМ:
- Tibbiyot kolleji
- Jizzax Davlat Universiteti

ФАОЛИЯТ:
- Rus tili o'qituvchisi va tadbirkor
- O'quv markazida 4 nafar milliy sertifikatga ega o'qituvchilar ishlamoqda

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2024-yil dekabr
SSUDA_MAQSADI: Jizzax viloyati Zarbdor tumanida "DUOLINGO" o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Yoshlarni an'anaviy va zamonaviy kasblar (IT muhandisi, 3D modeller, AI mutaxassisi) bo'yicha o'qitish, kutubxona va shaxmat to'garaklari tashkil qilish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'akramjonov-maqsudbek': `ISM_FAMILIYA: Akramjonov Maqsudbek Anvarjon o'g'li
LAVOZIM: "ICEBERG" birlashgan o'quv markazi rahbari, IELTS instructor
TУГИЛГАН_САНА: 2003-yil 6-yanvar
ТУҒИЛГАН_ЖОЙ: Namangan viloyati, Uychi tumani
ЯШАШ_ЖОЙИ: Namangan viloyati, Uychi tumani

ТАЪЛИМ:
- 2009-2020: Uychi tumani 5-maktab
- 2020-2024: Namangan Davlat Universiteti (Tarix, bakalavr)
- 2024-hozir: Namangan Davlat Pedagogika Instituti (Magistratura)

ФАОЛИЯТ:
- 3 yildan buyon IELTS instructor (IELTS 7.5, Multilevel C1)
- 20+ ilmiy maqolalar, 10+ kitoblar muallifi
- "ICEBERG" o'quv markazi rahbari

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: O'quv markaz faoliyatini kengaytirish

КЕЛАЖАК_МАҚСАДИ: Yangi filiallar ochish, ta'lim faoliyatini yanada kengaytirish va ko'proq yoshlarning sifatli ta'lim olishiga imkon yaratish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'ismoilov-doniyorbek-baxodir-ogli': `ISM_FAMILIYA: Ismoilov Doniyorbek Boxodir o'g'li
LAVOZIM: "Discover" o'quv markazi rahbari
TУГИЛГАН_САНА: 1998-yil 22-mart
ТУҒИЛГАН_ЖОЙ: Namangan viloyati, Uychi tumani
ЯШАШ_ЖОЙИ: Namangan viloyati, Uychi tumani

ТАЪЛИМ:
- 2014: Uychi tuman 1-maktab
- 2017: Namangan 2-akademik litsey
- 2021: Andijon Davlat Universiteti

ФАОЛИЯТ:
- 7 yil ta'lim sohasida ish tajribasi (1000+ o'quvchi)
- 2021: Istanbulda 1 oy "Work and Travel" amaliyoti
- Hozirda 3 ta filialga ega

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil mart
SSUDA_MAQSADI: "Discover" o'quv markazi faoliyatini kengaytirish

КЕЛАЖАК_МАҚСАДИ: Innovatsion o'qitish usullarini joriy etish orqali raqobatbardosh, bilimli va zamonaviy fikrlaydigan yoshlarni tarbiyalash

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'nasriddinov-azizbek': `ISM_FAMILIYA: Nasriddinov Azizbek G'anisher o'g'li
LAVOZIM: "ICE BERG" o'quv markazi asoschisi, Yoshlar faoli
TУГИЛГАН_САНА: 2000-yil
ТУҒИЛГАН_ЖОЙ: Namangan viloyati, Uychi tumani
ЯШАШ_ЖОЙИ: Namangan viloyati, Uychi tumani

ТАЪЛИМ:
- 2023-2025: Namangan davlat texnika universiteti (Magistratura)

ФАОЛИЯТ:
- C1 (CEFR) va IELTS 7.5 natijasiga ega
- "ICE BERG" orqali 3000+ yoshlarga ta'lim bergan
- "CLEAN UYCHI" ijtimoiy loyihasini amalga oshirgan va "ICE BERG LIBRARY" tashkil etgan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2024-yil
SSUDA_MAQSADI: O'quv markazni va kutubxonani jihozlash

КЕЛАЖАК_МАҚСАДИ: Yoshlarni kabs-hunar va xorijiy tillarga yo'naltirish, ishsiz yoshlar bandligini ta'minlash

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'rahmatov-solijon-shuhratovich': `ISM_FAMILIYA: Raxmatov Solijon Shuxratovich
LAVOZIM: "Solijon's School" o'quv markazi asoschisi
TУГИЛГАН_САНА: 1999-yil
ТУҒИЛГАН_ЖОЙ: Navoiy viloyati, Konimex tumani
ЯШАШ_ЖОЙИ: Navoiy viloyati, Konimex tumani

ТАЪЛИМ:
- SolBridge International School of Business (Janubiy Koreya)
- MDIS Tashkent (Singapur Menejmentni Rivojlantirish Instituti)

ФАОЛИЯТ:
- 4 yillik pedagogik faoliyat davomida 170+ yoshlarni xalqaro sertifikatlarga tayyorlagan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: Konimex tumanida zamonaviy o'quv markazi tashkil etish

КЕЛАЖАК_МАҚСАДИ: Chekka hududlardagi yoshlarning zamonaviy bilim va ko'nikmalarini shakllantirish, yuqori malakali kadrlar tayyorlash

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'qulmatov-temurbek-yusuf-ogli': `ISM_FAMILIYA: Qulmatov Temurbek Yusuf o'g'li
LAVOZIM: "Cosmos" o'quv markazi rahbari
TУГИЛГАН_САНА: 1999-yil
ТУҒИЛГАН_ЖОЙ: Qashqadaryo viloyati, Koson tumani
ЯШАШ_ЖОЙИ: Qashqadaryo viloyati, Koson tumani

ТАЪЛИМ:
- Toshkent davlat yuridik universiteti

ФАОЛИЯТ:
- Qorabayir qishlog'ida "Cosmos" o'quv markazini tashkil etgan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: "Cosmos" o'quv markazini ochish va jihozlash

КЕЛАЖАК_МАҚСАДИ: Ta'lim tarmog'ini kengaytirib, innovatsion ta'lim ekotizimini shakllantirish, minglab yoshlarning hayotini o'zgartiradigan kuchli ta'lim brendini yaratish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'quchqorova-marjona-akmal-qizi': `ISM_FAMILIYA: Qochqarova Marjona Akmalovna
LAVOZIM: "I-Teach" o'quv markazi rahbari
TУГИЛГАН_САНА: 2002-yil 30-iyul
ТУҒИЛГАН_ЖОЙ: Samarqand viloyati, Kattaqo'rg'on tumani
ЯШАШ_ЖОЙИ: Samarqand viloyati, Kattaqo'rg'on tumani

ТАЪЛИМ:
- 2020: Samarqand davlat chet tillari universiteti (Xorijiy til va adabiyot)

ФАОЛИЯТ:
- 2023-yilda IELTS 8.0 ball olgan
- Dubayda buxgalteriya sohasida tajriba oshirgan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: Kattaqo'rg'on tumanida "I-Teach" o'quv markazini ochish

КЕЛАЖАК_МАҚСАДИ: Chekka hududda o'z o'quv markazi orqali sifatli ta'limni joriy etish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'person': `ISM_FAMILIYA: Cho'liyeva Mufazzalxon Nazirjon qizi
LAVOZIM: Ingliz tili o'qituvchisi
TУГИЛГАН_САНА: 1995-yil 19-dekabr
ТУҒИЛГАН_ЖОЙ: Farg'ona viloyati
ЯШАШ_ЖОЙИ: Sirdaryo viloyati

ТАЪЛИМ:
- Guliston davlat universiteti (Davlat granti)

ФАОЛИЯТ:
- Nordik universitetida asosiy shtatda faoliyat yuritadi
- IELTS 7.5, C1 sertifikatlariga ega
- DTM imtihonida ekspert sifatida ishtirok etgan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: O'quv markaz faoliyatini boshlash

КЕЛАЖАК_МАҚСАДИ: Zamonaviy texnologiya va innovatsiyalarga asoslangan ilm muhitini tashkil etish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'narmatova-bibizebinisso-sharofuddin-qizi': `ISM_FAMILIYA: Narmatova Bibizebiniso Sharofuddin qizi
LAVOZIM: "IELTS ALL" o'quv markazi rahbari
TУГИЛГАН_САНА: 2000-yil
ТУҒИЛГАН_ЖОЙ: Surxondaryo viloyati, Jarqo'rg'on tumani
ЯШАШ_ЖОЙИ: Surxondaryo viloyati, Qumqo'rg'on tumani

ТАЪЛИМ:
- Yuridik kolleji
- Toshkent Milliy universiteti

ФАОЛИЯТ:
- Ingliz tili o'qituvchisi va tadbirkor

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2024-yil dekabr
SSUDA_MAQSADI: Qumqo'rg'on tumanida "IELTS ALL" o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Inkubatsion markazlar, kutubxona va shaxmat to'garaklari tashkillashtirish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'abduxamidov-azimbek-alisher-ogli': `ISM_FAMILIYA: Abduxamidov Azimbek Alisher o'g'li
LAVOZIM: "STEPUP School" o'quv markazi asoschisi
TУГИЛГАН_САНА: 2002-yil
ТУҒИЛГАН_ЖОЙ: Samarqand viloyati, Bulung'ur tumani
ЯШАШ_ЖОЙИ: Toshkent viloyati

ТАЪЛИМ:
- Nizomiy nomidagi Toshkent Davlat Pedagogika Universiteti (Ta'limda boshqaruv)

ФАОЛИЯТ:
- 5 yil davomida ingliz tilidan repetitorlik qilgan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2026-yil boshida
SSUDA_MAQSADI: "STEPUP School" o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Zamonaviy kasblar, IT, AI va Robototexnika yo'nalishlarini keng qamrovda yo'lga qo'yish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'salimov-abrorjon-adxam-ogli': `ISM_FAMILIYA: Salimov Abrorjon Adxam o'g'li
LAVOZIM: "Elevate" ingliz tili markazi rahbari
TУГИЛГАН_САНА: 1995-yil
ТУҒИЛГАН_ЖОЙ: Toshkent shahri, Yunusobod tumani
ЯШАШ_ЖОЙИ: Toshkent shahri

ТАЪЛИМ:
- 2014-2018: Westminster Universiteti (Iqtisod va moliya)

ФАОЛИЯТ:
- 11 yillik o'qitish tajribasi
- 3 yil Amerikadagi logistika kompaniyasida ishlagan

SSUDA_MIQDORI: 130 000 000 so'm
SSUDA_SANASI: 2025-yil
SSUDA_MAQSADI: "Elevate" o'quv markazini kengaytirish

КЕЛАЖАК_МАҚСАДИ: Yoshlarni startap yo'nalishi va ingliz tiliga ixtisoslashgan sohalar (IT, logistika) bo'yicha yo'naltirish

РАСМЛАР:
- 1.jpg: Shaxsiy rasm`,
  'xudaybergenova-leyla-alisherovna': `ISM_FAMILIYA: Xudaybergenova Leyla Alisherovna
LAVOZIM: Tadbirkor va o'qituvchi
TУГИЛГАН_САНА: 1999-yil
ТУҒИЛГАН_ЖОЙ: Qoraqalpogʻiston Respublikasi, Nukus shahri
ЯШАШ_ЖОЙИ: Qoraqalpogʻiston Respublikasi, Nukus shahri

ТАЪЛИМ:
- Pedagogik kollej
- Pedagogika instituti

ФАОЛИЯТ:
- Yoshlarning sifatli ta’lim olishi va xalqaro hamda milliy sertifikatlarni qo‘lga kiritishiga ko'maklashish

КЕЛАЖАК_МАҚСАДИ: Bilimli, mustaqil fikrlaydigan va global maydonda raqobat qila oladigan yangi avlodni tarbiyalash. Innovatsion ta’lim markazlari, rivojlanish platformalari va inkubatsion loyihalar yaratish.`,
  'ibrohimova-rayhonoy-karimboy-qizi': `ISM_FAMILIYA: Ibrohimova Rayhonoy Karimboy qizi
LAVOZIM: "Ibrohimova Rayhonoy Karimboy qizi" YaTT o'quv markazi asoschisi, Ingliz tili o'qituvchisi
TУГИЛГАН_САНА: 2003-yil
ТУҒИЛГАН_ЖОЙ: Qoraqalpog'iston Respublikasi, Amudaryo tumani
ЯШАШ_ЖОЙИ: Qoraqalpog'iston Respublikasi, Amudaryo tumani

ТАЪЛИМ:
- Nukus davlat pedagogika instituti (Ingliz tili va adabiyoti yo‘nalishi)
- Slovakiya Milliy granti asosida Slovakiyada bir semestr almashinuv dasturi

ФАОЛИЯТ:
- Ingliz tili fanidan yoshlarni IELTS va CEFR sertifikatlariga tayyorlash

SSUDA_SANASI: 2024-yil mart
SSUDA_MAQSADI: Amudaryo tumanida o'zining o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Yoshlarni zamonaviy va ilg'or metodikalar yordamida tayyorlab, kasbga to'g'ri yo'naltirish va ishlash imkonini beruvchi markazlar ochish. Xalqaro grantlarni qo'lga kiritishlariga yordam berish.`,
  'jumanazarov-sardorbek-rajabboyevich': `ISM_FAMILIYA: Jumanazarov Sardorbek Rajabboyevich
LAVOZIM: "BRITISH SCHOOL" o'quv markazi asoschisi
TУГИЛГАН_САНА: 1997-yil
ТУҒИЛГАН_ЖОЙ: Xorazm viloyati, Xiva tumani
ЯШАШ_ЖОЙИ: Xorazm viloyati, Xiva shahri

ТАЪЛИМ:
- Xiva iqtisodiyot va servis kolleji
- Urganch Davlat Universiteti

ФАОЛИЯТ:
- Yoshlarga ingliz tilini o'rganish va xalqaro hamda milliy sertifikatlar olishga ko'maklashish

SSUDA_SANASI: 2024-yil mart
SSUDA_MAQSADI: Xiva shahrida "BRITISH SCHOOL" o'quv markaziga asos solish

КЕЛАЖАК_МАҚСАДИ: Yoshlarni zamonaviy va traditsion kasblarga o'qitadigan xalqaro standartlarga javob beradigan xususiy maktab tashkil etish. O'quv markazi binosida kutubxona va IT kurslarini tashkil qilish.`
};

async function updateDescriptions() {
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(content);
  let updatedCount = 0;

  for (const viloyat of data.viloyatlar) {
    for (const person of viloyat.people) {
      if (formattedDescriptions[person.slug]) {
        person.description = formattedDescriptions[person.slug];
        updatedCount++;
      }
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Updated ${updatedCount} descriptions in komakchilar-data.json`);
}

updateDescriptions();
