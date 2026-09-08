/**
 * Каталог с kazachya-kuznya.ru: товары, описания и характеристики.
 * Файл сгенерирован: node scripts/gen-catalog.mjs
 */

export type Product = {
  sku: string
  name: string
  category: string
  price: number
  oldPrice: number
  image: string
  tag?: string
}

export type ProductDetail = {
  /** Короткое описание для шапки карточки. */
  summary: string
  /** Абзацы подробного описания. */
  body: string[]
  /** Характеристики: сталь, размеры, вес, твёрдость. */
  specs: { label: string; value: string }[]
  /** Дополнительные кадры галереи (имена файлов в public/img). */
  gallery: string[]
}

/** Артикулы витрины на главной — в порядке показа. */
export const FEATURED_SKUS: string[] = ["KSKR014","KSK0192M","KSKR0161","KSKR0162","KSKR0122","KSK0191M","KSK019M","KSB003B","KSBR005M","KNJ0021M","KNJ0024M","KNJ0027M","KKNR003M","KKNR001","KPLR001","KPL002","KSPR002","KSPR001","PYP001","KYP002","PSK016","A10","TEMP012","PSK030"]

export const ALL_PRODUCTS: Product[] = [
  {
    "sku": "KSKR014",
    "name": "Реплика шашка «300 лет Дому Романовых»",
    "category": "Шашки",
    "price": 22300,
    "oldPrice": 27000,
    "image": "p-kskr014",
    "tag": "Хит"
  },
  {
    "sku": "KSK0192M",
    "name": "Шашка кавказская погружная «За Кубань и Отечество», мельхиор",
    "category": "Шашки",
    "price": 25000,
    "oldPrice": 33000,
    "image": "p-ksk0192m"
  },
  {
    "sku": "KSKR0161",
    "name": "Реплика шашка обр. 1838 года «Чаю воскресенья мертвых»",
    "category": "Шашки",
    "price": 22900,
    "oldPrice": 29000,
    "image": "p-kskr0161"
  },
  {
    "sku": "KSKR0162",
    "name": "Реплика шашка генерала Бакланова «Честь дороже чем жизнь»",
    "category": "Шашки",
    "price": 22900,
    "oldPrice": 29000,
    "image": "p-kskr0162"
  },
  {
    "sku": "KSKR0122",
    "name": "Реплика шашка «С нами Бог»",
    "category": "Шашки",
    "price": 22300,
    "oldPrice": 27000,
    "image": "p-kskr0122"
  },
  {
    "sku": "KSK0191M",
    "name": "Шашка кавказская ККВ, силовая рубка",
    "category": "Шашки",
    "price": 25000,
    "oldPrice": 33000,
    "image": "p-ksk0191m"
  },
  {
    "sku": "KSK019M",
    "name": "Шашка кавказская, мельхиор",
    "category": "Шашки",
    "price": 24000,
    "oldPrice": 32000,
    "image": "p-ksk019m"
  },
  {
    "sku": "KSB003B",
    "name": "Клыч Николаевский парадный",
    "category": "Сабли",
    "price": 31900,
    "oldPrice": 42000,
    "image": "p-ksb003b",
    "tag": "Парадный"
  },
  {
    "sku": "KSBR005M",
    "name": "Реплика сабля «Боевой талисман», мельхиор",
    "category": "Сабли",
    "price": 27500,
    "oldPrice": 34200,
    "image": "p-ksbr005m"
  },
  {
    "sku": "KNJ0021M",
    "name": "Пластунский нож «Бга бойся, Цря чти»",
    "category": "Ножи",
    "price": 14900,
    "oldPrice": 21990,
    "image": "p-knj0021m"
  },
  {
    "sku": "KNJ0024M",
    "name": "Пластунский нож «Цену жизни спроси у мертвых»",
    "category": "Ножи",
    "price": 14900,
    "oldPrice": 21990,
    "image": "p-knj0024m"
  },
  {
    "sku": "KNJ0027M",
    "name": "Пластунский нож «Отечество или смерть»",
    "category": "Ножи",
    "price": 14900,
    "oldPrice": 21990,
    "image": "p-knj0027m"
  },
  {
    "sku": "KKNR003M",
    "name": "Реплика кинжал ККВ, мельхиор",
    "category": "Кинжалы",
    "price": 17900,
    "oldPrice": 20000,
    "image": "p-kknr003m"
  },
  {
    "sku": "KKNR001",
    "name": "Реплика кинжал бебут обр. 1905 г.",
    "category": "Кинжалы",
    "price": 17300,
    "oldPrice": 22000,
    "image": "p-kknr001"
  },
  {
    "sku": "KPLR001",
    "name": "Палаш морской обр. 1855 г.",
    "category": "Палаши",
    "price": 28700,
    "oldPrice": 33900,
    "image": "p-kplr001"
  },
  {
    "sku": "KPL002",
    "name": "Палаш кавалергарда",
    "category": "Палаши",
    "price": 85000,
    "oldPrice": 105000,
    "image": "p-kpl002",
    "tag": "Коллекция"
  },
  {
    "sku": "KSPR002",
    "name": "Шпага гвардейская елизаветинская обр. 1740 г.",
    "category": "Шпаги",
    "price": 25900,
    "oldPrice": 29000,
    "image": "p-kspr002"
  },
  {
    "sku": "KSPR001",
    "name": "Шпага пехотная офицерская обр. 1798 г.",
    "category": "Шпаги",
    "price": 26900,
    "oldPrice": 32000,
    "image": "p-kspr001"
  },
  {
    "sku": "PYP001",
    "name": "Японский меч катана «Синоби-Кэн»",
    "category": "Япония",
    "price": 26990,
    "oldPrice": 34000,
    "image": "p-pyp001"
  },
  {
    "sku": "KYP002",
    "name": "Японский меч вакидзаси «Золотой дракон»",
    "category": "Япония",
    "price": 28500,
    "oldPrice": 36000,
    "image": "p-kyp002"
  },
  {
    "sku": "PSK016",
    "name": "Нагайка кубанская, красная",
    "category": "Аксессуары",
    "price": 3800,
    "oldPrice": 6900,
    "image": "p-psk016"
  },
  {
    "sku": "A10",
    "name": "Футляр подарочный для шашки / сабли, чёрный бархат",
    "category": "Аксессуары",
    "price": 5000,
    "oldPrice": 7000,
    "image": "p-a10"
  },
  {
    "sku": "TEMP012",
    "name": "Подставка дубовая для шашки / сабли / катаны",
    "category": "Аксессуары",
    "price": 2500,
    "oldPrice": 3000,
    "image": "p-temp012"
  },
  {
    "sku": "PSK030",
    "name": "Футляр подарочный для ножа / кортика",
    "category": "Аксессуары",
    "price": 1800,
    "oldPrice": 5000,
    "image": "p-psk030"
  },
  {
    "sku": "KNJ0026M",
    "name": "Пластунский Нож — Черновцы",
    "category": "Ножи",
    "price": 14900,
    "oldPrice": 21990,
    "image": "p-knj0026m"
  },
  {
    "sku": "PSK031",
    "name": "Нагайка Кубанская, Черная",
    "category": "Аксессуары",
    "price": 2800,
    "oldPrice": 5700,
    "image": "p-psk031"
  },
  {
    "sku": "KSK018",
    "name": "Шашка Казачья Строевая Подзнаменка",
    "category": "Шашки",
    "price": 16000,
    "oldPrice": 25000,
    "image": "p-ksk018"
  },
  {
    "sku": "A21",
    "name": "Темляк Реестровый для Казачей Шашки",
    "category": "Аксессуары",
    "price": 700,
    "oldPrice": 900,
    "image": "p-a21"
  },
  {
    "sku": "A11",
    "name": "Футляр Подарочный для Кинжала",
    "category": "Аксессуары",
    "price": 2800,
    "oldPrice": 3500,
    "image": "p-a11"
  },
  {
    "sku": "A13",
    "name": "Транспортировочный Чехол для Шашки",
    "category": "Аксессуары",
    "price": 1800,
    "oldPrice": 2700,
    "image": "p-a13"
  },
  {
    "sku": "A14",
    "name": "Транспортировочный Чехол для Двух Шашек",
    "category": "Аксессуары",
    "price": 2300,
    "oldPrice": 3400,
    "image": "p-a14"
  },
  {
    "sku": "TEMP005",
    "name": "Темляк Плетённый для Шашки / Сабли",
    "category": "Аксессуары",
    "price": 1800,
    "oldPrice": 2200,
    "image": "p-temp005"
  },
  {
    "sku": "TEMP004",
    "name": "Портупея Уставная обр. 1909г",
    "category": "Аксессуары",
    "price": 2200,
    "oldPrice": 4000,
    "image": "p-temp004"
  },
  {
    "sku": "TEMP003",
    "name": "Подвес для Ножа, Набедренный",
    "category": "Аксессуары",
    "price": 1800,
    "oldPrice": 2500,
    "image": "p-temp003"
  },
  {
    "sku": "A9",
    "name": "Подарочный Футляр для Шашки / Сабли, Красный Бархат",
    "category": "Аксессуары",
    "price": 5000,
    "oldPrice": 7000,
    "image": "p-a9"
  },
  {
    "sku": "KYP003",
    "name": "Японский Меч Вакидзаси Ширасайя / Сирасая",
    "category": "Япония",
    "price": 30000,
    "oldPrice": 36000,
    "image": "p-kyp003"
  },
  {
    "sku": "KNJ001",
    "name": "Нож Самсонова / Медвежий",
    "category": "Ножи",
    "price": 15000,
    "oldPrice": 21000,
    "image": "p-knj001"
  },
  {
    "sku": "KKN003",
    "name": "Кинжал Кубанских Казачьих Войск",
    "category": "Кинжалы",
    "price": 14000,
    "oldPrice": 18000,
    "image": "p-kkn003"
  },
  {
    "sku": "KKNR003",
    "name": "Кинжал Казачий ККВ, обр. 1904г",
    "category": "Кинжалы",
    "price": 16300,
    "oldPrice": 22000,
    "image": "p-kknr003"
  },
  {
    "sku": "KKN002M",
    "name": "Кавказский Кинжал КАМА, Мельхиор",
    "category": "Кинжалы",
    "price": 16900,
    "oldPrice": 20000,
    "image": "p-kkn002m"
  },
  {
    "sku": "KSBR007",
    "name": "Сабля Офицерская Николая Второго",
    "category": "Сабли",
    "price": 21400,
    "oldPrice": 26000,
    "image": "p-ksbr007"
  },
  {
    "sku": "KSBR006",
    "name": "Сабля Офицерская, За Русско-Японскую Войну",
    "category": "Сабли",
    "price": 21400,
    "oldPrice": 26000,
    "image": "p-ksbr006"
  },
  {
    "sku": "KSB005",
    "name": "Сабля Юбилейная Честь, Долг, Отвага 1 Дол",
    "category": "Сабли",
    "price": 20900,
    "oldPrice": 26000,
    "image": "p-ksb005"
  },
  {
    "sku": "KSB004",
    "name": "Сабля Морская, Латунная Рукоять",
    "category": "Сабли",
    "price": 26600,
    "oldPrice": 30000,
    "image": "p-ksb004"
  },
  {
    "sku": "KSBR0032",
    "name": "Реплика Сабля Клыч (Килич) Николая II, образца 1910 года",
    "category": "Сабли",
    "price": 32000,
    "oldPrice": 38000,
    "image": "p-ksbr0032"
  },
  {
    "sku": "KSBR0031",
    "name": "Сабля Клыч Николая II",
    "category": "Сабли",
    "price": 32000,
    "oldPrice": 36000,
    "image": "p-ksbr0031"
  },
  {
    "sku": "KSBR002",
    "name": "Реплика Клыч Шамшир",
    "category": "Сабли",
    "price": 34000,
    "oldPrice": 39000,
    "image": "p-ksbr002"
  },
  {
    "sku": "KSBR001",
    "name": "Сабля Клыч (Килич) Искуственно Состаренный",
    "category": "Сабли",
    "price": 34000,
    "oldPrice": 39000,
    "image": "p-ksbr001"
  },
  {
    "sku": "KSKR0192M",
    "name": "Реплика Казачья Шашка «За Покорение Ханства»",
    "category": "Шашки",
    "price": 24200,
    "oldPrice": 29000,
    "image": "p-kskr0192m"
  },
  {
    "sku": "KSKR0191M",
    "name": "Реплика Шашка Казачья образца 1886 года, Мельхиор",
    "category": "Шашки",
    "price": 24200,
    "oldPrice": 27000,
    "image": "p-kskr0191m"
  },
  {
    "sku": "KSKR018",
    "name": "Шашка Казачья Строевая Подзнаменка обр.1940г",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 23000,
    "image": "p-kskr018"
  },
  {
    "sku": "KSK018MK",
    "name": "Шашка Казачья Строевая Подзнаменка",
    "category": "Шашки",
    "price": 27800,
    "oldPrice": 32000,
    "image": "p-ksk018mk"
  },
  {
    "sku": "PSK0111",
    "name": "Шашка Драгунская Солдатская с Креплением под Штык",
    "category": "Шашки",
    "price": 17500,
    "oldPrice": 22000,
    "image": "p-psk0111"
  },
  {
    "sku": "KSK0162",
    "name": "Шашка Генерала Бакланова, Резная",
    "category": "Шашки",
    "price": 19200,
    "oldPrice": 25000,
    "image": "p-ksk0162"
  },
  {
    "sku": "KSK0161",
    "name": "Шашка генерала Бакланова с Орлом",
    "category": "Шашки",
    "price": 19200,
    "oldPrice": 25000,
    "image": "p-ksk0161"
  },
  {
    "sku": "KSKR014B",
    "name": "Шашка Казачья обр. 1886 — 300 Лет Дома Романовых",
    "category": "Шашки",
    "price": 23300,
    "oldPrice": 29000,
    "image": "p-kskr014b"
  },
  {
    "sku": "KSKR013M",
    "name": "Шашка Казачья Офицерская обр. 1881 года — Лейбгвардии",
    "category": "Шашки",
    "price": 25800,
    "oldPrice": 29000,
    "image": "p-kskr013m"
  },
  {
    "sku": "KSKR01206",
    "name": "Шашка Казачья Рядовая обр. 1881 года, Клеймо 1906г",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 25000,
    "image": "p-kskr01206"
  },
  {
    "sku": "KSKR01299",
    "name": "Шашка Казачья Рядовая Образца 1881 года, Клеймо 1899г",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 23000,
    "image": "p-kskr01299"
  },
  {
    "sku": "KSKR01290",
    "name": "Шашка Казачья Рядовая с клеймом обр.1890г",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 25000,
    "image": "p-kskr01290"
  },
  {
    "sku": "KSKR01287",
    "name": "Шашка Казачья Донская обр. 1887г",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 23000,
    "image": "p-kskr01287"
  },
  {
    "sku": "KSKR01281",
    "name": "Шашка Казачья Рядовая, Клеймо 1881г",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 23000,
    "image": "p-kskr01281"
  },
  {
    "sku": "KSKR011",
    "name": "Шашка Драгунская «Кушкинский Бой»",
    "category": "Шашки",
    "price": 21600,
    "oldPrice": 26000,
    "image": "p-kskr011"
  },
  {
    "sku": "PSK009",
    "name": "Шашка Драгунская «За Фехтовальный Бой»",
    "category": "Шашки",
    "price": 18500,
    "oldPrice": 27000,
    "image": "p-psk009"
  },
  {
    "sku": "KSKR009",
    "name": "Шашка Драгунская обр. 1881 «Знают Турки Нас и Шведы»",
    "category": "Шашки",
    "price": 22700,
    "oldPrice": 26000,
    "image": "p-kskr009"
  },
  {
    "sku": "KSKR008",
    "name": "Реплика Шашка Драгунская Наградная с Клюквой",
    "category": "Шашки",
    "price": 23500,
    "oldPrice": 27000,
    "image": "p-kskr008"
  },
  {
    "sku": "KSKR0071",
    "name": "Шашка Офицерскаго Состава образца 1838г.",
    "category": "Шашки",
    "price": 22800,
    "oldPrice": 26000,
    "image": "p-kskr0071"
  },
  {
    "sku": "KSKR0071M",
    "name": "Шашка Генерала Ермолова образца 1838г, Мельхиор",
    "category": "Шашки",
    "price": 25700,
    "oldPrice": 29000,
    "image": "p-kskr0071m"
  },
  {
    "sku": "KSKR0062M",
    "name": "Шашка Казачья «За Оборону Порт Артура», Мельхиор",
    "category": "Шашки",
    "price": 25400,
    "oldPrice": 32000,
    "image": "p-kskr0062m"
  },
  {
    "sku": "KSKR0061M",
    "name": "Шашка Казачья «За Оборону Порт Артура», Мельхиор",
    "category": "Шашки",
    "price": 25400,
    "oldPrice": 33000,
    "image": "p-kskr0061m"
  },
  {
    "sku": "KSKR0061BM",
    "name": "Шашка Казачья «За Оборону Порт Артура» в Белой Коже",
    "category": "Шашки",
    "price": 27400,
    "oldPrice": 32000,
    "image": "p-kskr0061bm"
  },
  {
    "sku": "KSKR005BM",
    "name": "Шашка Казачья «Бойся Бога» в Белом Исполнении",
    "category": "Шашки",
    "price": 27400,
    "oldPrice": 33000,
    "image": "p-kskr005bm"
  },
  {
    "sku": "KSKR005M",
    "name": "Шашка Казачья «Слава нам — Страх врагам»",
    "category": "Шашки",
    "price": 25400,
    "oldPrice": 27000,
    "image": "p-kskr005m"
  },
  {
    "sku": "KSK0012B",
    "name": "Шашка Казачья Парадная «Бга Бойся — Цря Чти»",
    "category": "Шашки",
    "price": 20700,
    "oldPrice": 28900,
    "image": "p-ksk0012b"
  },
  {
    "sku": "KSK021K",
    "name": "Шашка Казачья Генеральская, в Красной Коже",
    "category": "Шашки",
    "price": 37000,
    "oldPrice": 51000,
    "image": "p-ksk021k"
  },
  {
    "sku": "KSK0031M",
    "name": "Шашка Драгунская Наградная «За Веру и Отечество», Мельхиор",
    "category": "Шашки",
    "price": 24500,
    "oldPrice": 27000,
    "image": "p-ksk0031m"
  },
  {
    "sku": "KSK0031B",
    "name": "Шашка Драгунская Наградная, 1 Дол Белая",
    "category": "Шашки",
    "price": 21700,
    "oldPrice": 28000,
    "image": "p-ksk0031b"
  },
  {
    "sku": "KSK0043",
    "name": "Шашка Драгунская Наградная «Без Нужды»",
    "category": "Шашки",
    "price": 19700,
    "oldPrice": 23000,
    "image": "p-ksk0043"
  },
  {
    "sku": "KSK0023M",
    "name": "Шашка Казачья Наградная Образца 1886 года, Мельхиор",
    "category": "Шашки",
    "price": 23800,
    "oldPrice": 27000,
    "image": "p-ksk0023m"
  },
  {
    "sku": "KSK0014",
    "name": "Шашка Казачья Наградная Честь, Долг, Отвага",
    "category": "Шашки",
    "price": 18700,
    "oldPrice": 24000,
    "image": "p-ksk0014"
  },
  {
    "sku": "N1",
    "name": "Шашка казачья Наградная «Без Нужды»",
    "category": "Шашки",
    "price": 18900,
    "oldPrice": 22000,
    "image": "p-n1"
  },
  {
    "sku": "KSK0212B",
    "name": "Шашка Генеральская Наградная «Спаси и Сохрани», Белая",
    "category": "Шашки",
    "price": 35000,
    "oldPrice": 49000,
    "image": "p-ksk0212b"
  },
  {
    "sku": "KSK0012O",
    "name": "Шашка Казачья «Слава Нам — Страх Врагам» с Орлом",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 24000,
    "image": "p-ksk0012o"
  },
  {
    "sku": "KSK0012",
    "name": "Шашка Казачья Наградная «Бога Бойся, Царя Чти»",
    "category": "Шашки",
    "price": 18700,
    "oldPrice": 24000,
    "image": "p-ksk0012"
  },
  {
    "sku": "KSK0013MV",
    "name": "Шашка Наградная «Без Нужды» С Вензелем, Мельхиор",
    "category": "Шашки",
    "price": 24800,
    "oldPrice": 29000,
    "image": "p-ksk0013mv"
  },
  {
    "sku": "KSK0011BO",
    "name": "Шашка Казачья Наградная «За Веру и Отечество», Белая с Орлом",
    "category": "Шашки",
    "price": 22200,
    "oldPrice": 29000,
    "image": "p-ksk0011bo"
  },
  {
    "sku": "KSK0011B",
    "name": "Шашка Казачья Парадная «За Веру и Отечество»",
    "category": "Шашки",
    "price": 20700,
    "oldPrice": 25000,
    "image": "p-ksk0011b"
  },
  {
    "sku": "KSK0011O",
    "name": "Шашка Казачья Наградная «За Веру и Отечество», Имперский Орел",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 25000,
    "image": "p-ksk0011o"
  },
  {
    "sku": "KSK0011",
    "name": "Шашка Наградная «За Веру и Отечество»",
    "category": "Шашки",
    "price": 18700,
    "oldPrice": 24000,
    "image": "p-ksk0011"
  },
  {
    "sku": "KNJ002",
    "name": "Пластунский Нож в Ножнах",
    "category": "Ножи",
    "price": 10000,
    "oldPrice": 16000,
    "image": "p-knj002"
  },
  {
    "sku": "MPL002",
    "name": "Палаш Кирасирский обр.1826г. в Наградном виде",
    "category": "Палаши",
    "price": 23900,
    "oldPrice": 29000,
    "image": "p-mpl002"
  },
  {
    "sku": "MPL001",
    "name": "Палаш Морской обр.1855г. в Наградном Виде",
    "category": "Палаши",
    "price": 23700,
    "oldPrice": 29000,
    "image": "p-mpl001"
  },
  {
    "sku": "KSP0022",
    "name": "Гвардейская Елизаветинская шпага офицерского состава, обр. 1740г",
    "category": "Шпаги",
    "price": 23900,
    "oldPrice": 28000,
    "image": "p-ksp0022"
  },
  {
    "sku": "KSP0021",
    "name": "Гвардейская Елизаветинская шпага офицерского состава, образца 1740 года",
    "category": "Шпаги",
    "price": 22900,
    "oldPrice": 27000,
    "image": "p-ksp0021"
  },
  {
    "sku": "KKN003M",
    "name": "Кинжал Кубанских Казачьих Войск, Мельхиор",
    "category": "Кинжалы",
    "price": 16900,
    "oldPrice": 20000,
    "image": "p-kkn003m"
  },
  {
    "sku": "KKN0011",
    "name": "Кавказский Кинжал Бебут",
    "category": "Кинжалы",
    "price": 16300,
    "oldPrice": 20000,
    "image": "p-kkn0011"
  },
  {
    "sku": "КKN001",
    "name": "Кинжал Бебут, Обр. 1905г",
    "category": "Кинжалы",
    "price": 14700,
    "oldPrice": 18000,
    "image": "p--kn001"
  },
  {
    "sku": "KSB0041B",
    "name": "Сабля Бородинская в Белой Коже",
    "category": "Сабли",
    "price": 23000,
    "oldPrice": 30000,
    "image": "p-ksb0041b"
  },
  {
    "sku": "KSB0011",
    "name": "Сабля Клыч наградная",
    "category": "Сабли",
    "price": 30000,
    "oldPrice": 38000,
    "image": "p-ksb0011"
  },
  {
    "sku": "KSB001",
    "name": "Сабля Клыч Чистый",
    "category": "Сабли",
    "price": 28900,
    "oldPrice": 36000,
    "image": "p-ksb001"
  },
  {
    "sku": "PSK0012",
    "name": "Шашка Казачья Рядового Состава обр.1881г",
    "category": "Шашки",
    "price": 16000,
    "oldPrice": 21000,
    "image": "p-psk0012"
  },
  {
    "sku": "KSK020",
    "name": "Шашка Погружная Волчок",
    "category": "Шашки",
    "price": 21600,
    "oldPrice": 25000,
    "image": "p-ksk020"
  },
  {
    "sku": "KSK0035M",
    "name": "Шашка Драгунская Наградная «Спаси и Сохрани», Мельхиор",
    "category": "Шашки",
    "price": 24500,
    "oldPrice": 26000,
    "image": "p-ksk0035m"
  },
  {
    "sku": "PKN001",
    "name": "Кавказский Кинжал КАМА, Чистый Клинок",
    "category": "Кинжалы",
    "price": 12000,
    "oldPrice": 18000,
    "image": "p-pkn001"
  },
  {
    "sku": "PSB001",
    "name": "Сабля Офицерская Образца 1841 года",
    "category": "Сабли",
    "price": 18200,
    "oldPrice": 22000,
    "image": "p-psb001"
  },
  {
    "sku": "PSKR014",
    "name": "Шашка Казачья СССР Образца 1927 года",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 26000,
    "image": "p-pskr014"
  },
  {
    "sku": "PSK014",
    "name": "Шашка Казачья СССР",
    "category": "Шашки",
    "price": 14900,
    "oldPrice": 26000,
    "image": "p-psk014"
  },
  {
    "sku": "PSKR013",
    "name": "Шашка Казачья РККА Образца 1927 года",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 25000,
    "image": "p-pskr013"
  },
  {
    "sku": "PSK013",
    "name": "Шашка Казачья РККА, 1 Дол",
    "category": "Шашки",
    "price": 14900,
    "oldPrice": 20000,
    "image": "p-psk013"
  },
  {
    "sku": "PSKR012",
    "name": "Шашка Нижних Чинов образца 1838 года",
    "category": "Шашки",
    "price": 20900,
    "oldPrice": 29000,
    "image": "p-pskr012"
  },
  {
    "sku": "PSK012",
    "name": "Шашка Казачья Баклановская Образца 1838 года",
    "category": "Шашки",
    "price": 16200,
    "oldPrice": 23000,
    "image": "p-psk012"
  },
  {
    "sku": "PSKR011",
    "name": "Шашка Драгунская Солдатская Образца 1881 года",
    "category": "Шашки",
    "price": 19900,
    "oldPrice": 26000,
    "image": "p-pskr011"
  },
  {
    "sku": "PSK011",
    "name": "Шашка Драгунская Солдатская",
    "category": "Шашки",
    "price": 15700,
    "oldPrice": 19000,
    "image": "p-psk011"
  },
  {
    "sku": "PSK008",
    "name": "Шашка Драгунская Офицерская",
    "category": "Шашки",
    "price": 15300,
    "oldPrice": 23000,
    "image": "p-psk008"
  },
  {
    "sku": "PSK007",
    "name": "Шашка Драгунская Рядового Состава",
    "category": "Шашки",
    "price": 15000,
    "oldPrice": 21000,
    "image": "p-psk007"
  },
  {
    "sku": "PSKR006",
    "name": "Шашка Казачья Офицерская Образца 1905 года",
    "category": "Шашки",
    "price": 21100,
    "oldPrice": 27000,
    "image": "p-pskr006"
  },
  {
    "sku": "PSK006",
    "name": "Шашка Казачья Офицерская",
    "category": "Шашки",
    "price": 15600,
    "oldPrice": 23000,
    "image": "p-psk006"
  },
  {
    "sku": "PSK005",
    "name": "Казачья шашка Джигитка",
    "category": "Шашки",
    "price": 15500,
    "oldPrice": 18000,
    "image": "p-psk005"
  },
  {
    "sku": "PSK004",
    "name": "Казачья шашка Джигитка клинок 72см",
    "category": "Шашки",
    "price": 15500,
    "oldPrice": 20000,
    "image": "p-psk004"
  },
  {
    "sku": "PSK003",
    "name": "Шашка Казачья для Силовой Рубки",
    "category": "Шашки",
    "price": 15000,
    "oldPrice": 19000,
    "image": "p-psk003"
  },
  {
    "sku": "PSKR002",
    "name": "Шашка казачья Донская обр.1881г",
    "category": "Шашки",
    "price": 20900,
    "oldPrice": 26000,
    "image": "p-pskr002"
  },
  {
    "sku": "PSK002",
    "name": "Шашка Казачья Донская Степовая",
    "category": "Шашки",
    "price": 15000,
    "oldPrice": 21000,
    "image": "p-psk002"
  },
  {
    "sku": "PSK001",
    "name": "Шашка Казачья Рядового Состава Обр. 1881г",
    "category": "Шашки",
    "price": 14500,
    "oldPrice": 21000,
    "image": "p-psk001"
  }
]
