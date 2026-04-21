import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { viloyatlar, tumanlar, stats, faqs, admins } from '../lib/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  });
  const db = drizzle(pool);

  console.log('🌱 Seeding viloyatlar...');
  const viloyatData = [
    { name: 'Andijon viloyati', slug: 'andijon' },
    { name: 'Buxoro viloyati', slug: 'buxoro' },
    { name: "Farg'ona viloyati", slug: 'fargona' },
    { name: 'Jizzax viloyati', slug: 'jizzax' },
    { name: 'Xorazm viloyati', slug: 'xorazm' },
    { name: 'Namangan viloyati', slug: 'namangan' },
    { name: 'Navoiy viloyati', slug: 'navoiy' },
    { name: 'Qashqadaryo viloyati', slug: 'qashqadaryo' },
    { name: "Qoraqalpog'iston Respublikasi", slug: 'qoraqalpogiston' },
    { name: 'Samarqand viloyati', slug: 'samarqand' },
    { name: 'Sirdaryo viloyati', slug: 'sirdaryo' },
    { name: 'Surxondaryo viloyati', slug: 'surxondaryo' },
    { name: 'Toshkent viloyati', slug: 'toshkent-viloyat' },
    { name: 'Toshkent shahri', slug: 'toshkent-shahar' },
  ];

  for (const v of viloyatData) {
    await db.insert(viloyatlar).values(v).onDuplicateKeyUpdate({ set: { name: v.name } });
  }

  console.log('🌱 Seeding tumanlar...');
  const tumanMap: Record<string, { name: string; slug: string }[]> = {
    andijon: [
      { name: 'Andijon shahri', slug: 'andijon-shahar' },
      { name: 'Xonobod shahri', slug: 'xonobod' },
      { name: 'Andijon tumani', slug: 'andijon-tuman' },
      { name: 'Asaka tumani', slug: 'asaka' },
      { name: 'Baliqchi tumani', slug: 'baliqchi' },
      { name: "Bo'z tumani", slug: 'boz' },
      { name: 'Buloqboshi tumani', slug: 'buloqboshi' },
      { name: 'Izboskan tumani', slug: 'izboskan' },
      { name: 'Jalaquduq tumani', slug: 'jalaquduq' },
      { name: "Xo'jaobod tumani", slug: 'xojaobod' },
      { name: "Qo'rg'ontepa tumani", slug: 'qorgontepa' },
      { name: 'Marhamat tumani', slug: 'marhamat' },
      { name: 'Mindilvol tumani', slug: 'mindilvol' },
      { name: "Oltinko'l tumani", slug: 'oltinkol' },
      { name: 'Paxtaobod tumani', slug: 'paxtaobod' },
      { name: 'Shahrixon tumani', slug: 'shahrixon' },
      { name: "Ulug'nor tumani", slug: 'ulugnor' },
    ],
    buxoro: [
      { name: 'Buxoro shahri', slug: 'buxoro-shahar' },
      { name: 'Kogon shahri', slug: 'kogon' },
      { name: 'Buxoro tumani', slug: 'buxoro-tuman' },
      { name: "G'ijduvon tumani", slug: 'gijduvon' },
      { name: 'Jondor tumani', slug: 'jondor' },
      { name: 'Kogon tumani', slug: 'kogon-tuman' },
      { name: 'Olot tumani', slug: 'olot' },
      { name: 'Peshku tumani', slug: 'peshku' },
      { name: 'Qorakul tumani', slug: 'qorakul' },
      { name: 'Romitan tumani', slug: 'romitan' },
      { name: 'Shofirkon tumani', slug: 'shofirkon' },
      { name: 'Vobkent tumani', slug: 'vobkent' },
    ],
    fargona: [
      { name: "Farg'ona shahri", slug: 'fargona-shahar' },
      { name: "Marg'ilon shahri", slug: 'margilon' },
      { name: 'Quvasoy shahri', slug: 'quvasoy' },
      { name: "Qo'qon shahri", slug: 'qoqon' },
      { name: 'Beshariq tumani', slug: 'beshariq' },
      { name: "Bog'dod tumani", slug: 'bogdod' },
      { name: 'Buvayda tumani', slug: 'buvayda' },
      { name: "Dang'ara tumani", slug: 'dangara' },
      { name: "Farg'ona tumani", slug: 'fargona-tuman' },
      { name: 'Furqat tumani', slug: 'furqat' },
      { name: 'Kushtepa tumani', slug: 'kushtepa' },
      { name: "O'zbekiston tumani", slug: 'ozbekiston' },
      { name: 'Oltiariq tumani', slug: 'oltiariq' },
      { name: 'Quva tumani', slug: 'quva' },
      { name: 'Rishton tumani', slug: 'rishton' },
      { name: "So'x tumani", slug: 'sox' },
      { name: 'Toshloq tumani', slug: 'toshloq' },
      { name: "Uchko'prik tumani", slug: 'uchkoprik' },
      { name: 'Yozyovon tumani', slug: 'yozyovon' },
    ],
    jizzax: [
      { name: 'Jizzax shahri', slug: 'jizzax-shahar' },
      { name: 'Arnasoy tumani', slug: 'arnasoy' },
      { name: 'Baxmal tumani', slug: 'baxmal' },
      { name: "Do'stlik tumani", slug: 'dostlik' },
      { name: 'Forish tumani', slug: 'forish' },
      { name: "G'allaorol tumani", slug: 'gallaorol' },
      { name: "Mirzacho'l tumani", slug: 'mirzachol' },
      { name: 'Paxtakor tumani', slug: 'paxtakor' },
      { name: 'Yangiobod tumani', slug: 'yangiobod' },
      { name: 'Zafarobod tumani', slug: 'zafarobod' },
      { name: 'Zarband tumani', slug: 'zarband' },
      { name: 'Zomin tumani', slug: 'zomin' },
    ],
    xorazm: [
      { name: 'Urganch shahri', slug: 'urganch-shahar' },
      { name: 'Xiva shahri', slug: 'xiva' },
      { name: "Bog'ot tumani", slug: 'bogot' },
      { name: 'Gurlan tumani', slug: 'gurlan' },
      { name: 'Xonqa tumani', slug: 'xonqa' },
      { name: 'Hazorasp tumani', slug: 'hazorasp' },
      { name: "Qo'shko'pir tumani", slug: 'qoshkopir' },
      { name: 'Shovot tumani', slug: 'shovot' },
      { name: 'Urganch tumani', slug: 'urganch-tuman' },
      { name: 'Yangiariq tumani', slug: 'yangiariq' },
      { name: 'Yangibozor tumani', slug: 'yangibozor' },
    ],
    namangan: [
      { name: 'Namangan shahri', slug: 'namangan-shahar' },
      { name: 'Chortoq tumani', slug: 'chortoq' },
      { name: 'Chust tumani', slug: 'chust' },
      { name: 'Kosonsoy tumani', slug: 'kosonsoy' },
      { name: 'Mingbuloq tumani', slug: 'mingbuloq' },
      { name: 'Namangan tumani', slug: 'namangan-tuman' },
      { name: 'Norin tumani', slug: 'norin' },
      { name: 'Pop tumani', slug: 'pop' },
      { name: "To'raqo'rg'on tumani", slug: 'toraqorgon' },
      { name: "Uchqo'rg'on tumani", slug: 'uchqorgon' },
      { name: 'Uychi tumani', slug: 'uychi' },
      { name: "Yangiqo'rg'on tumani", slug: 'yangiqorgon' },
    ],
    navoiy: [
      { name: 'Navoiy shahri', slug: 'navoiy-shahar' },
      { name: 'Zarafshon shahri', slug: 'zarafshon' },
      { name: 'Karmana tumani', slug: 'karmana' },
      { name: 'Konimex tumani', slug: 'konimex' },
      { name: 'Navbahor tumani', slug: 'navbahor' },
      { name: 'Nurota tumani', slug: 'nurota' },
      { name: 'Tomdi tumani', slug: 'tomdi' },
      { name: 'Uchquduq tumani', slug: 'uchquduq' },
      { name: 'Xatirchi tumani', slug: 'xatirchi' },
    ],
    qashqadaryo: [
      { name: 'Qarshi shahri', slug: 'qarshi' },
      { name: 'Shahrisabz shahri', slug: 'shahrisabz' },
      { name: 'Chiroqchi tumani', slug: 'chiroqchi' },
      { name: 'Dehqonobod tumani', slug: 'dehqonobod' },
      { name: "G'uzor tumani", slug: 'guzor' },
      { name: 'Kasbi tumani', slug: 'kasbi' },
      { name: 'Kitob tumani', slug: 'kitob' },
      { name: 'Koson tumani', slug: 'koson' },
      { name: 'Mirishkor tumani', slug: 'mirishkor' },
      { name: 'Muborak tumani', slug: 'muborak' },
      { name: 'Nishon tumani', slug: 'nishon' },
      { name: 'Qamashi tumani', slug: 'qamashi' },
      { name: "Yakkabog' tumani", slug: 'yakkabog' },
    ],
    qoraqalpogiston: [
      { name: 'Nukus shahri', slug: 'nukus' },
      { name: 'Amudaryo tumani', slug: 'amudaryo' },
      { name: 'Beruniy tumani', slug: 'beruniy' },
      { name: 'Chimboy tumani', slug: 'chimboy' },
      { name: 'Ellikqala tumani', slug: 'ellikqala' },
      { name: 'Kegeyli tumani', slug: 'kegeyli' },
      { name: "Mo'ynoq tumani", slug: 'moynoq' },
      { name: 'Nukus tumani', slug: 'nukus-tuman' },
      { name: "Qanliko'l tumani", slug: 'qanlikol' },
      { name: "Qo'ng'irot tumani", slug: 'qongirot' },
      { name: "Qorao'zak tumani", slug: 'qoraozak' },
      { name: 'Shumanay tumani', slug: 'shumanay' },
      { name: "Taxtako'pir tumani", slug: 'taxtakopir' },
      { name: "To'rtko'l tumani", slug: 'tortkol' },
      { name: "Xo'jayli tumani", slug: 'xojayli' },
    ],
    samarqand: [
      { name: 'Samarqand shahri', slug: 'samarqand-shahar' },
      { name: "Kattaqo'rg'on shahri", slug: 'kattaqorgon' },
      { name: "Bulung'ur tumani", slug: 'bulungur' },
      { name: 'Ishtixon tumani', slug: 'ishtixon' },
      { name: 'Jomboy tumani', slug: 'jomboy' },
      { name: "Kattaqo'rg'on tumani", slug: 'kattaqorgon-tuman' },
      { name: 'Narpay tumani', slug: 'narpay' },
      { name: 'Nurobod tumani', slug: 'nurobod' },
      { name: 'Oqdaryo tumani', slug: 'oqdaryo' },
      { name: "Pastdarg'om tumani", slug: 'pastdargom' },
      { name: 'Payariq tumani', slug: 'payariq' },
      { name: 'Samarqand tumani', slug: 'samarqand-tuman' },
      { name: 'Toyloq tumani', slug: 'toyloq' },
      { name: 'Urgut tumani', slug: 'urgut' },
    ],
    sirdaryo: [
      { name: 'Guliston shahri', slug: 'guliston' },
      { name: 'Yangiyer shahri', slug: 'yangiyer' },
      { name: 'Shirin shahri', slug: 'shirin' },
      { name: 'Boyovut tumani', slug: 'boyovut' },
      { name: 'Guliston tumani', slug: 'guliston-tuman' },
      { name: 'Mirzaobod tumani', slug: 'mirzaobod' },
      { name: 'Oqoltin tumani', slug: 'oqoltin' },
      { name: 'Sardoba tumani', slug: 'sardoba' },
      { name: 'Sayxunobod tumani', slug: 'sayxunobod' },
      { name: 'Xovos tumani', slug: 'xovos' },
    ],
    surxondaryo: [
      { name: 'Termiz shahri', slug: 'termiz' },
      { name: 'Angor tumani', slug: 'angor' },
      { name: 'Boysun tumani', slug: 'boysun' },
      { name: 'Denov tumani', slug: 'denov' },
      { name: "Jarqo'rg'on tumani", slug: 'jarqorgon' },
      { name: 'Kizirik tumani', slug: 'kizirik' },
      { name: 'Muzrabot tumani', slug: 'muzrabot' },
      { name: 'Oltinsoy tumani', slug: 'oltinsoy' },
      { name: "Qumqo'rg'on tumani", slug: 'qumqorgon' },
      { name: 'Sariosiyo tumani', slug: 'sariosiyo' },
      { name: 'Sherobod tumani', slug: 'sherobod' },
      { name: "Sho'rchi tumani", slug: 'shorchi' },
      { name: 'Termiz tumani', slug: 'termiz-tuman' },
      { name: 'Uzun tumani', slug: 'uzun' },
    ],
    'toshkent-viloyat': [
      { name: 'Angren shahri', slug: 'angren' },
      { name: 'Olmaliq shahri', slug: 'olmaliq' },
      { name: 'Chirchiq shahri', slug: 'chirchiq' },
      { name: 'Bekobod shahri', slug: 'bekobod' },
      { name: 'Nurafshon shahri', slug: 'nurafshon' },
      { name: 'Bekobod tumani', slug: 'bekobod-tuman' },
      { name: "Bo'stonliq tumani", slug: 'bostonliq' },
      { name: 'Chinoz tumani', slug: 'chinoz' },
      { name: 'Ohangaron tumani', slug: 'ohangaron' },
      { name: "Oqqo'rg'on tumani", slug: 'oqqorgon' },
      { name: 'Parkent tumani', slug: 'parkent' },
      { name: 'Piskent tumani', slug: 'piskent' },
      { name: 'Qibray tumani', slug: 'qibray' },
      { name: 'Quyi Chirchiq tumani', slug: 'quyi-chirchiq' },
      { name: "O'rta Chirchiq tumani", slug: 'orta-chirchiq' },
      { name: 'Toshkent tumani', slug: 'toshkent-tuman' },
      { name: "Yangiyo'l tumani", slug: 'yangiyol' },
      { name: 'Yuqori Chirchiq tumani', slug: 'yuqori-chirchiq' },
      { name: 'Zangiota tumani', slug: 'zangiota' },
    ],
    'toshkent-shahar': [
      { name: 'Bektemir tumani', slug: 'bektemir' },
      { name: 'Chilonzor tumani', slug: 'chilonzor' },
      { name: 'Mirobod tumani', slug: 'mirobod' },
      { name: "Mirzo Ulug'bek tumani", slug: 'mirzo-ulugbek' },
      { name: 'Olmazor tumani', slug: 'olmazor' },
      { name: 'Sergeli tumani', slug: 'sergeli' },
      { name: 'Shayxontohur tumani', slug: 'shayxontohur' },
      { name: 'Uchtepa tumani', slug: 'uchtepa' },
      { name: 'Yakkasaroy tumani', slug: 'yakkasaroy' },
      { name: 'Yashnobod tumani', slug: 'yashnobod' },
      { name: 'Yunusobod tumani', slug: 'yunusobod' },
    ],
  };

  for (const [vilSlug, tums] of Object.entries(tumanMap)) {
    const [vil] = await db.select().from(viloyatlar).where(eq(viloyatlar.slug, vilSlug));
    if (!vil) { console.log(`⚠ Viloyat not found: ${vilSlug}`); continue; }
    for (const t of tums) {
      await db.insert(tumanlar).values({ viloyatId: vil.id, name: t.name, slug: t.slug }).onDuplicateKeyUpdate({ set: { name: t.name } });
    }
  }

  console.log('🌱 Seeding stats...');
  const statsData = [
    { key: 'total_funded', value: '47', labelUz: 'Moliyalashtirilgan loyihalar', icon: 'briefcase' },
    { key: 'total_regions', value: '12', labelUz: 'Qamrab olingan viloyatlar', icon: 'map-pin' },
    { key: 'total_students', value: '3200', labelUz: "Foydalanuvchi o'quvchilar", icon: 'users' },
    { key: 'total_loan_uzs', value: '8.4', labelUz: "Ajratilgan ssuda (mlrd so'm)", icon: 'banknote' },
  ];
  for (const s of statsData) {
    await db.insert(stats).values(s).onDuplicateKeyUpdate({ set: { value: s.value, labelUz: s.labelUz } });
  }

  console.log('🌱 Seeding FAQs...');
  const faqData = [
    { question: '"Ko\'mak" loyihasida kimlar ishtirok etishi mumkin?', answer: 'Loyihada chet tilini bilish darajasi kamida C1 (yoki unga tenglashtirilgan xalqaro sertifikat) bo\'lgan, 18 dan 30 yoshgacha bo\'lgan yoshlar ssuda olish uchun ariza topshirishlari mumkin.', sortOrder: 1 },
    { question: 'Ssuda miqdori qancha va u qancha muddatga beriladi?', answer: 'Ssuda miqdori BHMning 320 baravarigacha (130 mln so\'mgacha) etib belgilangan. Mablag\' 3 yil (36 oy) muddatga, foizsiz (0%) taqdim etiladi.', sortOrder: 2 },
    { question: 'Ssuda qanday tartibda qaytariladi?', answer: 'Loyiha doirasida 6 oylik imtiyozli davr beriladi. Qolgan 30 oy davomida asosiy qarz teng qismlarga bo\'lingan holda qaytariladi.', sortOrder: 3 },
    { question: 'O\'quv markazini istalgan hududda ochish mumkinmi?', answer: 'O\'quv markazlari respublikaning shahar va tuman markazlaridan uzoqda joylashgan, ta\'lim xizmatlariga ehtiyoj yuqori bo\'lgan olis hududlarda tashkil etilishi lozim.', sortOrder: 4 },
    { question: 'Ariza topshirish uchun qanday hujjatlar talab etiladi?', answer: 'LIST:Shaxsni tasdiqlovchi hujjat (Pasport/ID karta)|Til bilish darajasini tasdiqlovchi sertifikat (C1)|YaTT yoki MChJ guvohnomasi|KATM kredit tarixi|Kafil yoki sug\'urta shartnomasi', sortOrder: 5 },
    { question: 'Mablag\' ajratilishi necha kun vaqt oladi?', answer: 'Barcha hujjatlar to\'liq taqdim etilib, maxsus kengash tasdig\'idan o\'tgandan so\'ng, mablag\' 3 ish kuni ichida arizachining hisob raqamiga o\'tkazib beriladi.', sortOrder: 6 },
    { question: 'Loyiha qaysi qonuniy asosga ko\'ra amalga oshiriladi?', answer: 'Mazkur loyiha va unga qo\'yilgan talablar O\'zbekiston Respublikasi Vazirlar Mahkamasining 426-sonli qarori bilan tartibga solinadi.', sortOrder: 7 },
    { question: 'Loyiha doirasida ajratilgan mablag\'lardan qanday foydalanish kerak?', answer: 'Mablag\'lar faqat naqd pulsiz shaklda, hisob raqamidan o\'tkazish orqali maqsadli ishlatilishi shart. Naqdlashtirish imkoniyati mavjud emas.', sortOrder: 8 },
    { question: 'Loyiha ishtirokchilariga qanday qo\'shimcha imkoniyatlar bor?', answer: 'Ssuda olgan yoshlar "Ko\'makchilar" hamjamiyatiga va "Ko\'mak+" yopiq guruhiga a\'zo bo\'lishadi. Bu yerda tajriba almashish, har oy o\'tkaziladigan onlayn va oflayn tadbirlarda ishtirok etish imkoniyati yaratiladi.', sortOrder: 9 },
    { question: 'Arizani qayerda va qanday qoldirish mumkin?', answer: 'Hujjatlar va arizalar masofaviy tarzda yoshlarfondi.uz sayti orqali qabul qilinadi.', sortOrder: 10 },
  ];
  for (const f of faqData) {
    await db.insert(faqs).values(f).onDuplicateKeyUpdate({ set: { question: f.question } });
  }

  console.log('🌱 Seeding admin user...');
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (adminEmail && adminHash) {
    await db.insert(admins).values({ email: adminEmail, passwordHash: adminHash }).onDuplicateKeyUpdate({ set: { passwordHash: adminHash } });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log('⚠ ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set — skipping admin user');
  }

  console.log('✅ Seeding complete!');
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
