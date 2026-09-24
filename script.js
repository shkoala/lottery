const setupScreen=document.getElementById('setupScreen');
const gameScreen=document.getElementById('gameScreen');
const wordsInput=document.getElementById('wordsInput');
const importWordsInput=document.getElementById('importWordsInput');
const imageRows=document.getElementById('imageRows');
const buildImageRowsBtn=document.getElementById('buildImageRowsBtn');
const quickWordInput=document.getElementById('quickWordInput');
const quickAddWordBtn=document.getElementById('quickAddWordBtn');
const deleteSelectedWordBtn=document.getElementById('deleteSelectedWordBtn');
const addWordBtn=document.getElementById('addWordBtn');
const addWordPicturesBtn=document.getElementById('addWordPicturesBtn');
const fillDemoBtn=document.getElementById('fillDemoBtn');
const normalizeListBtn=document.getElementById('normalizeListBtn');
const dedupeListBtn=document.getElementById('dedupeListBtn');
const sortListBtn=document.getElementById('sortListBtn');
const clearListBtn=document.getElementById('clearListBtn');
const startBtn=document.getElementById('startBtn');
const introToggleBtn=document.getElementById('introToggleBtn');
const backBtn=document.getElementById('backBtn');
const teacherModeBtn=document.getElementById('teacherModeBtn');
const kidsModeBtn=document.getElementById('kidsModeBtn');
const classViewBtn=document.getElementById('classViewBtn');
const scoreboardBtn=document.getElementById('scoreboardBtn');
const scoreboardPanel=document.getElementById('scoreboardPanel');
const scoreResetBtn=document.getElementById('scoreResetBtn');
const scoreHideBtn=document.getElementById('scoreHideBtn');
const teamAName=document.getElementById('teamAName');
const teamBName=document.getElementById('teamBName');
const teamAScoreEl=document.getElementById('teamAScore');
const teamBScoreEl=document.getElementById('teamBScore');
const restartBtn=document.getElementById('restartBtn');
const clearBtn=document.getElementById('clearBtn');
const nextBtn=document.getElementById('nextBtn');
const coinTinyBtn=document.getElementById('coinTinyBtn');
const coinSmallBtn=document.getElementById('coinSmallBtn');
const coinLargeBtn=document.getElementById('coinLargeBtn');
const roundEndOverlay=document.getElementById('roundEndOverlay');
const playAgainBtn=document.getElementById('playAgainBtn');
const roundSettingsBtn=document.getElementById('roundSettingsBtn');
const fullscreenBtn=document.getElementById('fullscreenBtn');
const langRuBtn=document.getElementById('langRuBtn');
const langEnBtn=document.getElementById('langEnBtn');
const shuffleToggle=document.getElementById('shuffleToggle');
const progressTitle=document.getElementById('progressTitle');
const ticket=document.getElementById('ticket');
const ticketContent=document.getElementById('ticketContent');
const picturePanel=document.getElementById('picturePanel');
const wordPanel=document.getElementById('wordPanel');
const resultImage=document.getElementById('resultImage');
const resultBuiltinSprite=document.getElementById('resultBuiltinSprite');
const resultWord=document.getElementById('resultWord');
const showWordBtn=document.getElementById('showWordBtn');
const scratchCanvas=document.getElementById('scratchCanvas');
const pictureScratchCanvas=document.getElementById('pictureScratchCanvas');
const wordScratchCanvas=document.getElementById('wordScratchCanvas');
const previewIntroBtn=document.getElementById('previewIntroBtn');
const confettiCanvas=document.getElementById('confettiCanvas');
const confettiCtx=confettiCanvas.getContext('2d');
const imageStyleSelect=document.getElementById('imageStyleSelect');
const autoFillAllBtn=document.getElementById('autoFillAllBtn');
const builtinFillBtn=document.getElementById('builtinFillBtn');
const clearAllImagesBtn=document.getElementById('clearAllImagesBtn');
const searchStatus=document.getElementById('searchStatus');
const modal=document.getElementById('imageModal');
const closeModalBtn=document.getElementById('closeModalBtn');
const modalSearchInput=document.getElementById('modalSearchInput');
const modalSearchBtn=document.getElementById('modalSearchBtn');
const modalMoreBtn=document.getElementById('modalMoreBtn');
const modalResults=document.getElementById('modalResults');
const modalMessage=document.getElementById('modalMessage');
const modalTitle=document.getElementById('modalTitle');
const cropModal=document.getElementById('cropModal');
const cropBackdrop=document.getElementById('cropBackdrop');
const cropCanvas=document.getElementById('cropCanvas');
const cropZoom=document.getElementById('cropZoom');
const cropFitBtn=document.getElementById('cropFitBtn');
const cropCloseBtn=document.getElementById('cropCloseBtn');
const cropCancelBtn=document.getElementById('cropCancelBtn');
const cropApplyBtn=document.getElementById('cropApplyBtn');
const introOverlay=document.getElementById('introOverlay');
const introStage=document.getElementById('introStage');
const skipIntroBtn=document.getElementById('skipIntroBtn');
const modeInputs=Array.from(document.querySelectorAll('input[name="mode"]'));
const categoryButtons=Array.from(document.querySelectorAll('[data-category]'));
const ctx=scratchCanvas.getContext('2d',{willReadFrequently:true});
let selectedImageRow=null;

const STORAGE_KEY='shkoala_lottery_final_v1';
const OPENVERSE_API='https://api.openverse.org/v1/images/';
const AUTO_REVEAL_THRESHOLD=70;
const demoWords=['dog','apple','holiday','music','teacher','banana'];
const presetCategories={"pets":["cat","dog","rabbit","hamster","parrot","fish","turtle","guinea pig"],"farm":["cow","pig","sheep","goat","horse","hen","duck","donkey","rooster"],"zoo":["lion","tiger","elephant","giraffe","zebra","monkey","panda","bear","wolf","fox","deer","squirrel","hedgehog","owl","crocodile","hippo"],"sea":["fish","dolphin","whale","shark","octopus","crab","starfish"],"food":["apple","banana","orange","grapes","strawberry","watermelon","bread","cheese","milk","juice","ice cream","cupcake","pizza","burger","sandwich","carrot"],"school":["pencil","pen","crayons","eraser","ruler","school bag","notebook","scissors","glue","paint palette","calculator","water bottle","paintbrush","book","marker","sharpener"],"weather":["sun","cloud","rain","snowflake","rainbow","wind","thunderstorm","umbrella","fog","partly cloudy","autumn leaf","snowman"],"garden":["tree","flower","grass","watering can"],"transport":["car","bus","train","airplane","helicopter","bicycle","motorcycle","sailboat","ship","van","taxi","fire truck","ambulance","police car","tractor","scooter"],"home":["bed","sofa","chair","table","desk","wardrobe","bookshelf","lamp","clock","mirror","armchair","stool","cupboard","fridge","oven","washing machine","bathtub","sink"],"clothes":["t-shirt","shirt","sweater","hoodie","coat","dress","skirt","trousers","shorts","socks","shoes","boots","sandals","cap","scarf","gloves"],"body":["head","hair","eye","ear","nose","mouth","tooth","hand","arm","leg","foot","finger","shoulder","knee","elbow","back"],"birds":["parrot","owl","penguin","flamingo","peacock","swan","chick","eagle","toucan"],"toys":["teddy bear","ball","doll","toy car","toy train","blocks","kite","robot","yo-yo"],"actions":["read","write","run","jump","eat","sleep","sit","stand","clap"],"everyday":["ball","cup","phone","key","umbrella","clock","toothbrush","camera","gift"]};
const BUILTIN_ALIASES={"pencil":"pencil","pencils":"pencil","карандаш":"pencil","карандаши":"pencil","pen":"pen","pens":"pen","ручка":"pen","ручки":"pen","crayons":"crayons","crayon":"crayons","мелки":"crayons","восковые мелки":"crayons","eraser":"eraser","rubber":"eraser","ластик":"eraser","ruler":"ruler","линейка":"ruler","school bag":"school bag","schoolbag":"school bag","backpack":"school bag","bag":"school bag","рюкзак":"school bag","ранец":"school bag","портфель":"school bag","notebook":"notebook","copybook":"notebook","exercise book":"notebook","тетрадь":"notebook","scissors":"scissors","ножницы":"scissors","glue":"glue","glue stick":"glue","клей":"glue","paint palette":"paint palette","palette":"paint palette","paints":"paint palette","палитра":"paint palette","краски":"paint palette","calculator":"calculator","калькулятор":"calculator","water bottle":"water bottle","bottle":"water bottle","бутылка воды":"water bottle","бутылка":"water bottle","paintbrush":"paintbrush","paint brush":"paintbrush","brush":"paintbrush","кисточка":"paintbrush","кисть":"hand","book":"book","books":"book","книга":"book","книги":"book","marker":"marker","felt-tip pen":"marker","felt tip pen":"marker","маркер":"marker","фломастер":"marker","sharpener":"sharpener","pencil sharpener":"sharpener","точилка":"sharpener","apple":"apple","яблоко":"apple","banana":"banana","банан":"banana","orange":"orange","апельсин":"orange","grapes":"grapes","grape":"grapes","виноград":"grapes","strawberry":"strawberry","клубника":"strawberry","watermelon":"watermelon","арбуз":"watermelon","bread":"bread","хлеб":"bread","cheese":"cheese","сыр":"cheese","milk":"milk","молоко":"milk","juice":"juice","сок":"juice","ice cream":"ice cream","ice-cream":"ice cream","icecream":"ice cream","мороженое":"ice cream","cupcake":"cupcake","muffin":"cupcake","кекс":"cupcake","pizza":"pizza","пицца":"pizza","burger":"burger","hamburger":"burger","бургер":"burger","sandwich":"sandwich","сэндвич":"sandwich","бутерброд":"sandwich","carrot":"carrot","морковь":"carrot","sun":"sun","sunny":"sun","солнце":"sun","солнечно":"sun","cloud":"cloud","cloudy":"cloud","облако":"cloud","облачно":"cloud","rain":"rain","rainy":"rain","дождь":"rain","дождливо":"rain","snowflake":"snowflake","snow":"snowflake","снежинка":"snowflake","снег":"snowflake","rainbow":"rainbow","радуга":"rainbow","wind":"wind","windy":"wind","ветер":"wind","ветрено":"wind","thunderstorm":"thunderstorm","storm":"thunderstorm","гроза":"thunderstorm","буря":"thunderstorm","umbrella":"umbrella","зонт":"umbrella","fog":"fog","foggy":"fog","туман":"fog","partly cloudy":"partly cloudy","переменная облачность":"partly cloudy","autumn leaf":"autumn leaf","fall leaf":"autumn leaf","осенний лист":"autumn leaf","лист":"autumn leaf","snowman":"snowman","снеговик":"snowman","tree":"tree","дерево":"tree","flower":"flower","цветок":"flower","grass":"grass","трава":"grass","watering can":"watering can","лейка":"watering can","car":"car","automobile":"car","машина":"car","автомобиль":"car","bus":"bus","автобус":"bus","train":"train","поезд":"train","airplane":"airplane","aeroplane":"airplane","plane":"airplane","самолет":"airplane","самолёт":"airplane","helicopter":"helicopter","вертолет":"helicopter","вертолёт":"helicopter","bicycle":"bicycle","bike":"bicycle","велосипед":"bicycle","motorcycle":"motorcycle","motorbike":"motorcycle","мотоцикл":"motorcycle","sailboat":"sailboat","sailing boat":"sailboat","парусная лодка":"sailboat","парусник":"sailboat","ship":"ship","корабль":"ship","van":"van","фургон":"van","taxi":"taxi","такси":"taxi","fire truck":"fire truck","fire engine":"fire truck","пожарная машина":"fire truck","ambulance":"ambulance","скорая":"ambulance","скорая помощь":"ambulance","police car":"police car","полицейская машина":"police car","tractor":"tractor","трактор":"tractor","scooter":"scooter","самокат":"scooter","bed":"bed","кровать":"bed","sofa":"sofa","couch":"sofa","диван":"sofa","chair":"chair","стул":"chair","table":"table","стол":"table","desk":"desk","письменный стол":"desk","парта":"desk","wardrobe":"wardrobe","closet":"wardrobe","шкаф":"wardrobe","bookshelf":"bookshelf","bookcase":"bookshelf","книжный шкаф":"bookshelf","полка":"bookshelf","lamp":"lamp","лампа":"lamp","clock":"clock","часы":"clock","mirror":"mirror","зеркало":"mirror","armchair":"armchair","кресло":"armchair","stool":"stool","табурет":"stool","fridge":"fridge","refrigerator":"fridge","холодильник":"fridge","oven":"oven","stove":"oven","духовка":"oven","плита":"oven","bathtub":"bathtub","bath":"bathtub","ванна":"bathtub","sink":"sink","раковина":"sink","cupboard":"cupboard","шкафчик":"cupboard","washing machine":"washing machine","стиральная машина":"washing machine","t-shirt":"t-shirt","tshirt":"t-shirt","tee":"t-shirt","футболка":"t-shirt","shirt":"shirt","рубашка":"shirt","sweater":"sweater","jumper":"sweater","свитер":"sweater","hoodie":"hoodie","толстовка":"hoodie","худи":"hoodie","coat":"coat","пальто":"coat","dress":"dress","платье":"dress","skirt":"skirt","юбка":"skirt","trousers":"trousers","pants":"trousers","брюки":"trousers","штаны":"trousers","shorts":"shorts","шорты":"shorts","socks":"socks","sock":"socks","носки":"socks","shoes":"shoes","shoe":"shoes","туфли":"shoes","обувь":"shoes","boots":"boots","ботинки":"boots","сапоги":"boots","sandals":"sandals","сандалии":"sandals","cap":"cap","кепка":"cap","scarf":"scarf","шарф":"scarf","gloves":"gloves","перчатки":"gloves","head":"head","голова":"head","hair":"hair","волосы":"hair","eye":"eye","eyes":"eye","глаз":"eye","глаза":"eye","ear":"ear","ears":"ear","ухо":"ear","уши":"ear","nose":"nose","нос":"nose","mouth":"mouth","рот":"mouth","tooth":"tooth","teeth":"tooth","зуб":"tooth","зубы":"tooth","hand":"hand","hands":"hand","ладонь":"hand","arm":"arm","arms":"arm","рука":"arm","руки":"arm","leg":"leg","legs":"leg","нога":"leg","ноги":"leg","foot":"foot","feet":"foot","ступня":"foot","стопа":"foot","finger":"finger","fingers":"finger","палец":"finger","пальцы":"finger","shoulder":"shoulder","плечо":"shoulder","knee":"knee","колено":"knee","elbow":"elbow","локоть":"elbow","back":"back","спина":"back","cat":"cat","cats":"cat","кошка":"cat","кот":"cat","dog":"dog","dogs":"dog","собака":"dog","пес":"dog","пёс":"dog","rabbit":"rabbit","bunny":"rabbit","кролик":"rabbit","hamster":"hamster","хомяк":"hamster","parrot":"parrot","попугай":"parrot","fish":"fish","рыба":"fish","рыбка":"fish","turtle":"turtle","черепаха":"turtle","guinea pig":"guinea pig","морская свинка":"guinea pig","cow":"cow","корова":"cow","pig":"pig","свинья":"pig","поросенок":"pig","поросёнок":"pig","sheep":"sheep","овца":"sheep","goat":"goat","коза":"goat","horse":"horse","лошадь":"horse","hen":"hen","chicken":"hen","курица":"hen","duck":"duck","утка":"duck","donkey":"donkey","осел":"donkey","осёл":"donkey","rooster":"rooster","cock":"rooster","петух":"rooster","lion":"lion","лев":"lion","tiger":"tiger","тигр":"tiger","elephant":"elephant","слон":"elephant","giraffe":"giraffe","жираф":"giraffe","zebra":"zebra","зебра":"zebra","monkey":"monkey","обезьяна":"monkey","panda":"panda","панда":"panda","bear":"bear","медведь":"bear","wolf":"wolf","волк":"wolf","fox":"fox","лиса":"fox","deer":"deer","олень":"deer","squirrel":"squirrel","белка":"squirrel","hedgehog":"hedgehog","еж":"hedgehog","ёж":"hedgehog","owl":"owl","сова":"owl","crocodile":"crocodile","крокодил":"crocodile","hippo":"hippo","hippopotamus":"hippo","бегемот":"hippo","dolphin":"dolphin","дельфин":"dolphin","whale":"whale","кит":"whale","shark":"shark","акула":"shark","octopus":"octopus","осьминог":"octopus","crab":"crab","краб":"crab","starfish":"starfish","морская звезда":"starfish","penguin":"penguin","пингвин":"penguin","flamingo":"flamingo","фламинго":"flamingo","teddy bear":"teddy bear","teddy":"teddy bear","мишка":"teddy bear","плюшевый мишка":"teddy bear","doll":"doll","кукла":"doll","toy car":"toy car","машинка":"toy car","игрушечная машина":"toy car","ball":"ball","мяч":"ball","toy train":"toy train","игрушечный поезд":"toy train","blocks":"blocks","building blocks":"blocks","кубики":"blocks","kite":"kite","воздушный змей":"kite","robot":"robot","робот":"robot","yo-yo":"yo-yo","yoyo":"yo-yo","йо-йо":"yo-yo","peacock":"peacock","павлин":"peacock","swan":"swan","лебедь":"swan","chick":"chick","цыпленок":"chick","цыплёнок":"chick","eagle":"eagle","орел":"eagle","орёл":"eagle","toucan":"toucan","тукан":"toucan","read":"read","reading":"read","читать":"read","чтение":"read","write":"write","writing":"write","писать":"write","письмо":"write","run":"run","running":"run","бегать":"run","бежать":"run","jump":"jump","jumping":"jump","прыгать":"jump","eat":"eat","eating":"eat","есть":"eat","кушать":"eat","sleep":"sleep","sleeping":"sleep","спать":"sleep","sit":"sit","sitting":"sit","сидеть":"sit","stand":"stand","standing":"stand","стоять":"stand","clap":"clap","clapping":"clap","хлопать":"clap","cup":"cup","mug":"cup","чашка":"cup","кружка":"cup","phone":"phone","mobile phone":"phone","smartphone":"phone","телефон":"phone","key":"key","ключ":"key","toothbrush":"toothbrush","зубная щетка":"toothbrush","зубная щётка":"toothbrush","camera":"camera","фотоаппарат":"camera","камера":"camera","gift":"gift","present":"gift","подарок":"gift"};
const BUILTIN_LOCAL={"pencil":"assets/pictures/school/pencil.png","pen":"assets/pictures/school/pen.png","crayons":"assets/pictures/school/crayons.png","eraser":"assets/pictures/school/eraser.png","ruler":"assets/pictures/school/ruler.png","school bag":"assets/pictures/school/school-bag.png","notebook":"assets/pictures/school/notebook.png","scissors":"assets/pictures/school/scissors.png","glue":"assets/pictures/school/glue.png","paint palette":"assets/pictures/school/paint-palette.png","calculator":"assets/pictures/school/calculator.png","water bottle":"assets/pictures/school/water-bottle.png","paintbrush":"assets/pictures/school/paintbrush.png","book":"assets/pictures/school/book.png","marker":"assets/pictures/school/marker.png","sharpener":"assets/pictures/school/sharpener.png","apple":"assets/pictures/food/apple.png","banana":"assets/pictures/food/banana.png","orange":"assets/pictures/food/orange.png","grapes":"assets/pictures/food/grapes.png","strawberry":"assets/pictures/food/strawberry.png","watermelon":"assets/pictures/food/watermelon.png","bread":"assets/pictures/food/bread.png","cheese":"assets/pictures/food/cheese.png","milk":"assets/pictures/food/milk.png","juice":"assets/pictures/food/juice.png","ice cream":"assets/pictures/food/ice-cream.png","cupcake":"assets/pictures/food/cupcake.png","pizza":"assets/pictures/food/pizza.png","burger":"assets/pictures/food/burger.png","sandwich":"assets/pictures/food/sandwich.png","carrot":"assets/pictures/food/carrot.png","sun":"assets/pictures/weather_garden/sun.png","cloud":"assets/pictures/weather_garden/cloud.png","rain":"assets/pictures/weather_garden/rain.png","snowflake":"assets/pictures/weather_garden/snowflake.png","rainbow":"assets/pictures/weather_garden/rainbow.png","wind":"assets/pictures/weather_garden/wind.png","thunderstorm":"assets/pictures/weather_garden/thunderstorm.png","umbrella":"assets/pictures/weather_garden/umbrella.png","fog":"assets/pictures/weather_garden/fog.png","partly cloudy":"assets/pictures/weather_garden/partly-cloudy.png","autumn leaf":"assets/pictures/weather_garden/autumn-leaf.png","snowman":"assets/pictures/weather_garden/snowman.png","tree":"assets/pictures/weather_garden/tree.png","flower":"assets/pictures/weather_garden/flower.png","grass":"assets/pictures/weather_garden/grass.png","watering can":"assets/pictures/weather_garden/watering-can.png","car":"assets/pictures/transport/car.png","bus":"assets/pictures/transport/bus.png","train":"assets/pictures/transport/train.png","airplane":"assets/pictures/transport/airplane.png","helicopter":"assets/pictures/transport/helicopter.png","bicycle":"assets/pictures/transport/bicycle.png","motorcycle":"assets/pictures/transport/motorcycle.png","sailboat":"assets/pictures/transport/sailboat.png","ship":"assets/pictures/transport/ship.png","van":"assets/pictures/transport/van.png","taxi":"assets/pictures/transport/taxi.png","fire truck":"assets/pictures/transport/fire-truck.png","ambulance":"assets/pictures/transport/ambulance.png","police car":"assets/pictures/transport/police-car.png","tractor":"assets/pictures/transport/tractor.png","scooter":"assets/pictures/transport/scooter.png","bed":"assets/pictures/home/bed.png","sofa":"assets/pictures/home/sofa.png","chair":"assets/pictures/home/chair.png","table":"assets/pictures/home/table.png","desk":"assets/pictures/home/desk.png","wardrobe":"assets/pictures/home/wardrobe.png","bookshelf":"assets/pictures/home/bookshelf.png","lamp":"assets/pictures/home/lamp.png","clock":"assets/pictures/home/clock.png","mirror":"assets/pictures/home/mirror.png","armchair":"assets/pictures/home/armchair.png","stool":"assets/pictures/home/stool.png","fridge":"assets/pictures/home/fridge.png","oven":"assets/pictures/home/oven.png","bathtub":"assets/pictures/home/bathtub.png","sink":"assets/pictures/home/sink.png","t-shirt":"assets/pictures/clothes/t-shirt.png","shirt":"assets/pictures/clothes/shirt.png","sweater":"assets/pictures/clothes/sweater.png","hoodie":"assets/pictures/clothes/hoodie.png","coat":"assets/pictures/clothes/coat.png","dress":"assets/pictures/clothes/dress.png","skirt":"assets/pictures/clothes/skirt.png","trousers":"assets/pictures/clothes/trousers.png","shorts":"assets/pictures/clothes/shorts.png","socks":"assets/pictures/clothes/socks.png","shoes":"assets/pictures/clothes/shoes.png","boots":"assets/pictures/clothes/boots.png","sandals":"assets/pictures/clothes/sandals.png","cap":"assets/pictures/clothes/cap.png","scarf":"assets/pictures/clothes/scarf.png","gloves":"assets/pictures/clothes/gloves.png","head":"assets/pictures/body/head.png","hair":"assets/pictures/body/hair.png","eye":"assets/pictures/body/eye.png","ear":"assets/pictures/body/ear.png","nose":"assets/pictures/body/nose.png","mouth":"assets/pictures/body/mouth.png","tooth":"assets/pictures/body/tooth.png","hand":"assets/pictures/body/hand.png","arm":"assets/pictures/body/arm.png","leg":"assets/pictures/body/leg.png","foot":"assets/pictures/body/foot.png","finger":"assets/pictures/body/finger.png","shoulder":"assets/pictures/body/shoulder.png","knee":"assets/pictures/body/knee.png","elbow":"assets/pictures/body/elbow.png","back":"assets/pictures/body/back.png","cat":"assets/pictures/animals/cat.png","dog":"assets/pictures/animals/dog.png","rabbit":"assets/pictures/animals/rabbit.png","hamster":"assets/pictures/animals/hamster.png","parrot":"assets/pictures/animals/parrot.png","fish":"assets/pictures/animals/fish.png","turtle":"assets/pictures/animals/turtle.png","guinea pig":"assets/pictures/animals/guinea-pig.png","cow":"assets/pictures/animals/cow.png","pig":"assets/pictures/animals/pig.png","sheep":"assets/pictures/animals/sheep.png","goat":"assets/pictures/animals/goat.png","horse":"assets/pictures/animals/horse.png","hen":"assets/pictures/animals/hen.png","duck":"assets/pictures/animals/duck.png","donkey":"assets/pictures/animals/donkey.png","lion":"assets/pictures/zoo/lion.png","tiger":"assets/pictures/zoo/tiger.png","elephant":"assets/pictures/zoo/elephant.png","giraffe":"assets/pictures/zoo/giraffe.png","zebra":"assets/pictures/zoo/zebra.png","monkey":"assets/pictures/zoo/monkey.png","panda":"assets/pictures/zoo/panda.png","bear":"assets/pictures/zoo/bear.png","wolf":"assets/pictures/zoo/wolf.png","fox":"assets/pictures/zoo/fox.png","deer":"assets/pictures/zoo/deer.png","squirrel":"assets/pictures/zoo/squirrel.png","hedgehog":"assets/pictures/zoo/hedgehog.png","owl":"assets/pictures/zoo/owl.png","crocodile":"assets/pictures/zoo/crocodile.png","hippo":"assets/pictures/zoo/hippo.png","dolphin":"assets/pictures/sea_mixed/dolphin.png","whale":"assets/pictures/sea_mixed/whale.png","shark":"assets/pictures/sea_mixed/shark.png","octopus":"assets/pictures/sea_mixed/octopus.png","crab":"assets/pictures/sea_mixed/crab.png","starfish":"assets/pictures/sea_mixed/starfish.png","penguin":"assets/pictures/sea_mixed/penguin.png","flamingo":"assets/pictures/sea_mixed/flamingo.png","teddy bear":"assets/pictures/sea_mixed/teddy-bear.png","ball":"assets/pictures/sea_mixed/ball.png","doll":"assets/pictures/sea_mixed/doll.png","toy car":"assets/pictures/sea_mixed/toy-car.png","toy train":"assets/pictures/sea_mixed/toy-train.png","kite":"assets/pictures/sea_mixed/kite.png","blocks":"assets/pictures/toys/blocks.png","robot":"assets/pictures/toys/robot.png","yo-yo":"assets/pictures/toys/yo-yo.png","peacock":"assets/pictures/birds/peacock.png","swan":"assets/pictures/birds/swan.png","chick":"assets/pictures/birds/chick.png","eagle":"assets/pictures/birds/eagle.png","toucan":"assets/pictures/birds/toucan.png","rooster":"assets/pictures/farm_extra/rooster.png","cupboard":"assets/pictures/home_extra/cupboard.png","washing machine":"assets/pictures/home_extra/washing-machine.png","read":"assets/pictures/actions/read.png","write":"assets/pictures/actions/write.png","run":"assets/pictures/actions/run.png","jump":"assets/pictures/actions/jump.png","eat":"assets/pictures/actions/eat.png","sleep":"assets/pictures/actions/sleep.png","sit":"assets/pictures/actions/sit.png","stand":"assets/pictures/actions/stand.png","clap":"assets/pictures/actions/clap.png","cup":"assets/pictures/everyday/cup.png","phone":"assets/pictures/everyday/phone.png","key":"assets/pictures/everyday/key.png","toothbrush":"assets/pictures/everyday/toothbrush.png","camera":"assets/pictures/everyday/camera.png","gift":"assets/pictures/everyday/gift.png"};
const BUILTIN_ATLASES=[{"parts":["assets/atlas_1_1.b64","assets/atlas_1_2.b64"],"src":"","width":1024,"height":768,"tile":128},{"parts":["assets/atlas_2_1.b64","assets/atlas_2_2.b64"],"src":"","width":1024,"height":768,"tile":128},{"parts":["assets/atlas_3_1.b64","assets/atlas_3_2.b64"],"src":"","width":1024,"height":768,"tile":128},{"parts":["assets/atlas_4_1.b64","assets/atlas_4_2.b64"],"src":"","width":1024,"height":640,"tile":128}];
Object.assign(BUILTIN_ALIASES,{"pencil":"pencil","карандаш":"pencil","карандаши":"pencil","pen":"pen","ручка":"pen","ручки":"pen","crayons":"crayons","crayon":"crayons","мелки":"crayons","восковые мелки":"crayons","eraser":"eraser","rubber":"eraser","ластик":"eraser","ruler":"ruler","линейка":"ruler","school bag":"school bag","schoolbag":"school bag","backpack":"school bag","bag":"school bag","рюкзак":"school bag","ранец":"school bag","портфель":"school bag","notebook":"notebook","copybook":"notebook","exercise book":"notebook","тетрадь":"notebook","scissors":"scissors","ножницы":"scissors","glue":"glue","клей":"glue","paint palette":"paint palette","palette":"paint palette","paints":"paint palette","краски":"paint palette","палитра":"paint palette","calculator":"calculator","калькулятор":"calculator","water bottle":"water bottle","bottle":"water bottle","бутылка":"water bottle","бутылка воды":"water bottle","paintbrush":"paintbrush","brush":"paintbrush","кисточка":"paintbrush","кисть":"hand","book":"book","книга":"book","marker":"marker","felt-tip pen":"marker","фломастер":"marker","маркер":"marker","sharpener":"sharpener","pencil sharpener":"sharpener","точилка":"sharpener","apple":"apple","яблоко":"apple","banana":"banana","банан":"banana","orange":"orange","апельсин":"orange","grapes":"grapes","виноград":"grapes","strawberry":"strawberry","клубника":"strawberry","watermelon":"watermelon","арбуз":"watermelon","bread":"bread","хлеб":"bread","cheese":"cheese","сыр":"cheese","milk":"milk","молоко":"milk","juice":"juice","сок":"juice","ice cream":"ice cream","ice-cream":"ice cream","icecream":"ice cream","мороженое":"ice cream","cupcake":"cupcake","кекс":"cupcake","капкейк":"cupcake","pizza":"pizza","пицца":"pizza","burger":"burger","hamburger":"burger","бургер":"burger","sandwich":"sandwich","сэндвич":"sandwich","бутерброд":"sandwich","carrot":"carrot","морковь":"carrot","sun":"sun","sunny":"sun","солнце":"sun","солнечно":"sun","cloud":"cloud","cloudy":"cloud","облако":"cloud","облачно":"cloud","rain":"rain","rainy":"rain","дождь":"rain","дождливо":"rain","snowflake":"snowflake","snow":"snowflake","snowy":"snowflake","снежинка":"snowflake","снег":"snowflake","снежно":"snowflake","rainbow":"rainbow","радуга":"rainbow","wind":"wind","windy":"wind","ветер":"wind","ветрено":"wind","thunderstorm":"thunderstorm","storm":"thunderstorm","гроза":"thunderstorm","шторм":"thunderstorm","umbrella":"umbrella","зонт":"umbrella","fog":"fog","foggy":"fog","туман":"fog","partly cloudy":"partly cloudy","partly-cloudy":"partly cloudy","переменная облачность":"partly cloudy","autumn leaf":"autumn leaf","leaf":"autumn leaf","осенний лист":"autumn leaf","лист":"autumn leaf","snowman":"snowman","снеговик":"snowman","tree":"tree","дерево":"tree","flower":"flower","цветок":"flower","grass":"grass","трава":"grass","watering can":"watering can","лейка":"watering can","car":"car","машина":"car","автомобиль":"car","bus":"bus","автобус":"bus","train":"train","поезд":"train","airplane":"airplane","plane":"airplane","самолет":"airplane","самолёт":"airplane","helicopter":"helicopter","вертолет":"helicopter","вертолёт":"helicopter","bicycle":"bicycle","bike":"bicycle","велосипед":"bicycle","motorcycle":"motorcycle","motorbike":"motorcycle","мотоцикл":"motorcycle","sailboat":"sailboat","boat":"sailboat","лодка":"sailboat","парусник":"sailboat","ship":"ship","корабль":"ship","van":"van","фургон":"van","taxi":"taxi","такси":"taxi","fire truck":"fire truck","fire engine":"fire truck","пожарная машина":"fire truck","ambulance":"ambulance","скорая":"ambulance","скорая помощь":"ambulance","police car":"police car","полицейская машина":"police car","tractor":"tractor","трактор":"tractor","scooter":"scooter","самокат":"scooter","bed":"bed","кровать":"bed","sofa":"sofa","couch":"sofa","диван":"sofa","chair":"chair","стул":"chair","table":"table","стол":"table","desk":"desk","письменный стол":"desk","парта":"desk","wardrobe":"wardrobe","closet":"wardrobe","шкаф":"wardrobe","bookshelf":"bookshelf","bookcase":"bookshelf","книжный шкаф":"bookshelf","полка":"bookshelf","lamp":"lamp","лампа":"lamp","clock":"clock","часы":"clock","mirror":"mirror","зеркало":"mirror","armchair":"armchair","кресло":"armchair","stool":"stool","табурет":"stool","fridge":"fridge","refrigerator":"fridge","холодильник":"fridge","oven":"oven","stove":"oven","плита":"oven","духовка":"oven","bathtub":"bathtub","bath":"bathtub","ванна":"bathtub","sink":"sink","раковина":"sink","t-shirt":"t-shirt","tshirt":"t-shirt","футболка":"t-shirt","shirt":"shirt","рубашка":"shirt","sweater":"sweater","jumper":"sweater","свитер":"sweater","hoodie":"hoodie","худи":"hoodie","толстовка":"hoodie","coat":"coat","пальто":"coat","dress":"dress","платье":"dress","skirt":"skirt","юбка":"skirt","trousers":"trousers","pants":"trousers","брюки":"trousers","штаны":"trousers","shorts":"shorts","шорты":"shorts","socks":"socks","носки":"socks","shoes":"shoes","shoe":"shoes","туфли":"shoes","обувь":"shoes","кроссовки":"shoes","boots":"boots","сапоги":"boots","ботинки":"boots","sandals":"sandals","сандалии":"sandals","cap":"cap","кепка":"cap","scarf":"scarf","шарф":"scarf","gloves":"gloves","перчатки":"gloves","head":"head","голова":"head","hair":"hair","волосы":"hair","eye":"eye","eyes":"eye","глаз":"eye","глаза":"eye","ear":"ear","ears":"ear","ухо":"ear","уши":"ear","nose":"nose","нос":"nose","mouth":"mouth","рот":"mouth","tooth":"tooth","teeth":"tooth","зуб":"tooth","зубы":"tooth","hand":"hand","hands":"hand","ладонь":"hand","рука":"arm","arm":"arm","arms":"arm","руки":"arm","leg":"leg","legs":"leg","нога":"leg","ноги":"leg","foot":"foot","feet":"foot","ступня":"foot","стопа":"foot","finger":"finger","fingers":"finger","палец":"finger","пальцы":"finger","shoulder":"shoulder","плечо":"shoulder","knee":"knee","колено":"knee","elbow":"elbow","локоть":"elbow","back":"back","спина":"back","cat":"cat","кошка":"cat","кот":"cat","dog":"dog","собака":"dog","пес":"dog","пёс":"dog","rabbit":"rabbit","bunny":"rabbit","кролик":"rabbit","hamster":"hamster","хомяк":"hamster","parrot":"parrot","попугай":"parrot","fish":"fish","рыба":"fish","рыбка":"fish","turtle":"turtle","черепаха":"turtle","guinea pig":"guinea pig","морская свинка":"guinea pig","cow":"cow","корова":"cow","pig":"pig","свинья":"pig","поросенок":"pig","поросёнок":"pig","sheep":"sheep","овца":"sheep","goat":"goat","коза":"goat","horse":"horse","лошадь":"horse","hen":"hen","chicken":"hen","курица":"hen","duck":"duck","утка":"duck","donkey":"donkey","осел":"donkey","осёл":"donkey","lion":"lion","лев":"lion","tiger":"tiger","тигр":"tiger","elephant":"elephant","слон":"elephant","giraffe":"giraffe","жираф":"giraffe","zebra":"zebra","зебра":"zebra","monkey":"monkey","обезьяна":"monkey","panda":"panda","панда":"panda","bear":"bear","медведь":"bear","wolf":"wolf","волк":"wolf","fox":"fox","лиса":"fox","deer":"deer","олень":"deer","squirrel":"squirrel","белка":"squirrel","hedgehog":"hedgehog","ёж":"hedgehog","еж":"hedgehog","owl":"owl","сова":"owl","crocodile":"crocodile","крокодил":"crocodile","hippo":"hippo","hippopotamus":"hippo","бегемот":"hippo","dolphin":"dolphin","дельфин":"dolphin","whale":"whale","кит":"whale","shark":"shark","акула":"shark","octopus":"octopus","осьминог":"octopus","crab":"crab","краб":"crab","sea turtle":"sea turtle","морская черепаха":"sea turtle","seahorse":"seahorse","морской конек":"seahorse","морской конёк":"seahorse","starfish":"starfish","морская звезда":"starfish","penguin":"penguin","пингвин":"penguin","flamingo":"flamingo","фламинго":"flamingo","peacock":"peacock","павлин":"peacock","swan":"swan","лебедь":"swan","chick":"chick","цыпленок":"chick","цыплёнок":"chick","eagle":"eagle","орел":"eagle","орёл":"eagle","toucan":"toucan","тукан":"toucan","teddy bear":"teddy bear","teddy":"teddy bear","мишка":"teddy bear","плюшевый мишка":"teddy bear","ball":"ball","мяч":"ball","doll":"doll","кукла":"doll","toy car":"toy car","машинка":"toy car","игрушечная машина":"toy car","toy train":"toy train","игрушечный поезд":"toy train","kite":"kite","воздушный змей":"kite"});

const BUILTIN_ART={
'dog':`<g stroke="#26345f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="120" cy="104" rx="35" ry="50" fill="#b97843"/><ellipse cx="240" cy="104" rx="35" ry="50" fill="#b97843"/><circle cx="180" cy="137" r="82" fill="#e7a563"/><ellipse cx="180" cy="175" rx="48" ry="38" fill="#fff0d3"/><circle cx="151" cy="132" r="7" fill="#26345f"/><circle cx="209" cy="132" r="7" fill="#26345f"/><ellipse cx="180" cy="166" rx="13" ry="10" fill="#26345f"/><path d="M165 188 Q180 202 195 188" fill="none"/><path d="M176 194 Q180 220 195 196" fill="#ff7189"/></g>`,
'cat':`<g stroke="#26345f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M112 98 L125 42 L161 79" fill="#f5a657"/><path d="M248 98 L235 42 L199 79" fill="#f5a657"/><circle cx="180" cy="142" r="83" fill="#ffc46e"/><path d="M145 123 Q155 115 165 123" fill="none"/><path d="M195 123 Q205 115 215 123" fill="none"/><circle cx="155" cy="129" r="6" fill="#26345f"/><circle cx="205" cy="129" r="6" fill="#26345f"/><path d="M172 158 L188 158 L180 168 Z" fill="#f07b8d"/><path d="M180 168 Q165 181 152 174 M180 168 Q195 181 208 174" fill="none"/><path d="M132 158 L76 149 M132 170 L75 176 M228 158 L284 149 M228 170 L285 176" fill="none"/></g>`,
'rabbit':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><ellipse cx="145" cy="73" rx="25" ry="65" fill="#f7e7f5"/><ellipse cx="215" cy="73" rx="25" ry="65" fill="#f7e7f5"/><ellipse cx="145" cy="72" rx="10" ry="43" fill="#f5a9c7" stroke="none"/><ellipse cx="215" cy="72" rx="10" ry="43" fill="#f5a9c7" stroke="none"/><circle cx="180" cy="158" r="78" fill="#fff8ff"/><circle cx="153" cy="143" r="7" fill="#26345f"/><circle cx="207" cy="143" r="7" fill="#26345f"/><path d="M172 163 L188 163 L180 174 Z" fill="#f08faf"/><path d="M180 174 Q164 186 152 179 M180 174 Q196 186 208 179" fill="none"/><path d="M180 178 L180 198 M164 195 L196 195" fill="none"/></g>`,
'fish':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M96 145 L42 98 L42 192 Z" fill="#6fd4ff"/><ellipse cx="190" cy="145" rx="103" ry="70" fill="#4bc3ff"/><path d="M190 78 Q222 40 248 83" fill="#87e2ff"/><path d="M187 210 Q219 244 247 205" fill="#87e2ff"/><circle cx="239" cy="128" r="8" fill="#26345f"/><path d="M260 151 Q279 161 290 147" fill="none"/><path d="M120 118 Q151 144 120 171" fill="#ffd85d"/></g>`,
'bird':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="180" cy="145" rx="88" ry="72" fill="#61d3c8"/><circle cx="215" cy="118" r="50" fill="#75e1d6"/><path d="M258 119 L305 138 L258 148 Z" fill="#ffbf3e"/><circle cx="229" cy="108" r="7" fill="#26345f"/><path d="M135 136 Q178 100 194 160 Q155 176 135 136" fill="#2fa8d8"/><path d="M128 208 L118 238 M218 208 L229 238 M104 238 L132 238 M216 238 L242 238" fill="none"/></g>`,
'frog':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><circle cx="135" cy="104" r="34" fill="#76d95b"/><circle cx="225" cy="104" r="34" fill="#76d95b"/><ellipse cx="180" cy="158" rx="92" ry="73" fill="#75de62"/><circle cx="135" cy="101" r="8" fill="#26345f"/><circle cx="225" cy="101" r="8" fill="#26345f"/><path d="M142 175 Q180 205 218 175" fill="none"/><ellipse cx="180" cy="188" rx="26" ry="15" fill="#ff7f9d" stroke="none"/></g>`,
'apple':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M180 84 Q170 44 191 26" fill="none"/><path d="M190 60 Q231 34 249 65 Q214 86 190 60" fill="#6dcc61"/><path d="M179 85 C126 55 77 99 93 164 C107 225 157 246 180 222 C203 246 253 225 267 164 C283 99 234 55 181 85 Z" fill="#ff5d62"/><path d="M130 110 Q149 87 168 98" fill="none" stroke="#ff9296" stroke-width="10"/></g>`,
'banana':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"><path d="M83 94 Q124 206 252 190 Q286 185 301 142 Q241 178 196 144 Q150 110 123 64 Q106 79 83 94 Z" fill="#ffd94f"/><path d="M121 66 L105 47 M300 142 L312 124" fill="none"/><path d="M111 105 Q157 185 250 177" fill="none" stroke="#ffeb82" stroke-width="11"/></g>`,
'orange':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><circle cx="180" cy="151" r="94" fill="#ff9f32"/><path d="M176 61 Q162 29 181 22" fill="none"/><path d="M183 61 Q221 28 246 54 Q215 83 183 61" fill="#64c95d"/><path d="M128 105 Q151 80 172 91" fill="none" stroke="#ffc46a" stroke-width="10"/></g>`,
'carrot':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"><path d="M151 82 Q177 49 200 85 L185 123 Z" fill="#58c764"/><path d="M183 85 Q211 43 232 75 L203 125 Z" fill="#64d66d"/><path d="M136 100 Q180 76 224 102 Q211 185 177 236 Q142 182 136 100 Z" fill="#ff8c3e"/><path d="M157 130 L192 123 M154 158 L187 152 M164 187 L185 181" fill="none" stroke="#e66d25"/></g>`,
'pizza':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M78 72 Q180 30 282 72 L181 235 Z" fill="#ffd45f"/><path d="M78 72 Q180 30 282 72" fill="none" stroke="#d58c3d" stroke-width="26"/><circle cx="159" cy="117" r="19" fill="#f15058"/><circle cx="215" cy="105" r="16" fill="#f15058"/><circle cx="192" cy="160" r="17" fill="#f15058"/><circle cx="137" cy="154" r="12" fill="#60be5a"/><circle cx="229" cy="145" r="12" fill="#60be5a"/></g>`,
'ice cream':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M132 126 L228 126 L184 244 Z" fill="#d99a55"/><path d="M145 146 L210 211 M215 147 L157 211" fill="none" stroke="#b97738" stroke-width="5"/><circle cx="142" cy="111" r="45" fill="#ff8fbd"/><circle cx="184" cy="93" r="51" fill="#ffd75f"/><circle cx="221" cy="116" r="42" fill="#76d7b3"/><path d="M168 67 Q181 48 195 66" fill="none" stroke="#fff1b7" stroke-width="9"/></g>`,
'milk':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M115 70 L205 70 L247 111 L247 230 L115 230 Z" fill="#f7fbff"/><path d="M205 70 L205 111 L247 111" fill="#d8ecff"/><path d="M115 70 L143 38 L216 38 L205 70" fill="#b5e2ff"/><rect x="133" y="132" width="96" height="66" rx="18" fill="#70cfff"/><path d="M151 164 Q180 135 211 164 Q181 192 151 164" fill="#fff" stroke="none"/></g>`,
'book':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M58 70 Q118 48 178 83 L178 226 Q118 192 58 210 Z" fill="#6ca9ff"/><path d="M302 70 Q242 48 182 83 L182 226 Q242 192 302 210 Z" fill="#ff7c9b"/><path d="M180 83 L180 225" fill="none"/><path d="M83 103 Q124 91 154 106 M207 106 Q244 91 278 104 M83 134 Q124 122 154 137 M207 137 Q244 122 278 135" fill="none" stroke="#fff" stroke-width="6"/></g>`,
'pencil':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M69 205 L229 45 L277 93 L117 253 L56 266 Z" fill="#ffd04f"/><path d="M229 45 L247 27 Q259 15 271 27 L295 51 Q307 63 295 75 L277 93 Z" fill="#ff7899"/><path d="M56 266 L69 205 L117 253 Z" fill="#e9c69e"/><path d="M58 265 L80 241 L92 253 Z" fill="#26345f"/><path d="M92 181 L139 228" fill="none" stroke="#f1aa2c" stroke-width="8"/></g>`,
'ruler':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><rect x="51" y="105" width="258" height="82" rx="18" fill="#ffd55c"/><path d="M79 107 V139 M104 107 V126 M129 107 V139 M154 107 V126 M179 107 V139 M204 107 V126 M229 107 V139 M254 107 V126 M279 107 V139" fill="none"/></g>`,
'eraser':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M89 184 L178 83 Q190 70 205 81 L278 144 Q291 155 278 170 L198 258 Z" fill="#ff7ea2"/><path d="M198 258 L133 203 L184 145 L249 201 Z" fill="#72c6ff"/><path d="M89 184 L133 203 L198 258 L154 243 Z" fill="#f0d4d9"/></g>`,
'school bag':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M130 87 Q130 48 180 48 Q230 48 230 87" fill="none"/><rect x="86" y="80" width="188" height="159" rx="36" fill="#6f79f3"/><rect x="110" y="137" width="140" height="75" rx="22" fill="#8d94ff"/><path d="M86 130 L64 161 L64 211 M274 130 L296 161 L296 211" fill="none"/><circle cx="180" cy="173" r="12" fill="#ffd85e"/></g>`,
'scissors':`<g stroke="#26345f" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><circle cx="113" cy="197" r="42" fill="#ff7694"/><circle cx="198" cy="213" r="42" fill="#73c8ff"/><circle cx="113" cy="197" r="18" fill="#fff"/><circle cx="198" cy="213" r="18" fill="#fff"/><path d="M143 171 L274 66 M161 184 L301 148" fill="none"/><path d="M274 66 L315 45 L298 89 Z M301 148 L330 160 L297 178 Z" fill="#dce8f2"/></g>`,
'sun':`<g stroke="#26345f" stroke-width="7" stroke-linecap="round"><circle cx="180" cy="145" r="66" fill="#ffd44f"/><path d="M180 38 V65 M180 225 V252 M73 145 H100 M260 145 H287 M104 69 L123 88 M237 202 L256 221 M104 221 L123 202 M237 88 L256 69" fill="none"/><path d="M150 141 Q180 169 210 141" fill="none"/><circle cx="155" cy="127" r="6" fill="#26345f"/><circle cx="205" cy="127" r="6" fill="#26345f"/></g>`,
'cloud':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M86 193 Q53 192 53 158 Q53 125 91 122 Q102 78 148 83 Q170 45 212 72 Q246 66 264 99 Q303 104 303 145 Q303 189 260 193 Z" fill="#edf7ff"/><path d="M113 137 Q128 126 143 137 M218 137 Q233 126 248 137" fill="none"/></g>`,
'rainbow':`<g fill="none" stroke-linecap="round"><path d="M74 220 A106 106 0 0 1 286 220" stroke="#ff5d69" stroke-width="28"/><path d="M98 220 A82 82 0 0 1 262 220" stroke="#ffb743" stroke-width="25"/><path d="M121 220 A59 59 0 0 1 239 220" stroke="#62d26f" stroke-width="23"/><path d="M143 220 A37 37 0 0 1 217 220" stroke="#5bbef5" stroke-width="22"/></g>`,
'tree':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><rect x="159" y="151" width="44" height="93" rx="12" fill="#a86a3d"/><circle cx="139" cy="119" r="54" fill="#69ce62"/><circle cx="203" cy="107" r="60" fill="#56c85d"/><circle cx="225" cy="151" r="50" fill="#73d86b"/><circle cx="116" cy="158" r="48" fill="#7add70"/></g>`,
'flower':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M180 164 V246 M180 209 Q142 185 121 207 M180 222 Q219 196 239 218" fill="none" stroke="#48ad55" stroke-width="10"/><ellipse cx="180" cy="111" rx="34" ry="61" fill="#ff7daf"/><ellipse cx="180" cy="111" rx="34" ry="61" fill="#ff7daf" transform="rotate(60 180 111)"/><ellipse cx="180" cy="111" rx="34" ry="61" fill="#ff7daf" transform="rotate(120 180 111)"/><circle cx="180" cy="111" r="32" fill="#ffd94e"/></g>`,
'ball':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><circle cx="180" cy="145" r="100" fill="#fff"/><path d="M180 72 L214 96 L201 136 L159 136 L146 96 Z" fill="#26345f"/><path d="M214 96 L257 82 M201 136 L230 175 M159 136 L130 175 M146 96 L103 82 M230 175 L220 220 M130 175 L140 220" fill="none"/></g>`,
'car':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M66 174 L85 120 Q92 99 114 96 L233 96 Q254 99 265 118 L294 174 L294 211 L66 211 Z" fill="#ff646c"/><path d="M121 100 L145 65 L216 65 L240 100" fill="#a9e4ff"/><circle cx="115" cy="211" r="28" fill="#38445f"/><circle cx="250" cy="211" r="28" fill="#38445f"/><circle cx="115" cy="211" r="11" fill="#e7eef4"/><circle cx="250" cy="211" r="11" fill="#e7eef4"/><rect x="86" y="151" width="39" height="18" rx="8" fill="#ffe57e"/><rect x="248" y="151" width="29" height="18" rx="8" fill="#ffe57e"/></g>`,
'house':`<g stroke="#26345f" stroke-width="7" stroke-linejoin="round"><path d="M62 136 L180 46 L298 136" fill="#ff7a75"/><path d="M87 126 V242 H273 V126 L180 62 Z" fill="#ffe4a3"/><rect x="154" y="165" width="54" height="77" rx="8" fill="#73b7e7"/><rect x="103" y="153" width="42" height="42" rx="6" fill="#9dd9ff"/><rect x="220" y="153" width="42" height="42" rx="6" fill="#9dd9ff"/></g>`
};
function artFrame(inner,key){const palettes=[['#e8f8ff','#d6ecff','#fff6cf'],['#fff1f4','#ffe3eb','#e8f7ff'],['#f1edff','#e6ddff','#fff4ce'],['#ecfff2','#dff7ea','#fff0cb']];let sum=0;for(const ch of key)sum+=ch.charCodeAt(0);const p=palettes[sum%palettes.length];return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p[0]}"/><stop offset=".58" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/></linearGradient><filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#39466f" flood-opacity=".15"/></filter></defs><rect width="360" height="280" rx="34" fill="url(#bg)"/><circle cx="302" cy="48" r="24" fill="#fff" opacity=".45"/><circle cx="55" cy="225" r="34" fill="#fff" opacity=".32"/><g filter="url(#sh)">${inner}</g></svg>`;}
async function loadBuiltinAtlases(){await Promise.all(BUILTIN_ATLASES.map(async a=>{if(a.src)return;const parts=await Promise.all(a.parts.map(p=>fetch(p,{cache:'force-cache'}).then(r=>r.text())));a.src='data:image/webp;base64,'+parts.join('');}));}
function isBuiltinSrc(src){return typeof src==='string'&&src.startsWith('builtin:');}
function builtinKeyFromSrc(src){return isBuiltinSrc(src)?src.slice(8):'';}
function clearBuiltinSprite(el){if(!el)return;el.style.backgroundImage='';el.style.backgroundSize='';el.style.backgroundPosition='';el.style.backgroundRepeat='';el.style.backgroundColor='';delete el.dataset.builtinKey;}
function applyBuiltinSprite(el,key){if(!el||!BUILTIN_RECTS[key])return;const [ai,x,y,w,h]=BUILTIN_RECTS[key],atlas=BUILTIN_ATLASES[ai];el.dataset.builtinKey=key;el.style.backgroundImage=`url("${atlas.src}")`;el.style.backgroundRepeat='no-repeat';el.style.backgroundColor='#fff';const r=el.getBoundingClientRect();const box=Math.max(1,Math.min(r.width||w,r.height||h));const scale=box/w;el.style.backgroundSize=`${atlas.width*scale}px ${atlas.height*scale}px`;el.style.backgroundPosition=`${((r.width||box)-box)/2-x*scale}px ${((r.height||box)-box)/2-y*scale}px`;}
function makeBuiltinSprite(key,className='builtin-sprite'){const el=document.createElement('div');el.className=className;requestAnimationFrame(()=>applyBuiltinSprite(el,key));return el;}
function builtinPictureForWord(word){let key=String(word||'').trim().toLowerCase().replace(/\s+/g,' ');key=BUILTIN_ALIASES[key]||key;return BUILTIN_LOCAL[key]||'';}
function builtinResultItem(word){const src=builtinPictureForWord(word);if(!src)return null;return {title:`SHKOALA picture for ${word}`,creator:'SHKOALA',thumb:src,url:src,fullUrl:src,width:360,height:280,source:'builtin',isBuiltin:true};}
function fillBuiltinPictures(){let added=0;document.querySelectorAll('.image-row').forEach(row=>{const src=builtinPictureForWord(row.word);if(src){row.setImage(src);added++;}});setStatus(added?`Added ${added} bright built-in pictures. No web search needed for them.`:'No matching words in the built-in RU/EN picture pack yet.');saveState();}

function makeCoinCursor(size,circleR,fontSize,hotspot){
  const center=size/2;
  const inner=Math.max(8,circleR-6);
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><defs><radialGradient id='g' cx='35%' cy='35%'><stop offset='0' stop-color='#fff7bf'/><stop offset='0.55' stop-color='#ffd24d'/><stop offset='1' stop-color='#ca9418'/></radialGradient></defs><circle cx='${center}' cy='${center}' r='${circleR}' fill='url(#g)' stroke='#a36c00' stroke-width='4'/><circle cx='${center}' cy='${center}' r='${inner}' fill='none' stroke='rgba(255,255,255,.45)' stroke-width='2'/><text x='${center}' y='${center+fontSize*.34}' text-anchor='middle' font-size='${fontSize}' font-family='Arial' font-weight='700' fill='#8f5a00'>₵</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${hotspot} ${hotspot}, auto`;
}
const COIN_CURSOR_LARGE=makeCoinCursor(78,28,26,39);
const COIN_CURSOR_SMALL=makeCoinCursor(52,18,17,26);
const COIN_CURSOR_TINY=makeCoinCursor(38,13,13,19);


let cards=[],deck=[],current=null,usedCount=0,revealedEnough=false,mode='word',audioContext=null,lastScratchAt=0,confettiParticles=[],confettiAnimating=false,modalRowTarget=null,scratchRects=[],scratchDpr=1,lastScratchPoint=null,activeScratchLayers=[],modalPage=1,modalWord='',modalBaseQueries=[],modalQueryIndex=0,displayMode='teacher',teamAScore=0,teamBScore=0,scoreboardVisible=false,introEnabled=true,introPendingAction=null,introTimer=null,scratchCoinSize='large',uiLanguage='ru';
const STATIC_RU={
  'Scratch & Speak — Lottery Game':'Сотри защитный слой — Лотерея',
  'Scratch & Speak · Lottery Edition':'Сотри защитный слой · Лотерейная версия',
  'Scratch ticket game':'Лотерея со стираемыми билетами',
  'A bright lottery-style classroom game with a built-in picture pack, optional Cole intro, scratch sound, two-team scoreboard, full-screen class view and confetti.':'Яркая лотерейная игра для урока: встроенные картинки, интро с Коулом, звук стирания, счёт для двух команд, режим для класса и конфетти.',
  '⛶ Full screen':'⛶ На весь экран',
  'Classroom jackpot':'Джекпот на уроке',
  'Build a branded lottery game with even more wow':'Создайте свою лотерею для урока',
  'Type your own words, choose a picture mode, add pictures, and run a scratch-ticket reveal with sound, confetti and a playful lottery atmosphere.':'Добавьте свои слова, выберите режим, вставьте картинки — и запускайте лотерею со стиранием, звуком и конфетти.',
  'More classroom ideas in our VK group':'Больше идей для уроков — в нашей группе ВК',
  'Click the logo or scan the QR code.':'Нажмите на логотип или отсканируйте QR-код.',
  'Your words':'Ваши слова',
  'Demo list':'Пример',
  'Import .txt / .csv':'Импорт .txt / .csv',
  'One line = one ticket. Type your own list or import a file.':'Одна строка = один билет. Введите свой список или импортируйте файл.',
  'Remove duplicates':'Убрать повторы',
  'Sort A–Z':'По алфавиту',
  'Clear list':'Очистить список',
  'Mode':'Режим',
  'Word':'Слово',
  'One big scratch field with a stretched word':'Одно большое поле со словом',
  'Picture + word':'Картинка + слово',
  'Ticket with two scratch fields':'Два поля для стирания',
  'Picture only':'Только картинка',
  'One large picture field · no word':'Одно большое поле с картинкой · без слова',
  'Random order':'Случайный порядок',
  'No repeats until the list ends.':'Без повторов, пока не закончится список.',
  'Ready-made categories':'Готовые темы',
  'Quick classroom sets. Click any category to replace the current word list.':'Готовые наборы. Нажмите на тему, чтобы заменить текущий список слов.',
  'Pets':'Домашние питомцы',
  'Farm animals':'Ферма',
  'Zoo animals':'Зоопарк',
  'Sea animals':'Морские животные',
  'Food':'Еда',
  'School things':'Школьные принадлежности',
  'Weather':'Погода',
  'Garden':'Сад',
  'Transport':'Транспорт',
  'Home & furniture':'Дом и мебель',
  'Clothes':'Одежда',
  'Body parts':'Части тела',
  'Birds':'Птицы',
  'Toys':'Игрушки',
  'Actions':'Действия',
  'Everyday things':'Повседневные предметы',
  'Pictures for picture modes':'Картинки для режимов с изображениями',
  'Choose a row to replace its picture. Copy/paste with Ctrl+V still works.':'Выберите строку, чтобы заменить картинку. Вставка через Ctrl+V тоже работает.',
  'Illustration':'Рисунок',
  'Photo':'Фото',
  'Any':'Любое',
  'Use our pictures':'Наши картинки',
  'Clear all images':'Очистить все картинки',
  'Our pictures first. For another picture: Yandex → copy → return here → Ctrl+V.':'Сначала наши картинки. Для другой: Яндекс → копировать → вернуться сюда → Ctrl+V.',
  'Add your words first, then click':'Сначала добавьте слова, затем нажмите',
  'Refresh picture list':'Обновить список картинок',
  '＋ Add word':'＋ Добавить',
  '🗑 Delete selected':'🗑 Удалить выбранные',
  '✨ Start lottery':'✨ Начать игру',
  '▶ Preview Cole intro':'▶ Посмотреть интро',
  'Scratch the lottery ticket':'Сотрите защитный слой',
  'Teacher mode':'Режим учителя',
  'Kids mode':'Режим для детей',
  '⛶ Class view':'⛶ Для класса',
  'Scoreboard':'Счёт',
  '← Settings':'← Настройки',
  '↺ Restart':'↺ Сначала',
  'Team scoreboard':'Счёт команд',
  'Reset':'Сбросить',
  'Hide':'Скрыть',
  'Lucky Reveal':'Сотри и открой',
  'Scratch & Speak':'Сотри защитный слой',
  'WIN!':'ПРИЗ!',
  'Show word':'Показать слово',
  'Scratch to reveal':'Сотрите, чтобы открыть',
  'Classroom edition':'Для урока',
  'Coin':'Монета',
  'Reveal all':'Открыть всё',
  'Next ticket':'Следующий билет',
  'All tickets are finished!':'Все билеты закончились!',
  'Play again with the same words?':'Сыграть ещё раз с теми же словами?',
  'Play again?':'Играть снова',
  'Settings':'Настройки',
  'Skip':'Пропустить',
  'Lucky Scratch Ticket':'Счастливый билет',
  'Ready?':'Готовы?',
  'classroom edition':'для урока',
  'Let’s play!':'Играем!',
  'The ticket opens and becomes the game':'Билет открывается — и начинается игра',
  'Cole spins the lottery drum, pulls out a ticket and opens the game.':'Коул крутит барабан, вытягивает билет и запускает игру.',
  'Picture picker':'Выбор картинки',
  'Find a picture':'Найти картинку',
  'Search':'Найти',
  'More results':'Ещё результаты',
  'Loading pictures...':'Загружаем картинки...',
  'Edit picture':'Редактирование картинки',
  'Crop picture':'Обрезать картинку',
  'Drag the picture. Use the slider to zoom.':'Перетаскивайте картинку. Масштаб меняется ползунком.',
  'Fit':'Вместить',
  'Cancel':'Отмена',
  '✂ Use crop':'✂ Сохранить обрезку'
};
const ATTR_RU={
  'Add a word… or leave blank for picture only':'Добавьте слово… или оставьте пустым для картинки',
  'Search term':'Что ищем?',
  'Tiny coin · finest scratch':'Самая маленькая монета · очень тонкое стирание',
  'Small coin · thinner scratch':'Маленькая монета · тонкое стирание',
  'Large coin · wider scratch':'Большая монета · широкое стирание',
  'Tiny coin':'Самая маленькая монета',
  'Small coin':'Маленькая монета',
  'Large coin':'Большая монета',
  'Scratch coin size':'Размер монеты'
};
const originalTextNodes=new WeakMap();
const originalAttrs=new WeakMap();

function uiText(en,ru){return uiLanguage==='ru'?ru:en;}
function categoryRu(name){
  return ({pets:'Домашние питомцы',farm:'Ферма',zoo:'Зоопарк',sea:'Морские животные',food:'Еда',school:'Школьные принадлежности',weather:'Погода',garden:'Сад',transport:'Транспорт',home:'Дом и мебель',clothes:'Одежда',body:'Части тела',birds:'Птицы',toys:'Игрушки',actions:'Действия',everyday:'Повседневные предметы'})[name]||name;
}
function translateDynamic(message){
  const m=String(message??'');
  if(uiLanguage!=='ru')return m;
  const exact={
    'That word is already in the list.':'Это слово уже есть в списке.',
    'List normalized.':'Список обновлён.',
    'Duplicate words removed.':'Повторы удалены.',
    'Word list sorted A–Z.':'Список отсортирован по алфавиту.',
    'Word list cleared.':'Список слов очищен.',
    'All images cleared.':'Все картинки удалены.',
    'Yandex opened. Copy the picture, return here and press Ctrl+V.':'Яндекс открыт. Скопируйте картинку, вернитесь сюда и нажмите Ctrl+V.',
    'Yandex window closed. Paste the copied picture with Ctrl+V.':'Окно Яндекса закрыто. Вставьте скопированную картинку через Ctrl+V.',
    'Could not open this picture for cropping.':'Не удалось открыть эту картинку для обрезки.',
    'This remote picture cannot be cropped directly. Copy the image itself and paste it with Ctrl+V, then crop it.':'Эту картинку нельзя обрезать напрямую. Скопируйте само изображение, вставьте его через Ctrl+V и затем обрежьте.',
    'Add words first.':'Сначала добавьте слова.',
    'Blank picture row added. Paste with Ctrl+V or use Upload.':'Добавлена пустая строка для картинки. Вставьте через Ctrl+V или нажмите «Загрузить».',
    'Select one or more rows with the checkboxes first.':'Сначала отметьте одну или несколько строк.',
    'Type a word first to search Yandex, or paste/upload a picture directly.':'Сначала введите слово для поиска в Яндексе или сразу вставьте/загрузите картинку.',
    'Picture uploaded.':'Картинка загружена.',
    'No matching words in the built-in RU/EN picture pack yet.':'Для этих слов пока нет подходящих картинок в нашей базе.'
  };
  if(exact[m])return exact[m];
  let x=m;
  x=x.replace(/^Loaded ready solution: ([^.]+)\. Built-in pictures are filled first in picture modes\.$/,(_,n)=>'Загружена тема «'+categoryRu(n)+'». В режимах с картинками сначала подставляется наша база.');
  x=x.replace(/^Added (\d+) bright built-in pictures\. No web search needed for them\.$/,'Добавлено картинок из нашей базы: $1.');
  x=x.replace(/^Added “(.+)”\.$/,'Добавлено: «$1».');
  x=x.replace(/^Added (\d+) words\.$/,'Добавлено слов: $1.');
  x=x.replace(/^Cropped picture saved for “(.+)”\.$/,'Обрезанная картинка сохранена для «$1».');
  x=x.replace(/^Yandex opened for “(.+)”\. Copy the image, (?:come back|return) here and press Ctrl\+V\.$/,'Яндекс открыт для «$1». Скопируйте картинку, вернитесь сюда и нажмите Ctrl+V.');
  x=x.replace(/^Picture pasted for “(.+)”\.$/,'Картинка вставлена для «$1».');
  x=x.replace(/^Picture URL pasted for “(.+)”\.$/,'Ссылка на картинку вставлена для «$1».');
  x=x.replace(/^Deleted “(.+)”\.$/,'Удалено: «$1».');
  x=x.replace(/^Deleted blank picture row\.$/,'Пустая строка с картинкой удалена.');
  x=x.replace(/^Deleted (\d+) selected rows?\.$/,'Удалено выбранных строк: $1.');
  x=x.replace(/^Our picture added for “(.+)”\.$/,'Наша картинка добавлена для «$1».');
  x=x.replace(/^Picture uploaded for “(.+)”\.$/,'Картинка загружена для «$1».');
  x=x.replace(/^Searching picture for (.+)\.\.\.$/,'Ищем картинку для «$1»...');
  x=x.replace(/^Search first to load more pictures for (.+)\.$/,'Сначала выполните поиск картинок для «$1».');
  x=x.replace(/^Showing another picture for (.+)\.$/,'Показана другая картинка для «$1».');
  x=x.replace(/^Inserted our built-in picture for (.+)\.$/,'Наша картинка вставлена для «$1».');
  x=x.replace(/^Picture inserted for (.+)\.$/,'Картинка вставлена для «$1».');
  return x;
}
let lastStatusMessage='';
function setStatus(message){lastStatusMessage=String(message??'');searchStatus.textContent=translateDynamic(lastStatusMessage);}

function translateStaticDom(){
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    if(!originalTextNodes.has(node))originalTextNodes.set(node,node.nodeValue);
    const original=originalTextNodes.get(node);
    const trimmed=original.trim();
    if(!trimmed)return;
    const translated=STATIC_RU[trimmed];
    if(!translated)return;
    const lead=original.match(/^\s*/)?.[0]||'';
    const tail=original.match(/\s*$/)?.[0]||'';
    node.nodeValue=lead+(uiLanguage==='ru'?translated:trimmed)+tail;
  });

  document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
    let saved=originalAttrs.get(el);
    if(!saved){
      saved={};
      for(const attr of ['placeholder','title','aria-label']){
        if(el.hasAttribute(attr))saved[attr]=el.getAttribute(attr);
      }
      originalAttrs.set(el,saved);
    }
    for(const [attr,original] of Object.entries(saved)){
      el.setAttribute(attr,uiLanguage==='ru'?(ATTR_RU[original]||original):original);
    }
  });
}

function updateProgressLanguage(){
  if(cards.length&&usedCount)progressTitle.textContent=uiText(`Ticket ${usedCount} / ${cards.length}`,`Билет ${usedCount} / ${cards.length}`);
  else progressTitle.textContent=uiText('Ticket 1 / 1','Билет 1 / 1');
}
function refreshDynamicLanguage(){
  document.querySelectorAll('.image-row').forEach(row=>{
    const wordInput=row.querySelector('.image-word-input');
    if(wordInput)wordInput.placeholder=uiText('Optional word','Слово (необязательно)');
    const selectWrap=row.querySelector('.row-select-wrap');
    if(selectWrap)selectWrap.title=uiText('Select for bulk delete','Выбрать для удаления');
    const local=row.querySelector('.our-pic-btn');
    if(local)local.textContent=uiText('Our picture','Наша картинка');
    const upload=row.querySelector('.upload-pic-btn');
    if(upload)upload.textContent=uiText('Upload','Загрузить');
    const del=row.querySelector('.icon-delete-btn');
    if(del)del.title=uiText('Delete row','Удалить строку');
    const preview=row.querySelector('.image-preview');
    if(preview&&!preview.dataset.src)preview.textContent=uiText('No image','Нет картинки');
  });
  if(!document.querySelector('.image-row')&&imageRows?.querySelector('p')){
    imageRows.querySelector('p').textContent=uiText('Add your words below.','Добавьте слова или картинки ниже.');
  }
  if(lastStatusMessage)searchStatus.textContent=translateDynamic(lastStatusMessage);
}

function applyLanguage(shouldSave=true){
  document.documentElement.lang=uiLanguage==='ru'?'ru':'en';
  document.title=uiText('Scratch & Speak — Lottery Game','Сотри защитный слой — Лотерея');
  langRuBtn?.classList.toggle('active',uiLanguage==='ru');
  langEnBtn?.classList.toggle('active',uiLanguage==='en');
  translateStaticDom();
  refreshDynamicLanguage();
  updateIntroToggle(false);
  updateScoreboard(false);
  updateProgressLanguage();
  const defaultA=teamAName?.value;
  const defaultB=teamBName?.value;
  if(defaultA==='Team 1'||defaultA==='Команда 1')teamAName.value=uiText('Team 1','Команда 1');
  if(defaultB==='Team 2'||defaultB==='Команда 2')teamBName.value=uiText('Team 2','Команда 2');
  if(modalWord&&!modal.classList.contains('hidden'))modalTitle.textContent=uiText(`Choose a picture for “${modalWord}”`,`Выберите картинку для «${modalWord}»`);
  if(activeScratchLayers.length)requestAnimationFrame(()=>prepareScratchSurface());
  if(shouldSave)saveState();
}
function setUiLanguage(lang){
  uiLanguage=lang==='en'?'en':'ru';
  applyLanguage();
}

const searchCache=new Map();
const rowResultCaches=new Map();
const rowResultIndices=new Map();

function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify({wordsText:wordsInput.value,mode:getMode(),shuffle:shuffleToggle.checked,imageStyle:imageStyleSelect.value,images:gatherImageState(),displayMode,teamAScore,teamBScore,teamAName:teamAName?.value||'Team 1',teamBName:teamBName?.value||'Team 2',scoreboardVisible,introEnabled,scratchCoinSize,uiLanguage}));}
function loadState(){const raw=localStorage.getItem(STORAGE_KEY);if(!raw){wordsInput.value=demoWords.join('\n');buildImageRows([]);updateIntroToggle(false);return;}try{const data=JSON.parse(raw);wordsInput.value=data.wordsText||demoWords.join('\n');if(data.mode){const input=document.querySelector(`input[name="mode"][value="${data.mode}"]`);if(input)input.checked=true;}shuffleToggle.checked=data.shuffle??true;imageStyleSelect.value=data.imageStyle||'illustration';displayMode=data.displayMode||'teacher';teamAScore=Number.isFinite(Number(data.teamAScore))?Number(data.teamAScore):0;teamBScore=Number.isFinite(Number(data.teamBScore))?Number(data.teamBScore):0;teamAName.value=data.teamAName||'Team 1';teamBName.value=data.teamBName||'Team 2';scoreboardVisible=!!data.scoreboardVisible;introEnabled=data.introEnabled!==false;scratchCoinSize=['tiny','small','large'].includes(data.scratchCoinSize)?data.scratchCoinSize:'large';uiLanguage=data.uiLanguage==='en'?'en':'ru';updateCoinSizeUI(false);refreshModeStyles();applyDisplayMode(displayMode,false);updateScoreboard(false);updateIntroToggle(false);buildImageRows(data.images||[]);}catch{wordsInput.value=demoWords.join('\n');buildImageRows([]);updateScoreboard(false);updateIntroToggle(false);}}
function refreshModeStyles(){document.querySelectorAll('.mode-option').forEach(el=>{const input=el.querySelector('input');el.classList.toggle('selected',input.checked);});}
function getMode(){return document.querySelector('input[name="mode"]:checked')?.value||'word';}
function parseWordsFromText(text){return text.split(/\r?\n|,|;/).map(v=>v.trim()).filter(Boolean);}
function parseWords(){return parseWordsFromText(wordsInput.value);} 
function makeButton(text,className,onClick){const btn=document.createElement('button');btn.type='button';btn.className=className;btn.textContent=text;btn.addEventListener('click',onClick);return btn;}
function newRowId(){return 'row_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
function syncWordsInputFromRows(){
  const words=Array.from(document.querySelectorAll('.image-row .image-word-input'))
    .map(input=>input.value.trim())
    .filter(Boolean);
  wordsInput.value=words.join('\n');
}
function cacheKey(word){return `${word.toLowerCase()}|${imageStyleSelect.value}`;}
function applyCategory(name){const words=presetCategories[name];if(!words)return;wordsInput.value=words.join('\n');buildImageRows([]);setStatus(`Loaded ready solution: ${name}. Built-in pictures are filled first in picture modes.`);saveState();}
function addWordInteractive(){
  const raw=window.prompt('Add a word or phrase:');
  if(raw===null)return;
  const incoming=parseWordsFromText(raw);
  if(!incoming.length)return;

  const existing=parseWords();
  const seen=new Set(existing.map(w=>w.toLowerCase()));
  const added=[];
  for(const word of incoming){
    const key=word.toLowerCase();
    if(seen.has(key))continue;
    seen.add(key);
    added.push(word);
  }
  // New words go to the TOP of the list so they are visible immediately.
  existing.unshift(...added);
  if(!added.length){
    setStatus('That word is already in the list.');
    return;
  }

  const currentImages=gatherImageState();
  wordsInput.value=existing.join('\n');
  buildImageRows(currentImages);

  const rows=Array.from(document.querySelectorAll('.image-row'));
  const newRow=rows.find(r=>added.some(w=>w.toLowerCase()===String(r.word||'').toLowerCase()));
  if(newRow){
    selectImageRow(newRow);
    newRow.scrollIntoView({behavior:'smooth',block:'center'});
  }

  setStatus(added.length===1 ? 'Added “'+added[0]+'”.' : 'Added '+added.length+' words.');
  saveState();
}
function normalizeWordList(){const words=parseWords();wordsInput.value=words.join('\n');buildImageRows(gatherImageState());setStatus('List normalized.');saveState();}
function dedupeWordList(){const seen=new Set();const words=[];for(const w of parseWords()){const key=w.toLowerCase();if(seen.has(key))continue;seen.add(key);words.push(w);}wordsInput.value=words.join('\n');buildImageRows(gatherImageState());setStatus('Duplicate words removed.');saveState();}
function sortWordList(){const words=parseWords().sort((a,b)=>a.localeCompare(b));wordsInput.value=words.join('\n');buildImageRows(gatherImageState());setStatus('Word list sorted A–Z.');saveState();}
function clearWordList(){wordsInput.value='';buildImageRows([]);setStatus('Word list cleared.');saveState();}
function clearAllImages(){document.querySelectorAll('.image-row').forEach(row=>{const preview=row.querySelector('.image-preview');const url=row.querySelector('.image-url-input');if(preview){delete preview.dataset.src;clearBuiltinSprite(preview);preview.innerHTML='';preview.textContent=uiText('No image','Нет картинки');}if(url)url.value='';});setStatus('All images cleared.');saveState();}
function updateIntroToggle(shouldSave=true){introToggleBtn.textContent=uiLanguage==='ru'?`Интро с Коулом: ${introEnabled?'ВКЛ':'ВЫКЛ'}`:`Cole intro: ${introEnabled?'ON':'OFF'}`;introToggleBtn.classList.toggle('active-toggle',introEnabled);introToggleBtn.classList.toggle('inactive-toggle',!introEnabled);if(shouldSave)saveState();}
function toggleIntroEnabled(){introEnabled=!introEnabled;updateIntroToggle();}
function previewColeIntro(){showIntroOverlay(()=>{});}

function updateScoreboard(shouldSave=true){teamAScoreEl.textContent=String(teamAScore);teamBScoreEl.textContent=String(teamBScore);scoreboardPanel.classList.toggle('hidden',!scoreboardVisible);scoreboardBtn.textContent=scoreboardVisible?uiText('Hide scoreboard','Скрыть счёт'):uiText('Scoreboard','Счёт');if(shouldSave)saveState();}
function changeScore(team,delta){if(team==='a')teamAScore+=delta;else teamBScore+=delta;updateScoreboard();}
function toggleScoreboard(){scoreboardVisible=!scoreboardVisible;updateScoreboard();}
function resetScores(){teamAScore=0;teamBScore=0;updateScoreboard();}

function applyDisplayMode(nextMode, shouldSave=true){displayMode=nextMode==='kids'?'kids':'teacher';document.body.classList.remove('teacher-mode','kids-mode');document.body.classList.add(displayMode+'-mode');teacherModeBtn.classList.toggle('active-mode',displayMode==='teacher');kidsModeBtn.classList.toggle('active-mode',displayMode==='kids');if(displayMode==='kids' && gameScreen.classList.contains('active')) requestAnimationFrame(()=>fitWord()); if(shouldSave) saveState();}
async function openClassView(){applyDisplayMode('kids'); if(!document.fullscreenElement){try{await document.documentElement.requestFullscreen?.();}catch{}}}


function yandexQuery(word,styled=true){const w=String(word||'').trim();const ru=/[А-Яа-яЁё]/.test(w);if(!styled)return w;return ru?`${w} клипарт мультяшная картинка один объект на белом фоне без текста для детей`:`${w} cute cartoon clipart single object isolated white background no text kids vocabulary`;}
let yandexPopup=null;
let yandexPopupWatch=null;

function openYandexImages(word,styled=true){
  const q=yandexQuery(word,styled);
  const url=`https://yandex.ru/images/search?text=${encodeURIComponent(q)}`;

  const width=Math.min(1180,Math.max(760,(window.screen?.availWidth||1200)-140));
  const height=Math.min(820,Math.max(600,(window.screen?.availHeight||850)-120));
  const left=Math.max(0,Math.round(((window.screen?.availWidth||width)-width)/2));
  const top=Math.max(0,Math.round(((window.screen?.availHeight||height)-height)/2));

  const features=`popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
  yandexPopup=window.open(url,'shkoalaYandexImages',features);

  if(!yandexPopup){
    window.open(url,'_blank','noopener,noreferrer');
    setStatus('Yandex opened. Copy the picture, return here and press Ctrl+V.');
    return;
  }

  try{yandexPopup.focus();}catch{}

  clearInterval(yandexPopupWatch);
  yandexPopupWatch=setInterval(()=>{
    if(!yandexPopup||yandexPopup.closed){
      clearInterval(yandexPopupWatch);
      yandexPopupWatch=null;
      yandexPopup=null;
      try{window.focus();}catch{}
      setStatus('Yandex window closed. Paste the copied picture with Ctrl+V.');
    }
  },450);
}

let cropRow=null;
let cropImage=null;
let cropScale=1;
let cropBaseScale=1;
let cropOffsetX=0;
let cropOffsetY=0;
let cropDragging=false;
let cropLastX=0;
let cropLastY=0;

function cropCtx(){return cropCanvas?.getContext('2d');}

function cropCanvasPoint(ev){
  const rect=cropCanvas.getBoundingClientRect();
  return {
    x:(ev.clientX-rect.left)*(cropCanvas.width/rect.width),
    y:(ev.clientY-rect.top)*(cropCanvas.height/rect.height)
  };
}

function drawCropEditor(){
  if(!cropCanvas||!cropImage)return;
  const c=cropCtx();
  const W=cropCanvas.width,H=cropCanvas.height;
  c.clearRect(0,0,W,H);
  c.fillStyle='#fff';
  c.fillRect(0,0,W,H);

  const scale=cropBaseScale*cropScale;
  const dw=cropImage.naturalWidth*scale;
  const dh=cropImage.naturalHeight*scale;
  const x=(W-dw)/2+cropOffsetX;
  const y=(H-dh)/2+cropOffsetY;

  c.imageSmoothingEnabled=true;
  c.imageSmoothingQuality='high';
  c.drawImage(cropImage,x,y,dw,dh);

  // crop-frame border
  c.save();
  c.strokeStyle='rgba(79,64,190,.78)';
  c.lineWidth=5;
  c.setLineDash([16,12]);
  c.strokeRect(4,4,W-8,H-8);
  c.setLineDash([]);
  c.restore();
}

function fitCropImage(){
  if(!cropImage||!cropCanvas)return;
  const W=cropCanvas.width,H=cropCanvas.height;
  // "Fit" shows the whole image; white background remains if needed.
  cropBaseScale=Math.min(W/cropImage.naturalWidth,H/cropImage.naturalHeight);
  cropScale=1;
  cropOffsetX=0;
  cropOffsetY=0;
  if(cropZoom)cropZoom.value='100';
  drawCropEditor();
}

function closeCropEditor(){
  cropModal?.classList.add('hidden');
  cropModal?.setAttribute('aria-hidden','true');
  cropRow=null;
  cropImage=null;
  cropDragging=false;
}

function openCropEditor(row){
  if(!row||!row.previewBox?.dataset?.src)return;
  selectImageRow(row);

  const src=row.previewBox.dataset.src;
  const img=new Image();
  cropRow=row;

  img.onload=()=>{
    cropImage=img;
    cropModal?.classList.remove('hidden');
    cropModal?.setAttribute('aria-hidden','false');
    fitCropImage();
  };

  img.onerror=()=>{
    cropRow=null;
    cropImage=null;
    setStatus('Could not open this picture for cropping.');
  };

  // Same-origin and pasted/uploaded data URLs crop cleanly.
  if(/^https?:\/\//i.test(src) && !src.startsWith(location.origin)){
    img.crossOrigin='anonymous';
  }
  img.src=src;
}

function applyCrop(){
  if(!cropRow||!cropImage||!cropCanvas)return;
  try{
    const out=document.createElement('canvas');
    out.width=720;
    out.height=720;
    const o=out.getContext('2d');
    o.fillStyle='#fff';
    o.fillRect(0,0,out.width,out.height);
    o.drawImage(cropCanvas,0,0,out.width,out.height);
    const src=out.toDataURL('image/png',0.96);
    cropRow.setImage(src);
    selectImageRow(cropRow);
    setStatus('Cropped picture saved for “'+cropRow.word+'”.');
    closeCropEditor();
  }catch(err){
    setStatus('This remote picture cannot be cropped directly. Copy the image itself and paste it with Ctrl+V, then crop it.');
  }
}

function selectImageRow(row){
  document.querySelectorAll('.image-row.selected').forEach(r=>r.classList.remove('selected'));
  selectedImageRow=row||null;
  if(selectedImageRow)selectedImageRow.classList.add('selected');
}
function searchSelectedImage(){
  const rows=Array.from(document.querySelectorAll('.image-row'));
  if(!rows.length)return setStatus('Add words first.');
  let row=selectedImageRow;
  if(!row||!document.body.contains(row))row=rows.find(r=>!r.previewBox?.dataset?.src)||rows[0];
  selectImageRow(row);
  openYandexImages(row.word,true);
  setStatus(`Yandex opened for “${row.word}”. Copy the image, come back here and press Ctrl+V.`);
}
async function pasteImageIntoSelectedRow(e){
  if(!selectedImageRow||!document.body.contains(selectedImageRow))return;
  const items=Array.from(e.clipboardData?.items||[]);
  const imageItem=items.find(item=>item.type&&item.type.startsWith('image/'));
  if(imageItem){
    const file=imageItem.getAsFile();
    if(file){e.preventDefault();const src=await readFileAsDataUrl(file);selectedImageRow.setImage(src);setStatus(`Picture pasted for “${selectedImageRow.word}”.`);return;}
  }
  const pasted=(e.clipboardData?.getData('text/plain')||'').trim();
  if(/^https?:\/\//i.test(pasted)){
    e.preventDefault();selectedImageRow.setImage(pasted);setStatus(`Picture URL pasted for “${selectedImageRow.word}”.`);
  }
}
function addWordsFromQuickPanel(){
  const raw=(quickWordInput?.value||'').trim();
  const currentImages=gatherImageState();

  // Empty Add = a new blank row for a picture-only ticket.
  if(!raw){
    currentImages.push({id:newRowId(),word:'',imageSrc:''});
    buildImageRows(currentImages);
    const rows=Array.from(document.querySelectorAll('.image-row'));
    const newRow=rows[rows.length-1];
    if(newRow){
      selectImageRow(newRow);
      newRow.scrollIntoView({behavior:'smooth',block:'end'});
    }
    setStatus('Blank picture row added. Paste with Ctrl+V or use Upload.');
    saveState();
    return;
  }

  const incoming=parseWordsFromText(raw);
  if(!incoming.length)return;

  const existing=parseWords();
  const seen=new Set(existing.map(w=>w.toLowerCase()));
  const added=[];

  for(const word of incoming){
    const key=word.toLowerCase();
    if(seen.has(key))continue;
    seen.add(key);
    added.push(word);
  }

  if(!added.length){
    setStatus('That word is already in the list.');
    quickWordInput.select();
    return;
  }

  existing.push(...added);
  wordsInput.value=existing.join('\n');

  // Keep existing pictures and blank picture-only rows.
  buildImageRows(currentImages);
  quickWordInput.value='';

  const rows=Array.from(document.querySelectorAll('.image-row'));
  const newRow=rows[rows.length-1];
  if(newRow){
    selectImageRow(newRow);
    newRow.scrollIntoView({behavior:'smooth',block:'end'});
  }

  setStatus(added.length===1 ? 'Added “'+added[0]+'”.' : 'Added '+added.length+' words.');
  saveState();
}

function deleteWordRow(row){
  if(!row)return;
  const label=(row.querySelector('.image-word-input')?.value||'').trim();
  if(selectedImageRow===row)selectedImageRow=null;
  row.remove();
  syncWordsInputFromRows();

  if(!document.querySelector('.image-row')){
    imageRows.className='image-rows empty-state-box';
    imageRows.innerHTML='<p>'+uiText('Add your words below.','Добавьте слова или картинки ниже.')+'</p>';
  }

  setStatus(label ? 'Deleted “'+label+'”.' : 'Deleted blank picture row.');
  saveState();
}

function deleteSelectedWord(){
  const checked=Array.from(document.querySelectorAll('.image-row .row-select:checked'));

  if(!checked.length){
    setStatus('Select one or more rows with the checkboxes first.');
    return;
  }

  checked.forEach(box=>box.closest('.image-row')?.remove());
  selectedImageRow=null;
  syncWordsInputFromRows();

  if(!document.querySelector('.image-row')){
    imageRows.className='image-rows empty-state-box';
    imageRows.innerHTML='<p>'+uiText('Add your words below.','Добавьте слова или картинки ниже.')+'</p>';
  }

  setStatus('Deleted '+checked.length+' selected row'+(checked.length===1?'':'s')+'.');
  saveState();
}

function buildImageRows(existing=[]){
  const words=parseWords();
  const existingList=Array.isArray(existing)?existing:[];
  const usedExisting=new Set();

  // Match saved image state to current words, then append any saved blank rows.
  const rowItems=words.map((word,index)=>{
    let matchIndex=existingList.findIndex((item,i)=>
      !usedExisting.has(i) &&
      String(item?.word||'').trim().toLowerCase()===word.toLowerCase()
    );

    if(matchIndex<0){
      matchIndex=existingList.findIndex((item,i)=>
        !usedExisting.has(i) &&
        String(item?.word||'').trim() &&
        i===index
      );
    }

    if(matchIndex>=0){
      usedExisting.add(matchIndex);
      const item=existingList[matchIndex]||{};
      return {id:item.id||newRowId(),word,imageSrc:item.imageSrc||''};
    }

    return {id:newRowId(),word,imageSrc:''};
  });

  existingList.forEach((item,i)=>{
    if(usedExisting.has(i))return;
    if(String(item?.word||'').trim())return;
    rowItems.push({id:item.id||newRowId(),word:'',imageSrc:item.imageSrc||''});
  });

  if(!rowItems.length){
    imageRows.className='image-rows empty-state-box';
    imageRows.innerHTML='<p>'+uiText('Add your words below.','Добавьте слова или картинки ниже.')+'</p>';
    saveState();
    return;
  }

  imageRows.className='image-rows';
  imageRows.innerHTML='';

  rowItems.forEach(item=>{
    const row=document.createElement('div');
    row.className='image-row';
    row.dataset.rowId=item.id||newRowId();

    const selectWrap=document.createElement('label');
    selectWrap.className='row-select-wrap';
    selectWrap.title=uiText('Select for bulk delete','Выбрать для удаления');

    const selectBox=document.createElement('input');
    selectBox.type='checkbox';
    selectBox.className='row-select';
    selectWrap.appendChild(selectBox);

    const wordInput=document.createElement('input');
    wordInput.className='image-word-input';
    wordInput.value=item.word||'';
    wordInput.placeholder=uiText('Optional word','Слово (необязательно)');
    wordInput.autocomplete='off';

    const preview=document.createElement('div');
    preview.className='image-preview';
    preview.textContent=uiText('No image','Нет картинки');

    const tools=document.createElement('div');
    tools.className='row-tools';

    const fileInput=document.createElement('input');
    fileInput.type='file';
    fileInput.accept='image/*';
    fileInput.hidden=true;

    function currentWord(){return wordInput.value.trim();}

    function setPreview(src){
      preview.innerHTML='';
      if(src){
        preview.dataset.src=src;
        preview.innerHTML=`<img src="${src}" alt="${escapeHtml(currentWord()||'Picture')}">`;
      }else{
        delete preview.dataset.src;
        preview.textContent=uiText('No image','Нет картинки');
      }
      saveState();
    }

    row.setImage=setPreview;
    row.word=currentWord();
    row.previewBox=preview;

    function refreshWordControls(){
      row.word=currentWord();
      const localSrc=builtinPictureForWord(row.word);
      localBtn.disabled=!localSrc;
      selectBox.setAttribute('aria-label','Select '+(row.word||'blank picture row'));
      deleteBtn.setAttribute('aria-label','Delete '+(row.word||'blank picture row'));
    }

    row.addEventListener('click',e=>{
      if(e.target.closest('button,input,label'))return;
      selectImageRow(row);
    });

    preview.addEventListener('click',()=>{
      selectImageRow(row);
      if(preview.dataset.src)openCropEditor(row);
    });

    wordInput.addEventListener('focus',()=>selectImageRow(row));
    wordInput.addEventListener('input',()=>{
      refreshWordControls();
      syncWordsInputFromRows();
      saveState();
    });

    const localBtn=makeButton(uiText('Our picture','Наша картинка'),'mini-btn our-pic-btn',e=>{
      e.stopPropagation();
      selectImageRow(row);
      const word=currentWord();
      const localSrc=builtinPictureForWord(word);
      if(!localSrc)return;
      setPreview(localSrc);
      setStatus('Our picture added for “'+word+'”.');
    });

    const yandexBtn=makeButton('Yandex','mini-btn gold-btn',e=>{
      e.stopPropagation();
      selectImageRow(row);
      const word=currentWord();
      if(!word){
        setStatus('Type a word first to search Yandex, or paste/upload a picture directly.');
        return;
      }
      openYandexImages(word,true);
      setStatus('Yandex opened for “'+word+'”. Copy the picture, return here and press Ctrl+V.');
    });

    const uploadBtn=makeButton(uiText('Upload','Загрузить'),'mini-btn upload-pic-btn',e=>{
      e.stopPropagation();
      selectImageRow(row);
      fileInput.click();
    });

    const deleteBtn=makeButton('🗑','mini-btn icon-delete-btn',e=>{
      e.stopPropagation();
      deleteWordRow(row);
    });
    deleteBtn.title=uiText('Delete row','Удалить строку');

    fileInput.addEventListener('change',async e=>{
      const file=e.target.files?.[0];
      if(!file)return;
      selectImageRow(row);
      const src=await readFileAsDataUrl(file);
      setPreview(src);
      setStatus(currentWord() ? 'Picture uploaded for “'+currentWord()+'”.' : 'Picture uploaded.');
      e.target.value='';
    });

    if(item.imageSrc){
      setPreview(item.imageSrc);
    }else if(getMode()!=='word'){
      const localSrc=builtinPictureForWord(currentWord());
      if(localSrc)setPreview(localSrc);
    }

    tools.append(localBtn,yandexBtn,uploadBtn,deleteBtn,fileInput);
    row.append(selectWrap,wordInput,preview,tools);
    imageRows.appendChild(row);
    refreshWordControls();
  });

  if(!selectedImageRow||!document.body.contains(selectedImageRow)){
    selectImageRow(document.querySelector('.image-row'));
  }

  saveState();
}

function gatherImageState(){return Array.from(document.querySelectorAll('.image-row')).map(row=>({id:row.dataset.rowId||newRowId(),word:row.querySelector('.image-word-input')?.value?.trim()||'',imageSrc:row.querySelector('.image-preview')?.dataset?.src||''}));}
function buildCards(){const rows=gatherImageState();if(getMode()==='picture')return rows.map(item=>({word:item.word||'',imageSrc:item.imageSrc||''}));return rows.filter(item=>item.word).map(item=>({word:item.word,imageSrc:item.imageSrc||''}));}
function shuffled(arr){const copy=arr.map(v=>({...v}));if(!shuffleToggle.checked)return copy;for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function isShortSimpleWord(word){return /^[a-zA-Z-]{2,14}$/.test(word.trim())&&!/\s/.test(word.trim());}
function buildSmartQueries(word){const clean=word.trim();const style=imageStyleSelect.value;const queries=[];if(style==='illustration'){if(isShortSimpleWord(clean)){queries.push(`cute ${clean} cartoon isolated white background`);queries.push(`${clean} cartoon isolated white background`);queries.push(`${clean} illustration isolated`);queries.push(`${clean} clipart`);queries.push(`${clean} drawing for kids`);}else{queries.push(`${clean} illustration`);queries.push(`${clean} cartoon`);queries.push(`${clean} drawing`);queries.push(clean);}}else if(style==='photo'){queries.push(`${clean} isolated white background`);queries.push(`${clean} photo`);queries.push(clean);}else{queries.push(clean);queries.push(`${clean} isolated`);queries.push(`${clean} illustration`);}return [...new Set(queries)];}
function positiveScore(title,creator,word){const t=`${title||''} ${creator||''}`.toLowerCase();const w=word.toLowerCase();let score=0;if(t.includes(w))score+=6;if(/cartoon|illustration|drawing|clipart|vector/.test(t))score+=imageStyleSelect.value==='illustration'?4:1;if(/isolated|white background/.test(t))score+=2;if(/cute|kids|child/.test(t))score+=1.5;if(/photo|photograph/.test(t))score+=imageStyleSelect.value==='photo'?4:-2;return score;}
function negativeScore(title){const t=(title||'').toLowerCase();let score=0;if(/logo|flag|map|diagram|chart|poster|book|cover|stamp|advertisement|banner|wallpaper|pattern/.test(t))score-=6;if(/museum|painting|artwork|album|screenshot|page|icon set/.test(t))score-=4;return score;}
function chooseBestImage(results,word){if(!results.length)return null;const scored=results.map(item=>{let score=positiveScore(item.title,item.creator,word)+negativeScore(item.title);score+=(Math.min(item.width||0,item.height||0)>=400?1:0);return{item,score};}).sort((a,b)=>b.score-a.score);return scored[0]?.item||results[0];}
function dedupeByUrl(items){const seen=new Set();const out=[];for(const item of items){const key=item.fullUrl||item.url;if(seen.has(key))continue;seen.add(key);out.push(item);}return out;}
async function fetchOpenverse(query,page=1){const params=new URLSearchParams({q:query,page:String(page),page_size:'20',mature:'false',aspect_ratio:'square',license_type:'all'});const key=`${query}|${page}`;if(searchCache.has(key))return searchCache.get(key);const res=await fetch(`${OPENVERSE_API}?${params.toString()}`);if(!res.ok)throw new Error('Search failed');const data=await res.json();const results=(data.results||[]).map(item=>({title:item.title||'Untitled',creator:item.creator||'',thumb:item.thumbnail||item.url,url:item.thumbnail||item.url,fullUrl:item.url,width:item.width,height:item.height})).filter(item=>item.url);searchCache.set(key,results);return results;}
async function getCuratedResultsForWord(word,page=1){const builtin=builtinResultItem(word);const queries=buildSmartQueries(word);let merged=[];for(const q of queries){try{const results=await fetchOpenverse(q,page);if(results.length)merged=merged.concat(results);if(merged.length>=24)break;}catch{}}merged=dedupeByUrl(merged);merged.sort((a,b)=>(positiveScore(b.title,b.creator,word)+negativeScore(b.title))-(positiveScore(a.title,a.creator,word)+negativeScore(a.title)));if(builtin){merged=[builtin,...merged.filter(item=>(item.fullUrl||item.url)!==(builtin.fullUrl||builtin.url))];}const best=merged[0]||null;return{results:merged,best,source:best?.source||''};}
function setRowResults(word,results){const key=cacheKey(word);rowResultCaches.set(key,results||[]);if(!rowResultIndices.has(key))rowResultIndices.set(key,0);updateRowNextButton(word);}function getRowResults(word){return rowResultCaches.get(cacheKey(word))||[];}
function updateRowNextButton(word){const row=[...document.querySelectorAll('.image-row')].find(r=>r.word===word);if(!row||!row.nextBtn)return;row.nextBtn.disabled=getRowResults(word).length<2;}
function cycleRowPicture(word,row){const key=cacheKey(word);const results=getRowResults(word);if(results.length<2){setStatus(`Search first to load more pictures for ${word}.`);return;}let index=(rowResultIndices.get(key)??0)+1;if(index>=results.length)index=0;rowResultIndices.set(key,index);row.setImage(results[index].url);setStatus(`Showing another picture for ${word}.`);}
function openImageModal(row,word){modalRowTarget=row;modalWord=word;modalPage=1;modalQueryIndex=0;modalBaseQueries=buildSmartQueries(word);modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');modalTitle.textContent=uiText(`Choose a picture for “${word}”`,`Выберите картинку для «${word}»`);modalSearchInput.value=modalBaseQueries[0];modalResults.innerHTML='';modalMessage.textContent=uiText('Loading pictures...','Загружаем картинки...');fetchModalResults(true);}function closeImageModal(){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');modalRowTarget=null;modalResults.innerHTML='';}
async function fetchModalResults(reset=false){const rawQuery=modalSearchInput.value.trim();if(!rawQuery)return;if(reset)modalPage=modalPage||1;modalResults.innerHTML='';modalMessage.textContent=uiText('Loading pictures...','Загружаем картинки...');modalMoreBtn.disabled=true;try{const builtin=builtinResultItem(modalWord);let results=await fetchOpenverse(rawQuery,modalPage);if(!results.length&&modalQueryIndex+1<modalBaseQueries.length){modalQueryIndex+=1;modalSearchInput.value=modalBaseQueries[modalQueryIndex];results=await fetchOpenverse(modalSearchInput.value,modalPage);}results=dedupeByUrl(results);results.sort((a,b)=>(positiveScore(b.title,b.creator,modalWord)+negativeScore(b.title))-(positiveScore(a.title,a.creator,modalWord)+negativeScore(a.title)));if(builtin){results=[builtin,...results.filter(item=>(item.fullUrl||item.url)!==(builtin.fullUrl||builtin.url))];}if(!results.length){modalMessage.textContent=uiText('No pictures found. Try another word.','Картинки не найдены. Попробуйте другое слово.');modalMoreBtn.disabled=false;return;}setRowResults(modalWord,results);rowResultIndices.set(cacheKey(modalWord),0);updateRowNextButton(modalWord);modalMessage.textContent=builtin?uiText('Our picture pack is shown first. Then you can choose from general search results.','Сначала показана наша база картинок, затем — результаты общего поиска.'):uiText('Click a picture to insert it automatically.','Нажмите на картинку, чтобы вставить её.');for(const item of results){const tile=document.createElement('button');tile.type='button';tile.className='result-tile';if(isBuiltinSrc(item.thumb)){const thumb=document.createElement('div');thumb.className='result-thumb';thumb.appendChild(makeBuiltinSprite(builtinKeyFromSrc(item.thumb),'modal-builtin-sprite'));tile.appendChild(thumb);tile.insertAdjacentHTML('beforeend',`<div class="use-badge">${uiText('Our picture','Наша картинка')}</div><div class="result-caption">${escapeHtml(item.title)}</div>`);}else{tile.innerHTML=`<div class="result-thumb"><img src="${item.thumb}" alt="${escapeHtml(item.title)}"></div><div class="use-badge">${item.isBuiltin?uiText('Our picture','Наша картинка'):uiText('Use this picture','Использовать')}</div><div class="result-caption">${escapeHtml(item.title)}</div>`;}tile.addEventListener('click',()=>{if(modalRowTarget?.setImage){modalRowTarget.setImage(item.url);const list=getRowResults(modalWord);const idx=list.findIndex(x=>(x.fullUrl||x.url)===(item.fullUrl||item.url));if(idx>=0)rowResultIndices.set(cacheKey(modalWord),idx);setStatus(item.isBuiltin?`Inserted our built-in picture for ${modalRowTarget.word}.`:`Picture inserted for ${modalRowTarget.word}.`);}closeImageModal();});modalResults.appendChild(tile);}modalMoreBtn.disabled=false;}catch{modalMessage.textContent='Could not load pictures right now.';modalMoreBtn.disabled=false;}}
async function autoFillAllImages(){const rows=Array.from(document.querySelectorAll('.image-row'));if(!rows.length)return;autoFillAllBtn.disabled=true;let ok=0,miss=0,builtinCount=0;for(const row of rows){if(row.previewBox?.dataset?.src)continue;setStatus(`Searching picture for ${row.word}...`);try{const {results,best}=await getCuratedResultsForWord(row.word,1);setRowResults(row.word,results);if(best){row.setImage(best.url);ok+=1;if(best.source==='builtin')builtinCount+=1;}else miss+=1;}catch{miss+=1;}await new Promise(r=>setTimeout(r,160));}setStatus(`Auto-fill finished: ${ok} added, ${miss} missed. Built-in pack used first for ${builtinCount} word(s).`);autoFillAllBtn.disabled=false;document.querySelectorAll('.image-row').forEach(r=>updateRowNextButton(r.word));}
function resetIntroAnimation(){introStage.classList.remove('playing');void introStage.offsetWidth;introStage.classList.add('playing');}
function finishIntroAction(){const action=introPendingAction;introPendingAction=null;hideIntroOverlay(false);if(typeof action==='function')action();}
function showIntroOverlay(onDone){clearTimeout(introTimer);introPendingAction=onDone||null;introOverlay.classList.remove('hidden');introOverlay.setAttribute('aria-hidden','false');resetIntroAnimation();playIntroShowSound();introTimer=setTimeout(()=>finishIntroAction(),4600);}
function hideIntroOverlay(clearAction=true){clearTimeout(introTimer);introOverlay.classList.add('hidden');introOverlay.setAttribute('aria-hidden','true');introStage.classList.remove('playing');if(clearAction)introPendingAction=null;}
function skipIntro(){finishIntroAction();}
function hideRoundEnd(){
  roundEndOverlay?.classList.add('hidden');
  roundEndOverlay?.setAttribute('aria-hidden','true');
}

function showRoundEnd(){
  roundEndOverlay?.classList.remove('hidden');
  roundEndOverlay?.setAttribute('aria-hidden','false');
}

function handleNextTicket(){
  if(!deck.length){
    showRoundEnd();
    return;
  }
  loadNextCard();
}

function startGameWithIntro(){mode=getMode();cards=buildCards();if(!cards.length)return alert(uiText('Add at least one word first.','Сначала добавьте хотя бы одно слово или картинку.'));if(mode!=='word'&&cards.some(card=>!card.imageSrc))return alert(uiText('Picture modes need a picture for every word.','В режиме с картинками для каждого билета нужна картинка.'));if(!introEnabled){hideIntroOverlay();startGame();return;}showIntroOverlay(()=>startGame());}
function startGame(){mode=getMode();cards=buildCards();if(!cards.length)return alert(uiText('Add at least one word first.','Сначала добавьте хотя бы одно слово или картинку.'));if(mode!=='word'&&cards.some(card=>!card.imageSrc))return alert(uiText('Picture modes need a picture for every word.','В режиме с картинками для каждого билета нужна картинка.'));deck=shuffled(cards);usedCount=0;hideRoundEnd();setupScreen.classList.remove('active');gameScreen.classList.add('active');loadNextCard();saveState();}
function loadNextCard(){
  if(!deck.length){
    showRoundEnd();
    return;
  }

  // Cover the old ticket before swapping in the next answer.
  ticket.classList.add('switching-ticket');

  current=deck.shift();
  usedCount+=1;
  progressTitle.textContent=uiText(`Ticket ${usedCount} / ${cards.length}`,`Билет ${usedCount} / ${cards.length}`);
  revealedEnough=false;
  nextBtn.disabled=false;

  renderCurrent();

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    prepareScratchSurface();
    requestAnimationFrame(()=>ticket.classList.remove('switching-ticket'));
  }));
}

function renderPictureSource(src){
  clearBuiltinSprite(resultBuiltinSprite);

  if(isBuiltinSrc(src)){
    resultImage.classList.add('hidden');
    resultBuiltinSprite.classList.remove('hidden');
    applyBuiltinSprite(resultBuiltinSprite,builtinKeyFromSrc(src));
  }else{
    resultBuiltinSprite.classList.add('hidden');
    resultImage.classList.remove('hidden');
    resultImage.onload=null;
    resultImage.src=src;
  }
}

function renderCurrent(){
  if(mode==='word'){
    ticketContent.className='ticket-content word-layout';
    picturePanel.classList.add('hidden');
    wordPanel.classList.remove('hidden');
    showWordBtn.classList.add('hidden');
    resultWord.textContent=current.word;
    resultWord.classList.remove('hidden');
  }else if(mode==='picture-word'){
    ticketContent.className='ticket-content dual-layout';
    picturePanel.classList.remove('hidden');
    wordPanel.classList.remove('hidden');
    showWordBtn.classList.add('hidden');
    resultWord.textContent=current.word;
    resultWord.classList.remove('hidden');
    renderPictureSource(current.imageSrc);
  }else{
    ticketContent.className='ticket-content picture-only-layout';
    picturePanel.classList.remove('hidden');
    wordPanel.classList.add('hidden');
    showWordBtn.classList.add('hidden');
    resultWord.textContent='';
    resultWord.classList.add('hidden');
    renderPictureSource(current.imageSrc);
  }

  requestAnimationFrame(()=>fitWord());
}

function fitWord(){
  const text=(current?.word||'').trim();
  if(!text||resultWord.classList.contains('hidden'))return;

  const availableWidth=Math.max(0,wordPanel.clientWidth-36);
  const availableHeight=Math.max(0,wordPanel.clientHeight-30);
  if(availableWidth<=0||availableHeight<=0)return;

  const words=text.split(/\s+/).filter(Boolean);
  const hasSpaces=words.length>1;
  const maxSize=mode==='word'
    ? (displayMode==='kids'?390:350)
    : (displayMode==='kids'?172:156);
  const minSize=22;

  const ctx=document.createElement('canvas').getContext('2d');
  const cs=getComputedStyle(resultWord);
  const family=cs.fontFamily||"'Comic Sans MS', cursive";
  const weight=cs.fontWeight||700;
  const measureAt100=str=>{
    ctx.font=`${weight} 100px ${family}`;
    return Math.max(1,ctx.measureText(str).width);
  };

  resultWord.style.width='100%';
  resultWord.style.maxWidth='100%';
  resultWord.style.lineHeight='1';
  resultWord.style.hyphens='none';
  resultWord.style.wordBreak='normal';
  resultWord.style.overflowWrap='normal';

  let size=maxSize;

  if(!hasSpaces){
    resultWord.style.whiteSpace='nowrap';
    const widthFit=(availableWidth*.90)*100/measureAt100(text);
    const heightFit=availableHeight*.78;
    size=Math.min(maxSize,widthFit,heightFit);

    if(text.length<=4)size=Math.min(maxSize,Math.max(size,availableHeight*.82));
    else if(text.length<=7)size=Math.min(maxSize,Math.max(size,availableHeight*.74));
  }else{
    // Phrases may wrap ONLY at spaces. First make sure the longest whole word fits.
    resultWord.style.whiteSpace='normal';
    const longestWord=words.reduce((a,b)=>measureAt100(a)>=measureAt100(b)?a:b);
    const longestFit=(availableWidth*.90)*100/measureAt100(longestWord);
    size=Math.min(maxSize,longestFit,availableHeight*.62);

    // Two-word phrases such as "school bag" stay large but never split "school".
    if(words.length===2){
      size=Math.min(maxSize,longestFit,availableHeight*.58);
    }else if(words.length>=3){
      size=Math.min(size,availableHeight*.46);
    }
  }

  size=Math.max(minSize,size);
  resultWord.style.fontSize=`${size}px`;

  let loops=0;
  while(
    (resultWord.scrollWidth>availableWidth || resultWord.scrollHeight>availableHeight) &&
    size>minSize &&
    loops<220
  ){
    size-=1.5;
    resultWord.style.fontSize=`${Math.max(minSize,size)}px`;
    loops++;
  }

  // Never fall back to splitting a word letter-by-letter.
  resultWord.style.wordBreak='normal';
  resultWord.style.overflowWrap='normal';
  resultWord.style.transform='translateY(-1px)';
}

function activeCanvasList(){
  if(mode==='word') return [wordScratchCanvas];
  if(mode==='picture-word') return [pictureScratchCanvas,wordScratchCanvas];
  if(mode==='picture') return [pictureScratchCanvas];
  return [];
}
function updateCoinSizeUI(shouldSave=true){
  const isTiny=scratchCoinSize==='tiny';
  const isSmall=scratchCoinSize==='small';
  const isLarge=scratchCoinSize==='large';
  coinTinyBtn?.classList.toggle('active',isTiny);
  coinSmallBtn?.classList.toggle('active',isSmall);
  coinLargeBtn?.classList.toggle('active',isLarge);
  const cursor=isTiny?COIN_CURSOR_TINY:(isSmall?COIN_CURSOR_SMALL:COIN_CURSOR_LARGE);
  [pictureScratchCanvas,wordScratchCanvas].forEach(canvas=>{if(canvas)canvas.style.cursor=cursor;});
  if(shouldSave)saveState();
}
function setScratchCoinSize(size){
  scratchCoinSize=['tiny','small','large'].includes(size)?size:'large';
  lastScratchPoint=null;
  updateCoinSizeUI();
}

function prepareScratchSurface(){
  activeScratchLayers=[];
  [pictureScratchCanvas,wordScratchCanvas].forEach(c=>c.classList.add('hidden'));
  for(const canvas of activeCanvasList()){
    canvas.classList.remove('hidden');
    const rect=canvas.getBoundingClientRect();
    const dpr=Math.max(1,window.devicePixelRatio||1);
    canvas.width=Math.max(1,Math.round(rect.width*dpr));
    canvas.height=Math.max(1,Math.round(rect.height*dpr));
    const layerCtx=canvas.getContext('2d',{willReadFrequently:true});
    layerCtx.setTransform(1,0,0,1,0,0);
    layerCtx.clearRect(0,0,canvas.width,canvas.height);
    drawScratchFieldLocal(layerCtx,0,0,canvas.width,canvas.height,24*dpr);
    canvas.style.cursor=scratchCoinSize==='tiny'?COIN_CURSOR_TINY:(scratchCoinSize==='small'?COIN_CURSOR_SMALL:COIN_CURSOR_LARGE);
    activeScratchLayers.push({canvas,ctx:layerCtx,dpr});
  }
  lastScratchPoint=null;
}
function drawScratchFieldLocal(c,x,y,w,h,r){const silver=c.createLinearGradient(x,y,x+w,y+h);silver.addColorStop(0,'#7f8da6');silver.addColorStop(.12,'#eef3fb');silver.addColorStop(.28,'#aeb9cc');silver.addColorStop(.46,'#fbfdff');silver.addColorStop(.64,'#c7d0df');silver.addColorStop(.82,'#f4f7fb');silver.addColorStop(1,'#8794aa');roundRect(c,x,y,w,h,r);c.fillStyle=silver;c.fill();c.save();roundRect(c,x,y,w,h,r);c.clip();c.globalAlpha=.15;const stripe=Math.max(18,Math.round(w/17));for(let xx=-h;xx<w+h;xx+=stripe*2){c.save();c.translate(xx,0);c.rotate(-.28);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(0,y,stripe*.56,h*1.5);c.restore();}c.globalAlpha=.16;for(let i=0;i<210;i++){c.fillStyle=i%5?'rgba(255,255,255,.36)':'rgba(77,88,111,.30)';c.beginPath();c.arc(Math.random()*w,Math.random()*h,Math.random()*1.8+.35,0,Math.PI*2);c.fill();}c.globalAlpha=.24;c.fillStyle='#5f6c83';c.textAlign='center';c.textBaseline='middle';c.font=`800 ${Math.max(14,Math.min(25,h*.105))}px Inter, sans-serif`;c.fillText(uiText('✦  SCRATCH HERE  ✦','✦  СОТРИ ЗДЕСЬ  ✦'),x+w/2,y+h/2);c.restore();c.strokeStyle='rgba(95,107,131,.58)';c.lineWidth=2;roundRect(c,x+1,y+1,w-2,h-2,Math.max(4,r-1));c.stroke();}
function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function findScratchLayer(canvas){return activeScratchLayers.find(l=>l.canvas===canvas);}
function scratchStampLocal(layer,x,y,size){
  const c=layer.ctx;c.globalCompositeOperation='destination-out';
  const grad=c.createRadialGradient(x,y,size*.12,x,y,size);
  grad.addColorStop(0,'rgba(0,0,0,1)');grad.addColorStop(.78,'rgba(0,0,0,1)');grad.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=grad;c.beginPath();c.arc(x,y,size,0,Math.PI*2);c.fill();
}
function scratchAt(ev){
  const layer=findScratchLayer(ev.currentTarget);if(!layer)return;
  const rect=layer.canvas.getBoundingClientRect();
  const x=(ev.clientX-rect.left)*layer.dpr,y=(ev.clientY-rect.top)*layer.dpr;
  const size=(scratchCoinSize==='tiny'?Math.max(13,rect.width*.0105):(scratchCoinSize==='small'?Math.max(22,rect.width*.018):Math.max(40,rect.width*.032)))*layer.dpr;
  if(lastScratchPoint&&lastScratchPoint.canvas===layer.canvas){
    const dx=x-lastScratchPoint.x,dy=y-lastScratchPoint.y,dist=Math.hypot(dx,dy);
    const steps=Math.max(1,Math.ceil(dist/(size*.42)));
    for(let i=1;i<=steps;i++) scratchStampLocal(layer,lastScratchPoint.x+dx*i/steps,lastScratchPoint.y+dy*i/steps,size);
  } else scratchStampLocal(layer,x,y,size);
  lastScratchPoint={canvas:layer.canvas,x,y};
  playScratchSound();
}
function layerRevealedPercent(layer){
  const data=layer.ctx.getImageData(0,0,layer.canvas.width,layer.canvas.height).data;
  let clear=0,total=0;
  const pixelStep=18;
  for(let i=3;i<data.length;i+=4*pixelStep){total++;if(data[i]<35)clear++;}
  return total?(clear/total)*100:0;
}
function getRevealedPercent(){
  if(!activeScratchLayers.length)return 0;
  return activeScratchLayers.reduce((sum,l)=>sum+layerRevealedPercent(l),0)/activeScratchLayers.length;
}
function clearScratchLayers(){for(const l of activeScratchLayers)l.ctx.clearRect(0,0,l.canvas.width,l.canvas.height);}
function autoRevealAndCelebrate(){
  if(revealedEnough)return;revealedEnough=true;
  
  clearScratchLayers();fireConfetti();playFanfare();
}
function checkReveal(){if(revealedEnough)return;if(getRevealedPercent()>=AUTO_REVEAL_THRESHOLD)autoRevealAndCelebrate();}
function revealAll(){autoRevealAndCelebrate();}
function getAudio(){if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();return audioContext;}
function playScratchSound(){const now=performance.now();if(now-lastScratchAt<42)return;lastScratchAt=now;const ac=getAudio(),dur=.085,bufferSize=Math.floor(ac.sampleRate*dur),buffer=ac.createBuffer(1,bufferSize,ac.sampleRate),data=buffer.getChannelData(0);let smooth=0;for(let i=0;i<bufferSize;i++){const white=Math.random()*2-1;smooth=smooth*.62+white*.38;const grain=(Math.random()<.035?(Math.random()*2-1)*.8:0);const env=Math.sin(Math.PI*i/bufferSize);data[i]=(smooth*.72+grain*.28)*env;}const noise=ac.createBufferSource();noise.buffer=buffer;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=170;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=720+Math.random()*180;bp.Q.value=.62;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;const gain=ac.createGain();gain.gain.setValueAtTime(.0001,ac.currentTime);gain.gain.linearRampToValueAtTime(.055,ac.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+dur);noise.connect(hp).connect(bp).connect(lp).connect(gain).connect(ac.destination);noise.start();noise.stop(ac.currentTime+dur);const edge=ac.createOscillator(),edgeGain=ac.createGain();edge.type='triangle';edge.frequency.setValueAtTime(1450+Math.random()*220,ac.currentTime);edgeGain.gain.setValueAtTime(.006,ac.currentTime);edgeGain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.018);edge.connect(edgeGain).connect(ac.destination);edge.start();edge.stop(ac.currentTime+.02);}
function playFanfare(){const ac=getAudio(),now=ac.currentTime,notes=[523.25,659.25,783.99,1046.5];notes.forEach((freq,i)=>{const osc=ac.createOscillator(),gain=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(freq,now+i*.11);gain.gain.setValueAtTime(.0001,now+i*.11);gain.gain.linearRampToValueAtTime(.07,now+i*.11+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.11+.25);osc.connect(gain).connect(ac.destination);osc.start(now+i*.11);osc.stop(now+i*.11+.28);});}
function playIntroShowSound(){try{const ac=getAudio();ac.resume?.();const now=ac.currentTime+.02;const noiseDur=1.5;const bufferSize=Math.floor(ac.sampleRate*noiseDur),buffer=ac.createBuffer(1,bufferSize,ac.sampleRate),data=buffer.getChannelData(0);let smooth=0;for(let i=0;i<bufferSize;i++){const white=Math.random()*2-1;smooth=smooth*.92+white*.08;const env=Math.min(1,i/(ac.sampleRate*.08))*Math.max(0,1-i/bufferSize);data[i]=smooth*.42*env;}const src=ac.createBufferSource();src.buffer=buffer;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.setValueAtTime(180,now);bp.frequency.linearRampToValueAtTime(320,now+1.2);bp.Q.value=.55;const g=ac.createGain();g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(.07,now+.08);g.gain.linearRampToValueAtTime(.045,now+1.0);g.gain.exponentialRampToValueAtTime(.0001,now+noiseDur);src.connect(bp).connect(g).connect(ac.destination);src.start(now);src.stop(now+noiseDur);for(let i=0;i<6;i++){const t=now+.18+i*.18;const osc=ac.createOscillator(),og=ac.createGain();osc.type='sine';osc.frequency.setValueAtTime(320+i*22,t);og.gain.setValueAtTime(.0001,t);og.gain.linearRampToValueAtTime(.012,t+.01);og.gain.exponentialRampToValueAtTime(.0001,t+.12);osc.connect(og).connect(ac.destination);osc.start(t);osc.stop(t+.13);}const pingT=now+1.56;[880,1174,1568].forEach((f,i)=>{const osc=ac.createOscillator(),og=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(f,pingT+i*.03);og.gain.setValueAtTime(.0001,pingT+i*.03);og.gain.linearRampToValueAtTime(.04,pingT+i*.03+.015);og.gain.exponentialRampToValueAtTime(.0001,pingT+i*.03+.35);osc.connect(og).connect(ac.destination);osc.start(pingT+i*.03);osc.stop(pingT+i*.03+.4);});const whooshT=now+2.55;const whooshDur=1.0;const wb=ac.createBuffer(1,Math.floor(ac.sampleRate*whooshDur),ac.sampleRate),wd=wb.getChannelData(0);for(let i=0;i<wd.length;i++){wd[i]=(Math.random()*2-1)*(1-i/wd.length);}const ws=ac.createBufferSource();ws.buffer=wb;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.setValueAtTime(600,whooshT);const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(5200,whooshT);const wg=ac.createGain();wg.gain.setValueAtTime(.0001,whooshT);wg.gain.linearRampToValueAtTime(.055,whooshT+.12);wg.gain.exponentialRampToValueAtTime(.0001,whooshT+whooshDur);ws.playbackRate.setValueAtTime(.92,whooshT);ws.playbackRate.linearRampToValueAtTime(1.14,whooshT+whooshDur);ws.connect(hp).connect(lp).connect(wg).connect(ac.destination);ws.start(whooshT);ws.stop(whooshT+whooshDur);}catch(e){}}
function fireConfetti(){confettiCanvas.classList.remove('hidden');const dpr=window.devicePixelRatio||1;confettiCanvas.width=window.innerWidth*dpr;confettiCanvas.height=window.innerHeight*dpr;confettiCtx.setTransform(1,0,0,1,0,0);confettiCtx.scale(dpr,dpr);confettiParticles=Array.from({length:150},()=>({x:window.innerWidth/2+(Math.random()*220-110),y:window.innerHeight*.25+(Math.random()*20-10),vx:Math.random()*8-4,vy:Math.random()*-8-2,size:Math.random()*8+5,rot:Math.random()*Math.PI,vr:Math.random()*.3-.15,color:['#6f56f8','#04b7ff','#ffd764','#ff7f7f','#7af0b0'][Math.floor(Math.random()*5)],life:80+Math.random()*24}));if(!confettiAnimating)animateConfetti();}
function animateConfetti(){confettiAnimating=true;confettiCtx.clearRect(0,0,window.innerWidth,window.innerHeight);confettiParticles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.16;p.rot+=p.vr;p.life-=1;confettiCtx.save();confettiCtx.translate(p.x,p.y);confettiCtx.rotate(p.rot);confettiCtx.fillStyle=p.color;confettiCtx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.64);confettiCtx.restore();});confettiParticles=confettiParticles.filter(p=>p.life>0&&p.y<window.innerHeight+30);if(confettiParticles.length)requestAnimationFrame(animateConfetti);else{confettiAnimating=false;confettiCanvas.classList.add('hidden');confettiCtx.clearRect(0,0,window.innerWidth,window.innerHeight);}}
function importWordsFile(file){file.text().then(text=>{const words=parseWordsFromText(text);if(!words.length)return alert(uiText('Could not find words in this file.','В файле не удалось найти слова.'));wordsInput.value=words.join('\n');buildImageRows(gatherImageState());saveState();});}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();}
function exitToSettings(){hideIntroOverlay();gameScreen.classList.remove('active');setupScreen.classList.add('active');saveState();}
function restartDeck(){deck=shuffled(cards);usedCount=0;hideRoundEnd();loadNextCard();}
function readFileAsDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));}

categoryButtons.forEach(btn=>btn.addEventListener('click',()=>applyCategory(btn.dataset.category)));
fillDemoBtn.addEventListener('click',()=>{wordsInput.value=demoWords.join('\n');buildImageRows(gatherImageState());saveState();});
dedupeListBtn.addEventListener('click',dedupeWordList);
sortListBtn.addEventListener('click',sortWordList);
clearListBtn.addEventListener('click',clearWordList);
importWordsInput.addEventListener('change',e=>{const file=e.target.files?.[0];if(file)importWordsFile(file);});
quickAddWordBtn?.addEventListener('click',addWordsFromQuickPanel);
quickWordInput?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addWordsFromQuickPanel();}});
deleteSelectedWordBtn?.addEventListener('click',deleteSelectedWord);
addWordBtn?.addEventListener('click',addWordInteractive);
addWordPicturesBtn?.addEventListener('click',addWordInteractive);
builtinFillBtn.addEventListener('click',fillBuiltinPictures);
clearAllImagesBtn.addEventListener('click',clearAllImages);
startBtn.addEventListener('click',startGameWithIntro);introToggleBtn.addEventListener('click',toggleIntroEnabled);previewIntroBtn.addEventListener('click',previewColeIntro);skipIntroBtn.addEventListener('click',skipIntro);teacherModeBtn.addEventListener('click',()=>applyDisplayMode('teacher'));kidsModeBtn.addEventListener('click',()=>applyDisplayMode('kids'));classViewBtn.addEventListener('click',openClassView);scoreboardBtn.addEventListener('click',toggleScoreboard);scoreHideBtn.addEventListener('click',()=>{scoreboardVisible=false;updateScoreboard();});scoreResetBtn.addEventListener('click',resetScores);document.querySelectorAll('[data-team][data-delta]').forEach(btn=>btn.addEventListener('click',()=>changeScore(btn.dataset.team,Number(btn.dataset.delta))));teamAName.addEventListener('input',saveState);teamBName.addEventListener('input',saveState);backBtn.addEventListener('click',exitToSettings);restartBtn.addEventListener('click',restartDeck);clearBtn.addEventListener('click',revealAll);coinTinyBtn?.addEventListener('click',()=>setScratchCoinSize('tiny'));coinSmallBtn?.addEventListener('click',()=>setScratchCoinSize('small'));coinLargeBtn?.addEventListener('click',()=>setScratchCoinSize('large'));nextBtn.addEventListener('click',handleNextTicket);playAgainBtn?.addEventListener('click',restartDeck);roundSettingsBtn?.addEventListener('click',()=>{hideRoundEnd();exitToSettings();});fullscreenBtn.addEventListener('click',toggleFullscreen);langRuBtn?.addEventListener('click',()=>setUiLanguage('ru'));langEnBtn?.addEventListener('click',()=>setUiLanguage('en'));
showWordBtn.addEventListener('click',()=>{resultWord.textContent=current?.word||'';resultWord.classList.remove('hidden');showWordBtn.classList.add('hidden');fitWord();});
closeModalBtn.addEventListener('click',closeImageModal);modal.querySelector('[data-close-modal]').addEventListener('click',closeImageModal);
modalSearchBtn.addEventListener('click',()=>{modalPage=1;fetchModalResults(true);});modalMoreBtn.addEventListener('click',()=>{modalPage+=1;fetchModalResults(true);});modalSearchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){modalPage=1;fetchModalResults(true);}});
let wordsRefreshTimer=null;wordsInput.addEventListener('input',()=>{saveState();clearTimeout(wordsRefreshTimer);wordsRefreshTimer=setTimeout(()=>buildImageRows(gatherImageState()),220);});shuffleToggle.addEventListener('change',saveState);imageStyleSelect.addEventListener('change',saveState);modeInputs.forEach(input=>input.addEventListener('change',()=>{refreshModeStyles();if(getMode()!=='word'){document.querySelectorAll('.image-row').forEach(row=>{if(!row.previewBox?.dataset?.src){const src=builtinPictureForWord(row.word);if(src)row.setImage(src);}});}saveState();}));window.addEventListener('resize',()=>{document.querySelectorAll('[data-builtin-key]').forEach(el=>applyBuiltinSprite(el,el.dataset.builtinKey));if(gameScreen.classList.contains('active')){fitWord();requestAnimationFrame(()=>prepareScratchSurface());}});window.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(cropModal&&!cropModal.classList.contains('hidden')){closeCropEditor();return;}if(!modal.classList.contains('hidden'))closeImageModal();});cropCloseBtn?.addEventListener('click',closeCropEditor);
cropCancelBtn?.addEventListener('click',closeCropEditor);
cropBackdrop?.addEventListener('click',closeCropEditor);
cropFitBtn?.addEventListener('click',fitCropImage);
cropApplyBtn?.addEventListener('click',applyCrop);

cropZoom?.addEventListener('input',()=>{
  cropScale=Math.max(.25,Number(cropZoom.value||100)/100);
  drawCropEditor();
});

cropCanvas?.addEventListener('pointerdown',ev=>{
  if(!cropImage)return;
  cropDragging=true;
  cropCanvas.setPointerCapture?.(ev.pointerId);
  const p=cropCanvasPoint(ev);
  cropLastX=p.x;cropLastY=p.y;
});
cropCanvas?.addEventListener('pointermove',ev=>{
  if(!cropDragging||!cropImage)return;
  const p=cropCanvasPoint(ev);
  cropOffsetX+=p.x-cropLastX;
  cropOffsetY+=p.y-cropLastY;
  cropLastX=p.x;cropLastY=p.y;
  drawCropEditor();
});
cropCanvas?.addEventListener('pointerup',ev=>{
  cropDragging=false;
  cropCanvas.releasePointerCapture?.(ev.pointerId);
});
cropCanvas?.addEventListener('pointercancel',()=>{cropDragging=false;});
cropCanvas?.addEventListener('wheel',ev=>{
  if(!cropImage)return;
  ev.preventDefault();
  const delta=ev.deltaY<0?5:-5;
  const next=Math.max(25,Math.min(300,Number(cropZoom.value||100)+delta));
  cropZoom.value=String(next);
  cropScale=next/100;
  drawCropEditor();
},{passive:false});

document.addEventListener('paste',pasteImageIntoSelectedRow);
let isDown=false;
[pictureScratchCanvas,wordScratchCanvas].forEach(canvas=>{
  canvas.addEventListener('pointerdown',e=>{isDown=true;lastScratchPoint=null;scratchAt(e);checkReveal();});
  canvas.addEventListener('pointermove',e=>{if(!isDown)return;scratchAt(e);checkReveal();});
  canvas.addEventListener('pointerleave',()=>{lastScratchPoint=null;});
});
window.addEventListener('pointerup',()=>{isDown=false;lastScratchPoint=null;});
loadState();applyLanguage(false);updateCoinSizeUI(false);refreshModeStyles();applyDisplayMode(displayMode,false);updateScoreboard(false);if(!document.querySelector('.image-row'))buildImageRows(gatherImageState());
