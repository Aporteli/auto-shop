export type BlogPostSeed = {
  slug: string;
  titleEn: string;
  titleRu: string;
  excerptEn: string;
  excerptRu: string;
  contentEn: string;
  contentRu: string;
};

export const blogPosts: BlogPostSeed[] = [
  {
    slug: 'winter-car-preparation',
    titleEn: 'How to protect your car body during winter conditions',
    titleRu: 'Как защитить кузов автомобиля в зимний период',
    excerptEn:
      'Practical tips on keeping your vehicle protected from road salt, moisture, and changing temperatures throughout the cold season.',
    excerptRu:
      'Практические советы по защите автомобиля от дорожной соли, влаги и перепадов температур в холодное время года.',
    contentEn: `
      <p>Winter is one of the toughest seasons for any vehicle. Road salt, slush, freezing rain, and constant temperature changes can damage paint, accelerate corrosion, and wear out rubber seals faster than you might expect.</p>
      <p>Start with a thorough wash before the first frost. Clean the wheel arches, underbody, and door sills where salt and moisture collect. Applying a quality wax or ceramic coating creates a barrier that makes it easier to rinse off grime during the season.</p>
      <p>Check door and trunk seals for cracks. Even small gaps let water in, and when temperatures drop overnight that moisture can freeze and expand. A silicone-based protectant keeps rubber flexible and helps prevent sticking doors on cold mornings.</p>
      <p>Do not forget the interior. Floor mats with high edges trap melted snow and protect carpets. If you drive in heavy snow, keep a microfiber towel in the car to dry wet seats and avoid long-term odor or mold.</p>
      <p>Finally, inspect paint chips early. A small scratch becomes a rust spot quickly when salt is involved. Touch-up paint is inexpensive compared to panel repair, and it is one of the best investments you can make before winter arrives.</p>
    `,
    contentRu: `
      <p>Зима — один из самых тяжёлых сезонов для любого автомобиля. Дорожная соль, слякоть, ледяной дождь и постоянные перепады температур могут повредить лакокрасочное покрытие, ускорить коррозию и быстрее износить резиновые уплотнители.</p>
      <p>Начните с тщательной мойки до первых заморозков. Очистите арки колёс, днище и пороги — именно там скапливаются соль и влага. Качественный воск или керамическое покрытие создаёт барьер и облегчает смыв грязи в течение сезона.</p>
      <p>Проверьте уплотнители дверей и багажника на трещины. Даже небольшие зазоры пропускают воду, которая ночью замерзает и расширяется. Силиконовая смазка сохраняет резину эластичной и помогает избежать «залипания» дверей в мороз.</p>
      <p>Не забывайте о салоне. Коврики с бортами удерживают талую снег и защищают обивку. Если вы часто ездите по снегу, держите в машине микрофибру, чтобы протирать мокрые сиденья и предотвратить запах и плесень.</p>
      <p>Наконец, осмотрите сколы краски заранее. Небольшая царапина при контакте с солью быстро превращается в ржавчину. Ремонтный карандаш стоит недорого по сравнению с покраской панели и — одна из лучших инвестиций перед зимой.</p>
    `,
  },
  {
    slug: 'how-to-buy-used-car-georgia',
    titleEn: 'How to Buy a Used Car in Georgia',
    titleRu: 'Как купить подержанный автомобиль в Грузии',
    excerptEn: 'A complete guide to inspecting, registering, and importing vehicles in Georgia.',
    excerptRu: 'Полное руководство по проверке, регистрации и импорту автомобилей в Грузии.',
    contentEn: `
      <p>Buying a used car in Georgia can be straightforward if you follow a clear process. Whether you are purchasing locally or importing, the key is verification: history, condition, and paperwork must all align before you pay.</p>
      <p>Always start with a VIN check. Confirm that the vehicle identity matches the registration documents and that there are no outstanding liens or major accident records. If the seller hesitates to share the VIN, treat that as a red flag.</p>
      <p>Inspect the car in daylight. Look for uneven panel gaps, mismatched paint, and excessive wear on the steering wheel or pedals compared to the odometer reading. A short test drive on mixed roads reveals suspension noise, gearbox hesitation, and braking issues.</p>
      <p>For imported vehicles, understand customs status before negotiating. A car already cleared for local registration is simpler to transfer. Ask for the full document chain: invoice, customs declaration, and prior ownership records.</p>
      <p>When you agree on price, use a written contract that lists the exact amount, payment method, and delivery date. Complete registration promptly at the service center and keep copies of every document. A disciplined approach saves money and prevents disputes later.</p>
    `,
    contentRu: `
      <p>Покупка подержанного автомобиля в Грузии может быть простой, если следовать чёткому процессу. Покупаете ли вы локально или импортируете — главное проверка: история, состояние и документы должны совпадать до оплаты.</p>
      <p>Всегда начинайте с проверки VIN. Убедитесь, что идентификатор совпадает с документами и нет обременений или серьёзных ДТП в истории. Если продавец отказывается сообщить VIN — это тревожный сигнал.</p>
      <p>Осматривайте автомобиль днём. Обратите внимание на неровные зазоры кузова, различия в оттенке краски и износ руля или педалей относительно пробега. Короткий тест-драйв по разным дорогам выявит шумы подвески, рывки коробки и проблемы с тормозами.</p>
      <p>Для импортных авто заранее уточните таможенный статус. Машина, уже растаможенная для местной регистрации, оформляется проще. Попросите полный пакет: инвойс, таможенную декларацию и документы о прежних владельцах.</p>
      <p>Договоритесь о цене письменно: сумма, способ оплаты и дата передачи. Быстро завершите регистрацию в сервисном центре и сохраните копии всех документов. Дисциплина на этом этапе экономит деньги и предотвращает споры.</p>
    `,
  },
  {
    slug: 'vin-check-importance',
    titleEn: 'What dashboard warning lights really mean',
    titleRu: 'Что на самом деле означают индикаторы на панели приборов',
    excerptEn: 'Learn which warning lights need immediate attention and which can wait until your next service visit.',
    excerptRu: 'Узнайте, какие индикаторы требуют немедленного внимания, а какие можно отложить до сервиса.',
    contentEn: `
      <p>Modern dashboards use dozens of symbols, and not all of them indicate a disaster. Still, ignoring the wrong light at the wrong time can turn a minor repair into an expensive breakdown.</p>
      <p>A steady red oil can or coolant temperature light means stop safely as soon as possible. Low oil pressure or overheating can destroy an engine within minutes. Do not continue driving to "see if it goes away."</p>
      <p>Amber lights usually signal a system that needs attention soon. The check-engine light may relate to emissions, sensors, or ignition. While the car might drive normally, prolonged delay can reduce fuel economy and damage the catalytic converter.</p>
      <p>ABS and traction-control warnings affect braking performance in slippery conditions. If these appear after a battery disconnect, they may reset after a short drive. If they stay on, have the system scanned.</p>
      <p>Keep your owner's manual in the glove box or saved on your phone. When a symbol appears, note whether it is red or amber, solid or flashing, and whether performance changed. That information helps any mechanic diagnose the issue faster.</p>
    `,
    contentRu: `
      <p>Современные панели приборов показывают десятки символов, и не каждый из них означает катастрофу. Однако игнорирование нужного индикатора в нужный момент может превратить мелкий ремонт в дорогую поломку.</p>
      <p>Красный значок масла или температуры охлаждающей жидкости означает: остановитесь как можно безопаснее. Низкое давление масла или перегрев могут уничтожить двигатель за минуты. Не продолжайте движение в надежде, что лампа погаснет.</p>
      <p>Жёлтые индикаторы обычно сигнализируют о проблеме, которую нужно решить в ближайшее время. Check Engine может быть связан с выбросами, датчиками или зажиганием. Машина едет нормально, но затягивание снижает экономичность и вредит катализатору.</p>
      <p>Предупреждения ABS и системы стабилизации влияют на торможение на скользкой дороге. После отключения аккумулятора они иногда гаснут после короткой поездки. Если горят постоянно — нужна диагностика.</p>
      <p>Храните руководство в бардачке или на телефоне. Когда загорается символ, запомните цвет, мигает ли он и изменилась ли динамика автомобиля. Это ускорит работу механика.</p>
    `,
  },
  {
    slug: 'electric-vehicles-market-2025',
    titleEn: 'Autoinsider: key automotive events of 2024',
    titleRu: 'Autoinsider: главные автомобильные события 2024 года',
    excerptEn: 'A recap of the launches, policy shifts, and market trends that shaped the car industry last year.',
    excerptRu: 'Обзор премьер, изменений в регулировании и рыночных трендов, определивших отрасль в прошлом году.',
    contentEn: `
      <p>2024 was a turning point for both electric vehicles and traditional combustion models. Manufacturers pushed longer-range EVs while also refining hybrids for buyers who are not ready to rely solely on charging networks.</p>
      <p>In Europe and the Caucasus region, import demand remained strong for compact crossovers and economical sedans. Buyers prioritized total cost of ownership: fuel, insurance, and expected maintenance over the first three years.</p>
      <p>Auction platforms gained visibility among professional dealers. More showroom listings included detailed photo sets, service history scans, and verified mileage reports. Transparency became a competitive advantage.</p>
      <p>Regulatory discussions around emissions and safety equipment influenced which trims appeared on local lots. Cars with advanced driver-assistance packages held value better in urban markets.</p>
      <p>Looking ahead, expect continued growth in hybrid listings, more factory-warranty transfers on newer used imports, and sharper price differentiation between high-mileage fleet cars and carefully maintained private vehicles.</p>
    `,
    contentRu: `
      <p>2024 год стал переломным и для электромобилей, и для классических ДВС. Производители увеличивали запас хода EV, одновременно совершенствуя гибриды для тех, кто не готов полностью зависеть от зарядной инфраструктуры.</p>
      <p>В Европе и на Кавказе сохранился спрос на компактные кроссоверы и экономичные седаны. Покупатели оценивали совокупную стоимость владения: топливо, страховку и обслуживание за первые три года.</p>
      <p>Аукционные площадки стали заметнее среди дилеров. В объявлениях чаще появлялись полные фотоотчёты, сканы сервисной истории и подтверждённый пробег. Прозрачность стала конкурентным преимуществом.</p>
      <p>Обсуждение экологических норм и систем безопасности влияло на комплектации на локальном рынке. Автомобили с продвинутыми ассистентами водителя лучше удерживали цену в городах.</p>
      <p>Впереди — рост доли гибридов, больше передач заводской гарантии на свежие импортные авто и более чёткая разница в цене между пробежными корпоративными машинами и ухоженными частными.</p>
    `,
  },
  {
    slug: 'hybrid-vs-electric',
    titleEn: 'Hybrid vs Electric: Which Is Right for You?',
    titleRu: 'Гибрид или электро: что выбрать?',
    excerptEn: 'Compare costs, range, charging, and long-term ownership for everyday drivers.',
    excerptRu: 'Сравните стоимость, запас хода, зарядку и владение для повседневных поездок.',
    contentEn: `
      <p>Choosing between a hybrid and a fully electric vehicle depends on how and where you drive. Neither option is universally better; the right choice matches your daily distance, parking situation, and budget.</p>
      <p>Hybrids excel when your routine includes mixed city and highway driving without reliable charging at home. Regenerative braking and electric assist reduce fuel use in traffic while eliminating range anxiety on longer trips.</p>
      <p>Electric vehicles shine for predictable urban commutes. If you can charge overnight, energy cost per kilometer is usually lower and maintenance is simpler because there are fewer moving parts. The trade-off is planning for road trips and public charging availability.</p>
      <p>Consider resale value in your market. In some regions, hybrids sell quickly because buyers understand the technology. In others, demand for EVs is rising fast as charging infrastructure expands.</p>
      <p>Test both on your actual routes before deciding. A twenty-minute drive reveals noise levels, ride comfort, and how intuitive the energy display feels. The best car is the one that fits your life, not just the specification sheet.</p>
    `,
    contentRu: `
      <p>Выбор между гибридом и полностью электрическим автомобилем зависит от того, как и где вы ездите. Универсально лучшего варианта нет — важно совпадение с пробегом, парковкой и бюджетом.</p>
      <p>Гибриды сильны при смешанном городском и загородном цикле без удобной домашней зарядки. Рекуперация и электропомощь снижают расход в пробках, а дальние поездки не вызывают страха разрядки.</p>
      <p>Электромобили идеальны для предсказуемых городских маршрутов. Если можно заряжаться ночью, стоимость километра обычно ниже, а обслуживание проще из-за меньшего числа узлов. Минус — планирование путешествий и доступность зарядок.</p>
      <p>Учитывайте ликвидность на вторичном рынке. В одних регионах гибриды продаются быстро, в других спрос на EV растёт вместе с инфраструктурой.</p>
      <p>Протестируйте оба варианта на своих маршрутах. Двадцатиминутная поездка покажет шум, комфорт и удобство энергомониторинга. Лучший автомобиль — тот, что подходит вашей жизни, а не только таблице характеристик.</p>
    `,
  },
  {
    slug: 'dealer-vs-private-seller',
    titleEn: 'Dealer vs Private Seller: Pros and Cons',
    titleRu: 'Дилер или частник: плюсы и минусы',
    excerptEn: 'Weigh warranty, price, and negotiation when choosing who to buy from.',
    excerptRu: 'Сравните гарантию, цену и переговоры при выборе продавца.',
    contentEn: `
      <p>When you shop for a used car, you will usually choose between a licensed dealer and a private seller. Each path offers different advantages, and the best deal is not always the lowest sticker price.</p>
      <p>Dealers typically handle registration paperwork, offer limited warranties, and maintain a stock you can compare side by side. You may pay more upfront, but the process is structured and support is easier to reach if something goes wrong shortly after purchase.</p>
      <p>Private sellers often list lower prices because they have no showroom overhead. You can learn how the car was used daily and negotiate directly. However, you are responsible for verifying history, arranging inspection, and handling transfer documents yourself.</p>
      <p>Regardless of source, insist on a pre-purchase inspection by an independent mechanic. Ask for service records and match them to the odometer. A clean history report does not replace a physical inspection.</p>
      <p>Decide what you value most: speed and paperwork support from a dealer, or potential savings and personal story from a private owner. AutoShop lets you filter listings by seller type so you can compare both markets fairly.</p>
    `,
    contentRu: `
      <p>При покупке подержанного авто вы обычно выбираете между дилером и частным продавцом. У каждого варианта свои плюсы, и лучшая сделка — не всегда самая низкая цена.</p>
      <p>Дилеры чаще оформляют документы, дают ограниченную гарантию и держат несколько машин для сравнения. Цена может быть выше, но процесс структурирован, а поддержку проще получить при проблемах сразу после покупки.</p>
      <p>Частники нередко ставят ниже цену без расходов на салон. Можно узнать реальный режим эксплуатации и торговаться напрямую. Но проверка истории, осмотр и документы — на вас.</p>
      <p>Независимо от источника, настаивайте на осмотре у стороннего механика. Просите сервисные книжки и сверяйте с пробегом. Чистый отчёт не заменяет физический осмотр.</p>
      <p>Решите, что важнее: скорость и помощь с бумагами у дилера или экономия и личная история у частника. На AutoShop можно фильтровать объявления по типу продавца и сравнивать рынки честно.</p>
    `,
  },
];
