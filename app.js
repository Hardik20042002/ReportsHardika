var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var xlsx = require('xlsx');
var fs = require('fs');

var imeiModel = require('./models/imei');
var fosModel = require('./models/fos');
var prevModel=require('./models/prevsale');
var classModel = require('./models/class');
var scanModel = require('./models/scan');
var priceModel = require('./models/price');
var stockModel = require('./models/stock');
var actualSaleModel = require('./models/actualsale');
var limitModel = require('./models/limit');
var nameModel = require('./models/dealername');
var pnameModel = require('./models/modelname');
var outstandingModel = require('./models/outstanding');
var activationModel = require('./models/activation');
var chqModel = require('./models/cheque');
var ovdModel = require('./models/overdue');
var bodyParser = require('body-parser');
var stringSimilarity = require("string-similarity");
require('dotenv').config();
const accountSid = process.env.SID;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
const twilio = require('twilio');
var port = process.env.PORT || 3000;
const upload = multer({ dest: './public/uploads' });
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => console.log(err))
var app = express();
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

var dealers=[]
var models=[]
var fosds=[]
var temp1,temp2,temp4,temp5
classobj=['A+/50','A1/32','A2/28', 'B1/20','B2/18', 'C1/14','C2/8','D1/6','D2/4','E/3','']
const map = new Map([
    ['AURORA', 'A'],
    ['Cosmic Black', 'COB'],
    ['Dawnlight Gold', 'DAG'],
    ['Glowing Blue', 'GLBL'],
    ['Glowing Green', 'GLGR'],
    ['Lake Blue', 'LBL'],
    ['Mint Green', 'MGR'],
    ['Rainbow Blue', 'RBL'],
    ['Sky Blue', 'SKBL'],
    ['Starry Black', 'SAB'],
    ['Stellar Black', 'SLB'],
    ['Sunrise Gold', 'SUG'],
    ['Sunset Orange', 'SUO'],
    ['BLUE', 'BL'],
    ['Crystal silver', 'CS'],
    ['Glowing Black', 'GB'],
    ['Glowing Gold', 'GG'],
    ['GOLD', 'G'],
    ['Midnight Black', 'MB'],
    ['NAVY BLUE', 'NBL'],
    ['Rainbow Spectrum', 'RS'],
    ['Starlight Black', 'STB'],
    ['Startrails Blue', 'STBL'],
    ['Sunlight Orange', 'SO'],
    ['Sunset Blue', 'SUBL'],
    ['RAINBOW', 'RB'],
    ['RED', 'R'],
    ['GREEN', 'GR'],
    ['BLACK', 'B'],
    ['GREY', 'GY'],
    ['ORANGE', 'O'],
    ['WHITE', 'W'],
    ['PURPLE', 'PUR'],
  ]);
  const dummy=new Map([
    ['atoz','A TO Z MOBILE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['atozmobile','A TO Z MOBILE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['aman','AMAN MOBILE STORE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['amanmobilestore','AMAN MOBILE STORE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['ambe','AMBE SOFTWARE AND HARDWARE REP CENTRE-DADRI-GREATER NOIDA-UP WEST'],
    ['ambey','AMBE SOFTWARE AND HARDWARE REP CENTRE-DADRI-GREATER NOIDA-UP WEST'],
    ['ambesoftwareandhardwarerepcentre','AMBE SOFTWARE AND HARDWARE REP CENTRE-DADRI-GREATER NOIDA-UP WEST'],
    ['arish','ARISH MOBILE CENTER-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['arishmobilecenter','ARISH MOBILE CENTER-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['atul','ATUL TELECOM CENTRE-KASNA-GREATER NOIDA-UP WEST'],
    ['atultelecomcentre','ATUL TELECOM CENTRE-KASNA-GREATER NOIDA-UP WEST'],
    ['avni','AVNI MOBILE SHOP-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['avnimobileshop','AVNI MOBILE SHOP-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['anupam','ANUPAM TELECOM-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['anupamtelecom','ANUPAM TELECOM-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['anushka','ANUSKA MOBILE CENTER-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['anushkamobilecenter','ANUSKA MOBILE CENTER-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['anushkamobilecenter2','ANUSKA MOBILE CENTER-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['ayush','AYUSH COMMUNICATION-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['ayushcommunication','AYUSH COMMUNICATION-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['ar','A R COMMUNICATION-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['arcommunication','A R COMMUNICATION-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['arcomm','A R COMMUNICATION-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['balajimobilezone','BALAJI MOBILE AND ELECTRONICS-DADRI-GREATER NOIDA-UP WEST'],
    ['balajidadri','BALAJI MOBILE AND ELECTRONICS-DADRI-GREATER NOIDA-UP WEST'],
    ['balajimobileandelectronics','BALAJI MOBILE AND ELECTRONICS-DADRI-GREATER NOIDA-UP WEST'],
    ['bansiwala','BANSIWALA STORES-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['bansiwalastores','BANSIWALA STORES-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['bhoomi','BHOOMI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['bhoomimobilesolution','BHOOMI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['brs','BRS ELECTRONICS-KASNA-GREATER NOIDA-UP WEST'],
    ['brselectronics','BRS ELECTRONICS-KASNA-GREATER NOIDA-UP WEST'],
    ['balajitrader','BALAJI COMMUNICATION-GREATER NOIDA-UP WEST'],
    ['balajicommunication','BALAJI COMMUNICATION-GREATER NOIDA-UP WEST'],
    ['balajicomm','BALAJI COMMUNICATION-GREATER NOIDA-UP WEST'],
    ['balajitraders','BALAJI COMMUNICATION-GREATER NOIDA-UP WEST'],
    ['computer','COMPUTER WIZARD-PARI CHOWK-GREATER NOIDA-UP WEST'],
    ['wizard','COMPUTER WIZARD-PARI CHOWK-GREATER NOIDA-UP WEST'],
    ['computerwizard','COMPUTER WIZARD-PARI CHOWK-GREATER NOIDA-UP WEST'],
    ['devent','DEV ENTERPRISES-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['deventerprises','DEV ENTERPRISES-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['devcom','DEV COMMUNICATION-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['devcommunication','DEV COMMUNICATION-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['divine','DIVINE COMMUNICATION-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['divinecom','DIVINE COMMUNICATION-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['famous','FAMOUS MOBILE POINT-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['famousmobilepoint','FAMOUS MOBILE POINT-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['fauji','FAUJI TELECOM-DADRI-GREATER NOIDA-UP WEST'],
    ['faujitelecom','FAUJI TELECOM-DADRI-GREATER NOIDA-UP WEST'],
    ['fam','FAM MOBILE WORLD-DADRI-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['fammobile','FAM MOBILE WORLD-DADRI-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['fammobileworld','FAM MOBILE WORLD-DADRI-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['goel','GOEL MOBILE AND SAMARTH ELECTRONICS-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['samarth','GOEL MOBILE AND SAMARTH ELECTRONICS-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['goelmobileandsamarthelectronics','GOEL MOBILE AND SAMARTH ELECTRONICS-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['istore','I STORE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['ishu','ISHU COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['ishucommunication','ISHU COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['jagdamba','JAGDAMBA MOBILE HUB-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['jagdambamobilehub','JAGDAMBA MOBILE HUB-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['jaiambeyent','JAI AMBEY COMMUNICATION ENTERPRISES-DADRI-GREATER NOIDA-UP WEST'],
    ['jaiambeyenterprises','JAI AMBEY COMMUNICATION ENTERPRISES-DADRI-GREATER NOIDA-UP WEST'],
    ['jaiambeycommunicationenterprises','JAI AMBEY COMMUNICATION ENTERPRISES-DADRI-GREATER NOIDA-UP WEST'],
    ['jaiambeent','JAI AMBEY COMMUNICATION ENTERPRISES-DADRI-GREATER NOIDA-UP WEST'],
    ['jrb','JRB TELECOM-KASNA-GREATER NOIDA-UP WEST'],
    ['jrbtelecom','JRB TELECOM-KASNA-GREATER NOIDA-UP WEST'],
    ['jaiambeycom','JAI AMBEY COMMUNICATION-DADRI-GREATER NOIDA-UP WEST'],
    ['jaiambeycommunication','JAI AMBEY COMMUNICATION-DADRI-GREATER NOIDA-UP WEST'],
    ['jaiambecom','JAI AMBEY COMMUNICATION-DADRI-GREATER NOIDA-UP WEST'],
    ['jmd','JMD MOBILE SHOP-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['jmdmobile','JMD MOBILE SHOP-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['jmdmobileshop','JMD MOBILE SHOP-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['kgn','K G N COMMUNICATION-SECTOR 87-GREATER NOIDA-UP WEST'],
    ['kgncom','K G N COMMUNICATION-SECTOR 87-GREATER NOIDA-UP WEST'],
    ['kgncommunication','K G N COMMUNICATION-SECTOR 87-GREATER NOIDA-UP WEST'],
    ['kanika','KANIKA COMMUNICATION-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['kanikacommunication','KANIKA COMMUNICATION-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['kashish','KASHISH COMMUNICATION-KULESARA-GREATER NOIDA-UP WEST'],
    ['kashishcommunication','KASHISH COMMUNICATION-KULESARA-GREATER NOIDA-UP WEST'],
    ['kgad','KGAD MOBIWORLD-GEJHA-GREATER NOIDA-UP WEST'],
    ['kgadmobiworld','KGAD MOBIWORLD-GEJHA-GREATER NOIDA-UP WEST'],
    ['krishna','KRISHNA TELECOM-RAMPUR-GREATER NOIDA-UP WEST'],
    ['krishnatelecom','KRISHNA TELECOM-RAMPUR-GREATER NOIDA-UP WEST'],
    ['keshav','KESHAV MOBILE POINT-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['keshavmobilepoint','KESHAV MOBILE POINT-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['lk','L K MOBILE POINT-KASNA-GREATER NOIDA-UP WEST'],
    ['lkmobilepoint','L K MOBILE POINT-KASNA-GREATER NOIDA-UP WEST'],
    ['mr','M R COMMUNICATION-KASNA-GREATER NOIDA-UP WEST'],
    ['mrcom','M R COMMUNICATION-KASNA-GREATER NOIDA-UP WEST'],
    ['mrcommunication','M R COMMUNICATION-KASNA-GREATER NOIDA-UP WEST'],
    // ['ms','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['mscom','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['msdivinecom','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['msdivine','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['msdivinecommunication','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['mscommunication','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['mahalaxmip','MAHALAXMI MOBILE POINT-DADRI-GREATER NOIDA-UP WEST'],
    ['mahalaxmimobilepoint','MAHALAXMI MOBILE POINT-DADRI-GREATER NOIDA-UP WEST'],
    ['mahalaxmipoint','MAHALAXMI MOBILE POINT-DADRI-GREATER NOIDA-UP WEST'],
    ['mahalaxmis','MAHALAXMI MOBILE STORE-DADRI-GREATER NOIDA-UP WEST'],
    ['mahalaxmimobilestore','MAHALAXMI MOBILE STORE-DADRI-GREATER NOIDA-UP WEST'],
    ['mahalaxmistore','MAHALAXMI MOBILE STORE-DADRI-GREATER NOIDA-UP WEST'],
    ['matrix','MATRIX NETWORK MOBILE STORE-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['matrixmobilestore','MATRIX NETWORK MOBILE STORE-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['hotspot','MOBILE HOTSPOT-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['mobilehotspot','MOBILE HOTSPOT-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['mobilehotspot','MOBILE HOTSPOT-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['shingar','MOBILE SHINGAR-DADRI-GREATER NOIDA-UP WEST'],
    ['shinghar','MOBILE SHINGAR-DADRI-GREATER NOIDA-UP WEST'],
    ['mobileshingar','MOBILE SHINGAR-DADRI-GREATER NOIDA-UP WEST'],
    ['solution','MOBILE SOLUTION-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['mobilesolution','MOBILE SOLUTION-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['mobileworld','MOBILE WORLD-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['world','MOBILE WORLD-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['mobileplaza','M S MOBILE PLAZA-DADRI-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['msmobileplaza','M S MOBILE PLAZA-DADRI-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['newlavish','NEW LAVISH COMM AND MOBILE WORLD-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['newlavishcom','NEW LAVISH COMM AND MOBILE WORLD-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['lavish','NEW LAVISH COMM AND MOBILE WORLD-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['newradhey','NEW RADHEY ELECTRONICS AND MOBILE CENTER-DADRI-GREATER NOIDA-UP WEST'],
    ['radhey','NEW RADHEY ELECTRONICS AND MOBILE CENTER-DADRI-GREATER NOIDA-UP WEST'],
    ['newrajdeep','NEW RAJDEEP MOBILE POINT-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['newrajdeepmobilepoint','NEW RAJDEEP MOBILE POINT-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['newuniversal','NEW UNIVERSAL OFFICE SYSTEM-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['newuniversalofficesystem','NEW UNIVERSAL OFFICE SYSTEM-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['noble','NOBLE MOBILE SHOPE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['nobel','NOBLE MOBILE SHOPE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['noblemobileshope','NOBLE MOBILE SHOPE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['noor','NOOR COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['noorcom','NOOR COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['om','OM COMMUNICATION-KULESARA-GREATER NOIDA-UP WEST'],
    ['omcom','OM COMMUNICATION-KULESARA-GREATER NOIDA-UP WEST'],
    ['omsai','OM SAI COMMUNICATION-HALDONI MODE-GREATER NOIDA-UP WEST'],
    ['omsaicom','OM SAI COMMUNICATION-HALDONI MODE-GREATER NOIDA-UP WEST'],
    ['pandey','PANDEY COMMUNICATION-SECTOR 87-GREATER NOIDA-UP WEST'],
    ['pandeycom','PANDEY COMMUNICATION-SECTOR 87-GREATER NOIDA-UP WEST'],
    ['pooja','POOJA COMMUNICATION-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['poojacom','POOJA COMMUNICATION-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['praveen2','PRAVEEN MOBILE CENTER 2-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['praveen-2','PRAVEEN MOBILE CENTER 2-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['praveenmobilecenter2','PRAVEEN MOBILE CENTER 2-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['praveen','PRAVEEN MOBILE CENTRE-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['praveen1','PRAVEEN MOBILE CENTRE-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['praveensurajpur','PRAVEEN MOBILE CENTRE-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['praveenmobilecenter','PRAVEEN MOBILE CENTRE-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['priyanka','PRIYANKA MOBILE WORLD-HALDONI MODE-GREATER NOIDA-UP WEST'],
    ['priyankamobileworld','PRIYANKA MOBILE WORLD-HALDONI MODE-GREATER NOIDA-UP WEST'],
    ['prince','PRINCE ENTERPIRESE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['princeent','PRINCE ENTERPIRESE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['rk','R K TELECOM-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['rktelecom','R K TELECOM-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['rahul','RAHUL TELECOM-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['rahultelecom','RAHUL TELECOM-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['rana','RANA ENTERPRISES-DADRI-GREATER NOIDA-UP WEST'],
    ['ranaent','RANA ENTERPRISES-DADRI-GREATER NOIDA-UP WEST'],
    ['rajdeep','RAJDEEP MOBILE POINT-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['rajdeepmobilepoint','RAJDEEP MOBILE POINT-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['royal','ROYAL MOBILE HOUSE AND ELECTRONICS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['royalmobilehouseandelectronics','ROYAL MOBILE HOUSE AND ELECTRONICS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['sn','S N COMMUNICATION-KULESARA-GREATER NOIDA-UP WEST'],
    ['sncom','S N COMMUNICATION-KULESARA-GREATER NOIDA-UP WEST'],
    ['sm','S M TRADER-KASNA-GREATER NOIDA-UP WEST'],
    ['smtrader','S M TRADER-KASNA-GREATER NOIDA-UP WEST'],
    ['sachin','SACHIN TELECOM AND MOBILE SHOP-DADRI-GREATER NOIDA-UP WEST'],
    ['sachintelecomandmobileshop','SACHIN TELECOM AND MOBILE SHOP-DADRI-GREATER NOIDA-UP WEST'],
    ['sanchar','SANCHAR BHAWAN-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['sancharbhawan','SANCHAR BHAWAN-AICHER MARKET-GREATER NOIDA-UP WEST'],
    ['satnam','SATNAM MOBILE STORE-KULESARA-GREATER NOIDA-UP WEST'],
    ['satnammobilestore','SATNAM MOBILE STORE-KULESARA-GREATER NOIDA-UP WEST'],
    ['shivshakti','SHIV SHAKTI ELECTRONICS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shivshaktielectronics','SHIV SHAKTI ELECTRONICS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shivtraders','SHIV TRADERS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shivsurajpur','SHIV TRADERS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shreebaba','SHREE BABA COMMUNICATION-KASNA-GREATER NOIDA-UP WEST'],
    ['baba','SHREE BABA COMMUNICATION-KASNA-GREATER NOIDA-UP WEST'],
    ['shreebabacom','SHREE BABA COMMUNICATION-KASNA-GREATER NOIDA-UP WEST'],
    ['shreebalajicom','SHREE BALAJI COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shreebalajisurajpur','SHREE BALAJI COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shreebalajicommunication','SHREE BALAJI COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['shreebalajicenter','SHREE BALAJI MOBILE CENTER-KASNA-GREATER NOIDA-UP WEST'],
    ['shreebalajimobilecentre','SHREE BALAJI MOBILE CENTER-KASNA-GREATER NOIDA-UP WEST'],
    ['shreebalajikasna','SHREE BALAJI MOBILE CENTER-KASNA-GREATER NOIDA-UP WEST'],
    ['shreeram','SHREE RAM MOBILE GALLERY-DADRI-GREATER NOIDA-UP WEST'],
    ['shreerammobilegallery','SHREE RAM MOBILE GALLERY-DADRI-GREATER NOIDA-UP WEST'],
    ['shrisahibji','SHRI SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['shrisahib','SHRI SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['sahib','SHRI SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['shrisahibjimobilesolution','SHRI SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['shrisahibji2','SHRIB SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['shrisahib2','SHRIB SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['sahib2','SHRIB SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['shrisahibjimobilesolution2','SHRIB SAHIB JI MOBILE SOLUTION-DADRI-GREATER NOIDA-UP WEST'],
    ['sony','SONY ELECTRONICS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['sonyelectronics','SONY ELECTRONICS-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['star','STAR TELECOM CENTER-GEJHA-GREATER NOIDA-UP WEST'],
    ['startelecom','STAR TELECOM CENTER-GEJHA-GREATER NOIDA-UP WEST'],
    ['susshma','SUSSHMA MOBILE POINT-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['sushma','SUSSHMA MOBILE POINT-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['susshmamobilepoint','SUSSHMA MOBILE POINT-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['sandeep','SANDEEP TELECOM-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['sandeeptelecom','SANDEEP TELECOM-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['sanjay','SANJAY COMMUNICATION-GEJHA-GREATER NOIDA-UP WEST'],
    ['sanjaycom','SANJAY COMMUNICATION-GEJHA-GREATER NOIDA-UP WEST'],
    ['shyamlal','SHYAM LAL AND SONS-DADRI-GREATER NOIDA-UP WEST'],
    ['shyamlalandsons','SHYAM LAL AND SONS-DADRI-GREATER NOIDA-UP WEST'],
    ['shyam','SHYAM LAL AND SONS-DADRI-GREATER NOIDA-UP WEST'],
    ['sc','S C PHONE PLAZA-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['scphone','S C PHONE PLAZA-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['scplaza','S C PHONE PLAZA-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['scphoneplaza','S C PHONE PLAZA-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['tomar','TOMAR ELECTRONICS-SECTOR 141-GREATER NOIDA-UP WEST'],
    ['tomarelectronics','TOMAR ELECTRONICS-SECTOR 141-GREATER NOIDA-UP WEST'],
    ['tanish','TANISH TELECOM-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['tanishq','TANISH TELECOM-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['tanishtelecom','TANISH TELECOM-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['mobilelife','THE MOBILE LIFE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['life','THE MOBILE LIFE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['themobilelife','THE MOBILE LIFE-GREATER NOIDA-GREATER NOIDA-UP WEST'],
    ['universal','UNIVERSAL MOBILE CAFE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['cafe','UNIVERSAL MOBILE CAFE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['universalmobilecafe','UNIVERSAL MOBILE CAFE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['universalcafe','UNIVERSAL MOBILE CAFE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['vk','V K MOBILE POINT-HALDONI MODE-GREATER NOIDA-UP WEST'],
    ['vkmobilepoint','V K MOBILE POINT-HALDONI MODE-GREATER NOIDA-UP WEST'],
    ['vaishnav','VAISHNAV TELECOM-PARI CHOWK-GREATER NOIDA-UP WEST'],
    ['vaishnavtelecom','VAISHNAV TELECOM-PARI CHOWK-GREATER NOIDA-UP WEST'],
    ['vishal','VISHAL MOBILE HOUSE-GAMMA 1-GREATER NOIDA-UP WEST'],
    ['vikky','VIKKY COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['viky','VIKKY COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['vikkycom','VIKKY COMMUNICATION-SURAJPUR-GREATER NOIDA-UP WEST'],
    ['yash','YASH SANCHAR WORLD-DADRI-GREATER NOIDA-UP WEST'],
    ['yashsanchar','YASH SANCHAR WORLD-DADRI-GREATER NOIDA-UP WEST'],
    ['raja','RAJA MOBILE REPAIRING CENTER-KASNA-GREATER NOIDA-UP WEST'],
    ['rajamobile','RAJA MOBILE REPAIRING CENTER-KASNA-GREATER NOIDA-UP WEST'],
    ['rinku','RINKU MOBILE POINT-DADRI-GREATER NOIDA-UP WEST'],
    ['rinkumobile','RINKU MOBILE POINT-DADRI-GREATER NOIDA-UP WEST'],
    ['anushka2','ANUSHKA MOBILE HOUSE-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['anushkamobilehouse2','ANUSHKA MOBILE HOUSE-SADAR-GAUTAM BUDDHA NAGAR-UP WEST'],
    ['anushkamobilehouse','ANUSHKA MOBILE HOUSE-SADAR-GAUTAM BUDDHA NAGAR-UP WEST']
])

app.get(process.env.uri, (req, res) => {
    let a = nameModel.distinct("PortalName")
    let b = pnameModel.distinct("PortalName")
    let d = fosModel.distinct("FOS")
    temp1=undefined
    temp2=undefined
    temp4=undefined
    temp5=undefined
    Promise.all([a, b ,d]).then((returnedValues) => {
        const [dealer, model, fosd] = returnedValues;
        dealers=dealer
        models=model
        fosds=fosd
        res.render(process.env.h, {
            dealerDetails: dealer,
            modelDetails: model,
            fosDetails: fosds,
            suri:process.env.suri,
            muri:process.env.muri,
            ouri:process.env.ouri,
            auri:process.env.auri,
            duri:process.env.duri,
            mduri:process.env.mduri,
            uri:process.env.uri
        })
    }).catch((error) => {
        console.log(error)
    });
});
app.post(process.env.uri, upload.single('file'), (req, res) => {
    var cnt=0;
    var object=[]
    const workbook = xlsx.readFile(req.file.path);
    const sheets = workbook.SheetNames;
    for (const sheetName of sheets) {
        if(sheetName==="PORTALSTOCK"){
            var objct1=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to1={}
                temp = parseFloat(sheetData[i]["IMEI 1"])
                to1["IMEI"] = temp;
                to1["Model"]=sheetData[i]["Product Model"]
                to1["Distributor"]=sheetData[i]["business customers"]
                to1["VerificationTime"]=null
                objct1.push(to1)
            }
            imeiModel.deleteMany({})
                .then(()=>{
                    imeiModel.insertMany(objct1)
                        .then(()=>{
                            console.log('PortalStockSuccess')
                            cnt++;
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct portal stock")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="SALE"){
            var objct2=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                if(sheetData[i]["Client Name"]==="JAI AMBEY COMMUNICATION-DADRI-GREATER NOIDA-UP WEST"||sheetData[i]["Client Name"]==="JAI AMBEY COMMUNICATION ENTERPRISES-DADRI-GREATER NOIDA-UP WEST"||sheetData[i]["Client Name"]==="JAI AMBEY COMMUNICATION -2 (DADRI) (OPPO)"||sheetData[i]["Client Name"]==="ANUSKA MOBILE CENTER-AICHER MARKET-GREATER NOIDA-UP WEST"||sheetData[i]["Client Name"]==="ANUSHKA MOBILE HOUSE-SADAR-GAUTAM BUDDHA NAGAR-UP WEST"){continue}
                var to2={}
                temp = parseFloat(sheetData[i]["Sales Volume-Verification"])
                to2["CNT"] = temp;
                to2["Model"]=sheetData[i]["Marketing Name"]
                to2["Distributor"]=sheetData[i]["Client Name"]
                objct2.push(to2)
            }
            actualSaleModel.deleteMany({})
                .then(()=>{
                    actualSaleModel.insertMany(objct2)
                        .then(()=>{
                            console.log('RegisterSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct sale")
                        })
                })
                .catch((err)=>{
                    
                })
        }
        else if(sheetName==="ACTIVATION"){
            var objct3=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to3={}
                temp = parseFloat(sheetData[i]["IMEI"])
                to3["IMEI"] = temp;
                to3["Model"]=sheetData[i]["Goods Version"]
                to3["Distributor"]=sheetData[i]["business customers"]
                objct3.push(to3)
            }
            activationModel.deleteMany({})
                .then(()=>{
                    activationModel.insertMany(objct3)
                        .then(()=>{
                            console.log('ActivationSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct activation")
                        })
                })
                .catch((err)=>{
                    
                })
        }
        else if(sheetName==="SCAN"){
            var objct4=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to4={}
                to4["IMEI"] = parseFloat(sheetData[i]["IMEI NO"])
                to4["Model"]=sheetData[i]["MODEL"]
                to4["Distributor"]=sheetData[i]["Located Warehouse/Store"]
                objct4.push(to4)
            }
            scanModel.deleteMany({})
                .then(()=>{
                    scanModel.insertMany(objct4)
                        .then(()=>{
                            console.log('ScanSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct scan data")
                        })
                })
                .catch((err)=>{
                    
                })
        }
        else if(sheetName==="WAREHOUSESTOCK"){
            var objct5=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to5={}
                to5["Model"] = sheetData[i]['MODEL']
                to5["Color"]=sheetData[i]["COLOUR"]
                if(sheetData[i]['CLSOING STOCK']==''){
                    sheetData[i]['CLSOING STOCK']='0'
                }
                to5["Stock"]=parseFloat(sheetData[i]['CLSOING STOCK'])
                objct5.push(to5)
            }
            stockModel.deleteMany({})
                .then(()=>{
                    stockModel.insertMany(objct5)
                        .then(()=>{
                            console.log('WarehouseStockSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct warehouse stock")
                        })
                })
                .catch((err)=>{
                    
                })
        }
        else if(sheetName==="TALLYOUTSTANDING"){
            var objct6=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                const index=objct6.findIndex(obj => obj.Distributor===sheetData[i]["Dealer"])
                if(index==-1){
                    var to6={}
                    to6["Distributor"]=sheetData[i]["Dealer"]
                    var a=sheetData[i]["Debit"]
                    var b=sheetData[i]["Credit"]
                    if(a==undefined){
                        to6["Outstanding"]=-1*parseInt(b)
                    }
                    else{
                        to6["Outstanding"]=parseInt(a)
                    }
                    objct6.push(to6)
                }
                else{
                    var a=sheetData[i]["Debit"]
                    var b=sheetData[i]["Credit"]
                    if(a==undefined){
                        objct6[index]["Outstanding"]+=(-1*parseInt(b))
                    }
                    else{
                        objct6[index]["Outstanding"]+=parseInt(a)
                    }
                }
            }
            outstandingModel.deleteMany({})
                .then(()=>{
                    outstandingModel.insertMany(objct6)
                        .then(()=>{
                            console.log('TallyOutstandingSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct tally outstanding")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="CHEQUE"){
            var objct7=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to7={}
                to7["Distributor"]=sheetData[i]["DEALER"]
                if(sheetData[i]["CHQ AMOUNT"]==undefined){
                    sheetData[i]["CHQ AMOUNT"]='0'
                }
                to7["Chq"]=parseFloat(sheetData[i]["CHQ AMOUNT"])
                objct7.push(to7)
            }
            chqModel.deleteMany({})
                .then(()=>{
                    chqModel.insertMany(objct7)
                        .then(()=>{
                            console.log('ChequeSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct cheque data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="PREVMONTHSALE"){
            var objct8=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to8={}
                to8["Distributor"]=sheetData[i]["Row Labels"]
                to8["SALE"]=parseFloat(sheetData[i]["QTY"])
                objct8.push(to8)
            }
            prevModel.deleteMany({})
                .then(()=>{
                    prevModel.insertMany(objct8)
                        .then(()=>{
                            console.log('PrevMonthSaleSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct prev month sale")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="FOS"){
            var objct9=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to9={}
                to9["Distributor"]=sheetData[i]["Distributor"]
                to9["FOS"]=sheetData[i]["FOS"]
                objct9.push(to9)
            }
            fosModel.deleteMany({})
                .then(()=>{
                    fosModel.insertMany(objct9)
                        .then(()=>{
                            console.log('FosSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct fos data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="CLASS"){
            var objct10=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to10={}
                to10["Distributor"]=sheetData[i]["Row Labels"]
                to10["CLASS"]=sheetData[i]["CLASS"]
                objct10.push(to10)
            }
            classModel.deleteMany({})
                .then(()=>{
                    classModel.insertMany(objct10)
                        .then(()=>{
                            console.log('ClassSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct class data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="LIMITS"){
            var objct11=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to11={}
                to11["Distributor"]=sheetData[i]["DEALER NAME"]
                to11["Limit"]=sheetData[i]["LIMITS"]
                objct11.push(to11)
            }
            limitModel.deleteMany({})
                .then(()=>{
                    limitModel.insertMany(objct11)
                        .then(()=>{
                            console.log('LimitSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct limit data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="NAMECOMPATABLE"){
            var objct12=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to12={}
                to12["TallyName"]=sheetData[i]["Tally"]
                to12["PortalName"]=sheetData[i]["Portal"]
                objct12.push(to12)
            }
            nameModel.deleteMany({})
                .then(()=>{
                    nameModel.insertMany(objct12)
                        .then(()=>{
                            console.log('NameCompatableSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct name compatable data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="DP"){
            var objct131=[],objct132=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to131={},to132={}
                to131["Model"]=sheetData[i]["Model"]
                to131["DP"]=sheetData[i]["DP"]
                to132["TallyName"]=sheetData[i]["SALE"]
                to132["PortalName"]=sheetData[i]["Model"]
                objct131.push(to131)
                objct132.push(to132)
            }
            Promise.all([priceModel.deleteMany({}),pnameModel.deleteMany({})])
                .then(()=>{
                    Promise.all([priceModel.insertMany(objct131),pnameModel.insertMany(objct132)])
                        .then(()=>{
                            console.log('DPSuccess && ModelNameSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct dp data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="15DAYSOUTSTANDING"){
            var objct14=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to14={}
                to14["Distributor"]=sheetData[i]["Dealer"]
                if(sheetData[i]["OVERDUE 15DAYS"]==undefined){
                    sheetData[i]["OVERDUE 15DAYS"]='0'
                }
                to14["Overdue"]=parseFloat(sheetData[i]["OVERDUE 15DAYS"])
                objct14.push(to14)
            }
            ovdModel.deleteMany({})
                .then(()=>{
                    ovdModel.insertMany(objct14)
                        .then(()=>{
                            console.log('OverdueSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                var arrobj=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI 1"]
                                    var mo=object[i]["Product Model"]
                                    var rem=object[i]["REMARKS"]
                                    if(rem=="IN STOCK"){
                                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                                            {
                                                $set:{
                                                    "Distributor":dist
                                                }
                                            }
                                        ))
                                    }
                                    else{
                                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                                        if(foundObject){
                                            foundObject.cnt+=1;
                                        }
                                        else{
                                            arrobj.push({name:dist,model:mo,cnt:1})
                                        }
                                    }
                                }
                                pnameModel.find({}).then((val)=>{
                                    for(var i=0;i<arrobj.length;i++){
                                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                                            {
                                                $inc:{
                                                    "CNT":arrobj[i].cnt
                                                }
                                            },{ upsert: true }
                                        ))
                                    }
                                    Promise.all(updatearr).then(()=>{
                                        console.log("Completed")
                                        console.log(new Date())
                                        res.redirect(process.env.uri);
                                    }).catch((err)=>{
                                        console.log("Re Upload the correct REUPLOADING file")
                                    })
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct 15 days overdue data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="OTHERUPLOADING"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to15={}
                to15["Distributor"]=sheetData[i]["Distributor"]
                to15["Product Model"]=sheetData[i]["Product Model"]
                to15["REMARKS"]=sheetData[i]["REMARKS"]
                to15["IMEI 1"]=parseFloat(sheetData[i]["IMEI 1"])
                object.push(to15)
            }
            cnt++;
            if(cnt==15){
                var updatearr=[]
                var arrobj=[]
                for(var i=0;i<object.length;i++){
                    var dist=object[i]["Distributor"]
                    var im=object[i]["IMEI 1"]
                    var mo=object[i]["Product Model"]
                    var rem=object[i]["REMARKS"]
                    if(rem=="IN STOCK"){
                        updatearr.push(imeiModel.updateOne({"IMEI":im},
                            {
                                $set:{
                                    "Distributor":dist
                                }
                            }
                        ))
                    }
                    else{
                        const foundObject=arrobj.find(obj=>obj.name===dist && obj.model===mo);
                        if(foundObject){
                            foundObject.cnt+=1;
                        }
                        else{
                            arrobj.push({name:dist,model:mo,cnt:1})
                        }
                    }
                }
                pnameModel.find({}).then((val)=>{
                    for(var i=0;i<arrobj.length;i++){
                        const foundObject=val.find(obj=>obj.PortalName===arrobj[i].model)
                        updatearr.push(actualSaleModel.updateOne({"Distributor":arrobj[i].name,"Model":foundObject.TallyName},
                            {
                                $inc:{
                                    "CNT":arrobj[i].cnt
                                }
                            },{ upsert: true }
                        ))
                    }
                    Promise.all(updatearr).then(()=>{
                        console.log("Completed")
                        console.log(new Date())
                        res.redirect(process.env.uri);
                    }).catch((err)=>{
                        console.log("Re Upload the correct REUPLOADING file")
                    })
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }
    }
    fs.unlinkSync(req.file.path);
});

app.post(process.env.duri,(req,res)=>{
    const {deal,model,report,fosd}=req.body
    temp1=deal
    temp2=model
    if(report.length==2){
        temp4="sast"
    }
    else{
        temp4=report[0]
    }
    temp5=fosd
})

app.get(process.env.sduri, (req, res) => {
    fosModel.aggregate([
        { $lookup:
          {
            from: 'classrecords',
            localField: 'Distributor',
            foreignField: 'Distributor',
            as: 'Class'
          }
        }
      ],(err,data)=>{
        if(err){
            console.log(err)
        }
        else{ 
            classes=[]
            for(var i=0;i<temp1.length;i++){
                var x=data.find(o=>o.Distributor==temp1[i])
                if(x==undefined){
                    classes.push("tttttt")
                }
                else{
                    classes.push(x.Class[0].CLASS)
                }
            }
            dealobj=[]
            for(var i=0;i<temp1.length;i++){
                if(classes[i]=="tttttt"){
                    dealobj.push({dealer:temp1[i],class:''})
                }
                else{
                    dealobj.push({dealer:temp1[i],class:classes[i]})
                }
            }
            dealobj.sort(function(a,b){
                return classobj.indexOf(a.class)-classobj.indexOf(b.class);
            })
            for(var i=0;i<temp1.length;i++){
                temp1[i]=dealobj[i].dealer
            }
            pnameModel.find({}).then((val)=>{
                t=[]
                t.push(imeiModel.distinct("Distributor"))
                t.push(imeiModel.distinct("Model"))
                t.push(fosModel.distinct("FOS"))
                for(var i=0;i<temp1.length;i++){
                    for(var j=0;j<temp2.length;j++){
                        const foundObject=val.find(obj=>obj.PortalName===temp2[j])
                        t.push(imeiModel.distinct('IMEI',imeiModel.find({"Distributor":temp1[i],"Model":temp2[j]})).count())
                        t.push(actualSaleModel.find({"Distributor":temp1[i],"Model":foundObject.TallyName}))
                        t.push(stockModel.find({'Model':temp2[j]}))
                    }
                    t.push(prevModel.distinct('SALE',prevModel.find({'Distributor':temp1[i]})))
                    t.push(fosModel.distinct('FOS',fosModel.find({'Distributor':temp1[i]})))
                    t.push(classModel.distinct('CLASS',classModel.find({'Distributor':temp1[i]})))
                    t.push(imeiModel.find({"Distributor":temp1[i]}).count())
                    t.push(actualSaleModel.find({"Distributor":temp1[i]}))
                }
                Promise.all(t).then((returnedValues) => {
                    var arr = returnedValues;
                    var obj={}
                    var sale=[]
                    var stock=[]
                    var fos=[]
                    var itr=3
                    var tsale=[]
                    var tstock=[]
                    var stockstr=[]
                    for(var i=0;i<temp1.length;i++){
                        var c1=0,c2=0,tc=0
                        for(var j=0;j<temp2.length;j++){
                                var st=arr[itr],sl=arr[itr+1]
                                stock.push(st)
                                var cntr=0
                                for(var k=0;k<sl.length;k++){
                                    cntr+=sl[k].CNT
                                }
                                sale.push(cntr)
                                c1+=st
                                c2+=cntr
                                var str=""
                                for(var k=0;k<arr[itr+2].length;k++){
                                    str+=map.get(arr[itr+2][k].Color)
                                    str+=(arr[itr+2][k].Stock).toString()
                                    str+=' '
                                }
                                stockstr.push(str)
                                itr+=3
                        }
                        var x=data.find(o=>o.Distributor==temp1[i])
                        if(x==undefined){
                            fos.push(arr[itr]+' '+arr[itr+1]+' ')
                        }
                        else{
                            fos.push(arr[itr]+' '+arr[itr+1]+' '+x.Class[0].CLASS)
                        }
                        for(var k=0;k<arr[itr+4].length;k++){
                            tc+=arr[itr+4][k].CNT
                        }
                        tsale.push(tc)
                        tstock.push(arr[itr+3])
                        itr+=5
                    }
                    obj={
                        'dealer':temp1,
                        'model':temp2,
                        'sale':sale,
                        'stock':stock,
                        'fos':fos,
                        'stockstr':stockstr
                    }
                    dd=[]
                    for(var i=0;i<obj['dealer'].length;i++){
                        dd.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":obj['dealer'][i]})))
                    }
                    Promise.all(dd).then((val)=>{
                        names=val
                        res.render(process.env.ssd,{
                            dealerDetails:arr[0],
                            dealerNames:names,
                            modelDetails:arr[1],
                            fosDetails:arr[2],
                            dealer:obj['dealer'],
                            model:obj['model'],
                            sale:sale,
                            stock:stock,
                            fos:obj['fos'],
                            class:classes,
                            type:temp4,
                            selectedfos:temp5,
                            tsale:tsale,
                            tstock:tstock,
                            stockstr:obj['stockstr'],
                            baseurl:process.env.BASE_URL,
                            link:process.env.link
                        })
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((error) => {
                    console.log(error)
                });
            }).catch((err)=>{
                console.log(err)
            })
        }
    })
});

app.get(process.env.mduri,(req,res)=>{
    pnameModel.find({}).then((val)=>{
        var modelreports=[]
        for(var i=0;i<models.length;i++){
            const foundObject=val.find(obj=>obj.PortalName===models[i])
            modelreports.push(actualSaleModel.find({"Model":foundObject.TallyName}))
            modelreports.push(imeiModel.distinct('IMEI',imeiModel.find({"Model":models[i]})).count())
            modelreports.push(foundObject.TallyName)
        }
        Promise.all(modelreports).then((value)=>{
            var modelwise=[]
            var itr=0
            for(var i=0;i<value.length;i+=3){
                var modelobj={}
                modelobj['model']=models[itr]
                itr++
                var cnt=0
                for(var j=0;j<value[i].length;j++){
                    cnt+=value[i][j].CNT
                }
                modelobj['sale']=cnt
                modelobj['stock']=value[i+1]
                modelobj['tally']=value[i+2]
                modelwise.push(modelobj)
            }
            modelwise.sort((a,b)=>{
                return b['sale']-a['sale']
            })
            res.render(process.env.md,{
                dealerDetails:dealers,
                modelDetails:models,
                fosDetails:fosds,
                modelreport:modelwise,
                baseurl:process.env.BASE_URL,
                link:process.env.link
            })
        }).catch((error)=>{
            console.log(error)
        });
    }).catch((error)=>{
        console.log(error)
    });
});

app.get(process.env.oduri,(req,res)=>{
    fosModel.aggregate([
        { $lookup:
          {
            from: 'classrecords',
            localField: 'Distributor',
            foreignField: 'Distributor',
            as: 'Class'
          }
        }
      ],(err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            nameModel.find({},(err,names)=>{
                nameMap=new Map()
                for(var i=0;i<names.length;i++){
                    nameMap.set(names[i].PortalName,names[i].TallyName)
                }
                t=[]
                t.push(nameModel.distinct("PortalName"))
                t.push(imeiModel.distinct('Model'))
                Promise.all(t).then((val)=>{
                    var t1=val[0],t2=val[1]
                    var outstandingreports=[]
                    for(var i=0;i<t1.length;i++){
                        for(var j=0;j<t2.length;j++){
                            outstandingreports.push(imeiModel.find({"Distributor":t1[i],"Model":t2[j]}))
                            outstandingreports.push(scanModel.find({"Distributor":t1[i],"Model":t2[j]}))
                            outstandingreports.push(activationModel.find({"Distributor":t1[i],"Model":t2[j]}))
                            outstandingreports.push(priceModel.distinct('DP',priceModel.find({"Model":t2[j]})))
                        }
                        outstandingreports.push(fosModel.distinct('FOS',fosModel.find({'Distributor':t1[i]})))
                        outstandingreports.push(classModel.distinct('CLASS',classModel.find({'Distributor':t1[i]})))
                        outstandingreports.push(limitModel.distinct('Limit',limitModel.find({'Distributor':t1[i]})))
                        outstandingreports.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':nameMap.get(t1[i])})))
                        outstandingreports.push(chqModel.distinct('Chq',chqModel.find({'Distributor':nameMap.get(t1[i])})))
                        outstandingreports.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':nameMap.get(t1[i])})))
                        if(t1[i]=="S M TRADER-KASNA-GREATER NOIDA-UP WEST"){
                            outstandingreports.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':"BEST GADGETS CENTER (KASNA) (OPPO)"})))
                            outstandingreports.push(chqModel.distinct('Chq',chqModel.find({'Distributor':"BEST GADGETS CENTER (KASNA) (OPPO)"})))
                            outstandingreports.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':"BEST GADGETS CENTER (KASNA) (OPPO)"})))
                        }
                        if(t1[i]=="BALAJI COMMUNICATION-GREATER NOIDA-UP WEST"){
                            outstandingreports.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':"BALAJI COMMUNICATION (SUTHYANA) (OPPO)"})))
                            outstandingreports.push(chqModel.distinct('Chq',chqModel.find({'Distributor':"BALAJI COMMUNICATION (SUTHYANA) (OPPO)"})))
                            outstandingreports.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':"BALAJI COMMUNICATION (SUTHYANA) (OPPO)"})))
                        }
                    }
                    Promise.all(outstandingreports).then((returnedValues) => {
                        var outstd=[]
                        var itr=0
                        var array=returnedValues
                        for(var i=0;i<t1.length;i++){
                            var sum1=0,sum2=0
                            for(var j=0;j<t2.length;j++){
                                var arr1=[]
                                for(var k=0;k<array[itr].length;k++){
                                    arr1.push(array[itr][k].IMEI)
                                }
                                var x=arr1.length
                                for(var k=0;k<array[itr+1].length;k++){
                                    var im=array[itr+1][k].IMEI
                                    if(arr1.includes(im)){
                                        x--;
                                    }
                                }
                                for(var k=0;k<array[itr+2].length;k++){
                                    var im=array[itr+2][k].IMEI
                                    if(arr1.includes(im)){
                                        x--;
                                    }
                                }
                                sum1+=x;
                                sum2+=(x*array[itr+3])
                                itr+=4
                            }
                            if(t1[i]=="S M TRADER-KASNA-GREATER NOIDA-UP WEST"){
                                outstd.push({
                                    'fos':array[itr]+' '+array[itr+1],
                                    'shop':dealers[i],
                                    'limit':(array[itr+2].length==0?0:array[itr+2]),
                                    'outstanding':(array[itr+3].length==0?0:array[itr+3]),
                                    'chq':(array[itr+4].length==0?0:array[itr+4]),
                                    'ovd':(array[itr+5].length==0?0:array[itr+5]),
                                    'qty':sum1,
                                    'price':sum2,
                                    'bestout':(array[itr+6].length==0?0:array[itr+6]),
                                    'bestchq':(array[itr+7].length==0?0:array[itr+7]),
                                    'bestovd':(array[itr+8].length==0?0:array[itr+8])
                                })
                                itr+=9
                            }
                            else if(t1[i]=="BALAJI COMMUNICATION-GREATER NOIDA-UP WEST"){
                                outstd.push({
                                    'fos':array[itr]+' '+array[itr+1],
                                    'shop':dealers[i],
                                    'limit':(array[itr+2].length==0?0:array[itr+2]),
                                    'outstanding':(array[itr+3].length==0?0:array[itr+3]),
                                    'chq':(array[itr+4].length==0?0:array[itr+4]),
                                    'ovd':(array[itr+5].length==0?0:array[itr+5]),
                                    'qty':sum1,
                                    'price':sum2,
                                    'balajiout':(array[itr+6].length==0?0:array[itr+6]),
                                    'balajichq':(array[itr+7].length==0?0:array[itr+7]),
                                    'balajiovd':(array[itr+8].length==0?0:array[itr+8])
                                })
                                itr+=9
                            }
                            else{
                                outstd.push({
                                    'fos':array[itr]+' '+array[itr+1],
                                    'shop':dealers[i],
                                    'limit':(array[itr+2].length==0?0:array[itr+2]),
                                    'outstanding':(array[itr+3].length==0?0:array[itr+3]),
                                    'chq':(array[itr+4].length==0?0:array[itr+4]),
                                    'ovd':(array[itr+5].length==0?0:array[itr+5]),
                                    'qty':sum1,
                                    'price':sum2,
                                })
                                itr+=6
                            }
                        }
                        outstd.sort((a,b)=>{
                            return classobj.indexOf(a.fos.split(' ')[1])-classobj.indexOf(b.fos.split(' ')[1]);
                        })
                        dd=[]
                        for(var i=0;i<outstd.length;i++){
                            dd.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":outstd[i]['shop']})))
                        }
                        Promise.all(dd).then((val)=>{
                            names=val
                            res.render(process.env.od,{
                                dealerDetails:dealers,
                                modelDetails:models,
                                fosDetails:fosds,
                                outstanding:outstd,
                                dealerNames:names,
                                model:temp2,
                                selectedfos:temp5,
                                baseurl:process.env.BASE_URL,
                                link:process.env.link
                            })
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }).catch((error) => {
                        console.log(error)
                    });
                }).catch((error) => {
                    console.log(error)
                });
            })     
        }
    })
});


app.get(process.env.aduri,(req,res)=>{
    t=[]
    t.push(nameModel.distinct("PortalName"))
    t.push(imeiModel.distinct('Model'))
    Promise.all(t).then((val)=>{
        var t1=val[0],t2=val[1]
        var outstandingreports=[]
        for(var i=0;i<t1.length;i++){
            for(var j=0;j<t2.length;j++){
                outstandingreports.push(activationModel.find({"Distributor":t1[i],"Model":t2[j]}).count())
            }
            outstandingreports.push(fosModel.distinct('FOS',fosModel.find({'Distributor':t1[i]})))
            outstandingreports.push(classModel.distinct('CLASS',classModel.find({'Distributor':t1[i]})))
        }
        Promise.all(outstandingreports).then((returnedValues) => {
            var outstd=[]
            var dd=[]
            var itr=0
            var array=returnedValues
            var flags=[]
            for(var i=0;i<t2.length;i++){
                flags.push(false)
            }
            for(var i=0;i<t1.length;i++){
                var cnt=[]
                var zero=false
                for(var j=0;j<t2.length;j++){
                    var temp=array[itr]
                    itr+=1
                    if(temp>0){
                        flags[j]=true;
                        zero=true;
                    }
                    cnt.push(temp)
                }
                dd.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":dealers[i]})))
                outstd.push({
                    'fos':array[itr]+' '+array[itr+1],
                    'shop':dealers[i],
                    'model':t2,
                    'cnt':cnt,
                    'isZero':zero,
                })
                itr+=2
            }
            Promise.all(dd).then((val)=>{
                names=val
                res.render(process.env.ad,{
                    modelDetails:t2,
                    outstanding:outstd,
                    dealerNames:names,
                    flag:flags,
                    baseurl:process.env.BASE_URL,
                    img:process.env.img,
                    link:process.env.link
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((error) => {
            console.log(error)
        });
    }).catch((error) => {
        console.log(error)
    });
});

app.get(process.env.suri,(req,res)=>{
    dd=[]
    for(var i=0;i<dealers.length;i++){
        dd.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":dealers[i]})))
    }
    Promise.all(dd).then((val)=>{
        names=val
        res.render(process.env.ss,{
            dealerDetails:dealers,
            dealerNames:names,
            modelDetails:models,
            fosDetails:fosds,
            dealer:temp1,
            model:temp2,
            type:temp4,
            selectedfos:temp5,
            baseurl:process.env.BASE_URL,
            suri:process.env.suri,
            muri:process.env.muri,
            ouri:process.env.ouri,
            auri:process.env.auri,
            duri:process.env.duri,
            sduri:process.env.sduri,
            uri:process.env.uri
        })
    }).catch((err)=>{
        console.log(err)
    })
})

app.get(process.env.muri,(req,res)=>{
    res.render(process.env.m,{
        baseurl:process.env.BASE_URL,
        suri:process.env.suri,
        muri:process.env.muri,
        ouri:process.env.ouri,
        auri:process.env.auri,
        duri:process.env.duri,
        mduri:process.env.mduri,
        uri:process.env.uri
    })
})

app.get(process.env.ouri,(req,res)=>{
    res.render(process.env.o,{
        baseurl:process.env.BASE_URL,
        suri:process.env.suri,
        muri:process.env.muri,
        ouri:process.env.ouri,
        auri:process.env.auri,
        duri:process.env.duri,
        oduri:process.env.oduri,
        uri:process.env.uri
    })
})

app.get(process.env.auri,(req,res)=>{
    res.render(process.env.a,{
        baseurl:process.env.BASE_URL,
        suri:process.env.suri,
        muri:process.env.muri,
        ouri:process.env.ouri,
        auri:process.env.auri,
        duri:process.env.duri,
        aduri:process.env.aduri,
        uri:process.env.uri
    })
})

var pad=(str,len)=>{
    for(var i=1;i<=len;i++){
        str+=' '
    }
    return str
}

var numbers=['whatsapp:+917303470338','whatsapp:+919540968282','whatsapp:+918802822097','whatsapp:+919958448848','whatsapp:+919810143424','whatsapp:+918860024618','whatsapp:+918700698315']

app.post(process.env.wl, (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const messageBody = req.body.Body;
    const fromNumber = req.body.From;
    var dlr=messageBody.toLowerCase()
    var mapper=new Map()
    var date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' });
    var time=new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });
    var [hour,min]=time.split(':');
    hour=parseInt(hour)
    min=parseInt(min)
    hour=hour%24
    min=min%60
    console.log(fromNumber)
    var flag=false
    for(var i=0;i<numbers.length;i++){
        if(fromNumber==numbers[i]){
            flag=true;
            break;
        }
    }
    if(flag==true){
        if((hour>=0&&hour<11)||(hour==11&&min<45)){
            var msg="Today's data will be updated by 11:45am";
            client.messages.create({
                from: process.env.NO,
                to: fromNumber,
                body: msg
            }).then(message => {
                console.log('Message sent:', message.sid);
                res.end(twiml.toString());
            }).catch(error => {
                console.error('Error sending message:', error);
                res.status(500).end();
            });
        }
        else{
            dlr=dlr.split(' ').join('')
            dlr=stringSimilarity.findBestMatch(dlr,Array.from(dummy.keys())).bestMatch.target
            dlr=dummy.get(dlr)
            nameModel.find({},(err,names)=>{
                nameMap=new Map()
                for(var i=0;i<names.length;i++){
                    nameMap.set(names[i].PortalName,names[i].TallyName)
                }
                var t=[]
                t.push(imeiModel.find({"Distributor":dlr}).count())
                t.push(imeiModel.distinct("Distributor"))
                t.push(imeiModel.distinct('Model'))
                Promise.all(t).then((v)=>{
                    var outreport=[]
                    var models=v[2]
                    pnameModel.find({}).then((val)=>{
                        var namereport=[],ni=0
                        for(var i=0;i<v[2].length;i++){
                            const foundObject=val.find(obj=>obj.PortalName===v[2][i])
                            outreport.push(imeiModel.find({"Distributor":dlr,"Model":v[2][i]}))
                            outreport.push(scanModel.find({"Distributor":dlr,"Model":v[2][i]}))
                            outreport.push(activationModel.find({"Distributor":dlr,"Model":v[2][i]}))
                            outreport.push(actualSaleModel.find({"Distributor":dlr,"Model":foundObject.TallyName}))
                            outreport.push(priceModel.distinct('DP',priceModel.find({"Model":v[2][i]})))
                            namereport.push(foundObject.TallyName)
                        }
                        outreport.push(fosModel.distinct('FOS',fosModel.find({'Distributor':dlr})))
                        outreport.push(classModel.distinct('CLASS',classModel.find({'Distributor':dlr})))
                        outreport.push(limitModel.distinct('Limit',limitModel.find({'Distributor':dlr})))
                        outreport.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':nameMap.get(dlr)})))
                        outreport.push(chqModel.distinct('Chq',chqModel.find({'Distributor':nameMap.get(dlr)})))
                        outreport.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':nameMap.get(dlr)})))
                        outreport.push(prevModel.distinct('SALE',prevModel.find({'Distributor':dlr})))
                        if(dlr=="S M TRADER-KASNA-GREATER NOIDA-UP WEST"){
                            outreport.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':"BEST GADGETS CENTER (KASNA) (OPPO)"})))
                            outreport.push(chqModel.distinct('Chq',chqModel.find({'Distributor':"BEST GADGETS CENTER (KASNA) (OPPO)"})))
                            outreport.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':"BEST GADGETS CENTER (KASNA) (OPPO)"})))
                        }
                        if(dlr=="BALAJI COMMUNICATION-GREATER NOIDA-UP WEST"){
                            outreport.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':"BALAJI COMMUNICATION (SUTHYANA) (OPPO)"})))
                            outreport.push(chqModel.distinct('Chq',chqModel.find({'Distributor':"BALAJI COMMUNICATION (SUTHYANA) (OPPO)"})))
                            outreport.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':"BALAJI COMMUNICATION (SUTHYANA) (OPPO)"})))
                        }
                        Promise.all(outreport).then((value)=>{
                            var itr=0,maxmodel=5
                            var sum1=0,sum2=0,tstk=0,tsal=0
                            var ssarr=[],inarr=[]
                            for(var i=0;i<models.length;i++){
                                var arr1=[]
                                for(var k=0;k<value[itr].length;k++){
                                    arr1.push(value[itr][k].IMEI)
                                }
                                var x=arr1.length,tcnt=0
                                for(var k=0;k<value[itr+1].length;k++){
                                    var im=value[itr+1][k].IMEI
                                    if(arr1.includes(im)){
                                        x--;
                                    }
                                }
                                for(var k=0;k<value[itr+2].length;k++){
                                    var im=value[itr+2][k].IMEI
                                    if(arr1.includes(im)){
                                        x--;
                                        tcnt+=1;
                                    }
                                }
                                var cnt=0
                                for(var k=0;k<value[itr+3].length;k++){
                                    cnt+=value[itr+3][k].CNT
                                }
                                var name=models[i].split(' ').join('').substr(4)
                                name=name.split('(')[0]+' '+name.split('(')[1].split('+')[0]+','+name.split('(')[1].split('+')[1].split('G')[0]
                                if(x!=0||value[itr+4]!=0){
                                    if(inarr.includes(namereport[ni])){
                                        ssarr.push({
                                            "model":name,
                                            "stock":x+tcnt,
                                            "sale":0
                                        })
                                        tstk+=(x+tcnt);
                                    }
                                    else{
                                        ssarr.push({
                                            "model":name,
                                            "stock":x+tcnt,
                                            "sale":cnt
                                        })
                                        tstk+=(x+tcnt);
                                        tsal+=cnt
                                        inarr.push(namereport[ni])
                                    }
                                    if(maxmodel<name.length){
                                        maxmodel=name.length
                                    }
                                }
                                ni++
                                sum1+=x;
                                sum2+=(x*value[itr+4])
                                itr+=5
                            }
                            ssarr.sort((a,b)=>{
                                if(b["sale"]==a["sale"]){
                                    return b["stock"]-a["stock"]
                                }
                                return b["sale"]-a["sale"]
                            })
                            var salestock="+"
                            for(var i=1;i<=maxmodel+8;i++){
                                if(i==maxmodel+1||i==maxmodel+5){
                                    salestock+='+'
                                }
                                else{
                                    salestock+='-'
                                }
                            }
                            salestock+='+\n'
                            salestock+='|'+pad("Model",maxmodel-5)
                            salestock+="|stk|sal|\n+"
                            for(var i=1;i<=maxmodel+8;i++){
                                if(i==maxmodel+1||i==maxmodel+5){
                                    salestock+='+'
                                }
                                else{
                                    salestock+='-'
                                }
                            }
                            salestock+='+\n'
                            console.log(ssarr)
                            for(var i=0;i<ssarr.length;i++){
                                if(ssarr[i]["stock"]==0 && ssarr[i]["sale"]==0){continue}
                                ssarr[i]["model"]=pad(ssarr[i]["model"],maxmodel-ssarr[i]["model"].length)
                                var stock=ssarr[i]["stock"].toString()
                                ssarr[i]["stock"]=pad(stock,3-stock.length)
                                var sale=ssarr[i]["sale"].toString()
                                ssarr[i]["sale"]=pad(sale,3-sale.length)
                                salestock+=('|'+ssarr[i]["model"]+'|'+ssarr[i]["stock"]+'|'+ssarr[i]["sale"]+'|\n')
                            }
                            salestock+='+'
                            for(var i=1;i<=maxmodel+8;i++){
                                if(i==maxmodel+1||i==maxmodel+5){
                                    salestock+='+'
                                }
                                else{
                                    salestock+='-'
                                }
                            }
                            salestock+='+\n|'
                            salestock+=pad("Total",maxmodel-5)
                            salestock+='|'
                            var stkstr=tstk.toString()
                            salestock+=(pad(stkstr,3-stkstr.length))
                            salestock+='|'
                            var salstr=tsal.toString()
                            salestock+=(pad(salstr,3-salstr.length))
                            salestock+='|\n'
                            salestock+='+'
                            for(var i=1;i<=maxmodel+8;i++){
                                if(i==maxmodel+1||i==maxmodel+5){
                                    salestock+='+'
                                }
                                else{
                                    salestock+='-'
                                }
                            }
                            salestock+='+\n'
                            var out=parseFloat((value[itr+3].length==0?0:value[itr+3]))+parseFloat((value[itr+4].length==0?0:value[itr+4]))
                            var gap=parseFloat(out)-parseFloat(sum2)
                            var lastMonth=parseFloat(value[itr+6])
                            var dealerName=[]
                            dealerName.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":dlr})))
                            Promise.all(dealerName).then((val)=>{
                                nm=val
                                var msg
                                if(nm[0][0]=='S.M TRADERS (KASNA) (OPPO)'){
                                    var out1=parseFloat((value[itr+7].length==0?0:value[itr+7]))+parseFloat((value[itr+8].length==0?0:value[itr+8]))
                                    gap+=(parseFloat(out1))
                                    msg='*'+'S.M Traders/Best'+'*'+'\n'+'*Date:* '+date+'\n'+'*T.Outstanding:* '+out.toString()+'+'+value[itr+7].toString()+'\n'+'*Above 15Days:* '+value[itr+5].toString()+'+'+value[itr+9].toString()+'\n'+'*Yesterday Deposit:* '+value[itr+4].toString()+'+'+value[itr+8].toString()+'\n'+'*Stock Value:* '+sum2.toString()+'\n'+'*Gap:* '+gap.toString()+'\n'+'*Limit:* '+value[itr+2].toString()+'\n'+'```'+salestock+'```'+'*Last Month Sale:* '+lastMonth.toString()+'\n'
                                }
                                else if(nm[0][0]=='BALAJI TRADERS (GREATER NOIDA) (OPPO)'){
                                    var out1=parseFloat((value[itr+7].length==0?0:value[itr+7]))+parseFloat((value[itr+8].length==0?0:value[itr+8]))
                                    gap+=(parseFloat(out1))
                                    msg='*'+'Balaji Traders/Balaji Comm'+'*'+'\n'+'*Date:* '+date+'\n'+'*T.Outstanding:* '+out.toString()+'+'+value[itr+7].toString()+'\n'+'*Above 15Days:* '+value[itr+5].toString()+'+'+value[itr+9].toString()+'\n'+'*Yesterday Deposit:* '+value[itr+4].toString()+'+'+value[itr+8].toString()+'\n'+'*Stock Value:* '+sum2.toString()+'\n'+'*Gap:* '+gap.toString()+'\n'+'*Limit:* '+value[itr+2].toString()+'\n'+'```'+salestock+'```'+'*Last Month Sale:* '+lastMonth.toString()+'\n'
                                }
                                else{
                                    msg='*'+nm[0][0].split('(')[0]+'*'+'\n'+'*Date:* '+date+'\n'+'*T.Outstanding:* '+out.toString()+'\n'+'*Above 15Days:* '+value[itr+5].toString()+'\n'+'*Yesterday Deposit:* '+value[itr+4].toString()+'\n'+'*Stock Value:* '+sum2.toString()+'\n'+'*Gap:* '+gap.toString()+'\n'+'*Limit:* '+value[itr+2].toString()+'\n'+'```'+salestock+'```'+'*Last Month Sale:* '+lastMonth.toString()+'\n'
                                }
                                // res.send({
                                //     "ans":msg
                                // })
                                client.messages.create({
                                    from: process.env.NO,
                                    to: fromNumber,
                                    body: msg
                                }).then(message => {
                                    console.log('Message sent:', message.sid);
                                    res.end(twiml.toString());
                                }).catch(error => {
                                    console.error('Error sending message:', error);
                                    res.status(500).end();
                                });
                            }).catch((error)=>{
                                console.log(error)
                            });
                        }).catch((error)=>{
                            console.log(error)
                        });
                    }).catch((error)=>{
                        console.log(error)
                    });
                    
                }).catch((error)=>{
                    console.log(error)
                });
            })
        }
    }
    else{
        res.send("Unauthorised User")
    }
});

app.listen(port, () => console.log('server run at port ' + port));
