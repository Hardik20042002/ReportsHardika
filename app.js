var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
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
var outstandingModel = require('./models/outstanding');
var chqModel = require('./models/cheque');
var csv = require('csvtojson');
var bodyParser = require('body-parser');
let alert = require('alert'); 
require('dotenv').config();
const accountSid = process.env.SID;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
const twilio = require('twilio');
var port = process.env.PORT || 3000;
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.upload);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var uploads = multer({ storage: storage });
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
var colors=[]
var models=[]
var fosds=[]
var temp1,temp2,temp3,temp4,temp5
var nameMap=new Map()
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
    ['RAINBOW', 'R'],
    ['GREEN', 'GR'],
    ['BLACK', 'B'],
    ['GREY', 'GY'],
    ['ORANGE', 'O'],
    ['WHITE', 'W'],
  ]);
  const dummy=new Map([
    ['atoz','A TO Z MOBILE ! GREATER NOIDA'],
    ['atozmobile','A TO Z MOBILE ! GREATER NOIDA'],
    ['aman','AMAN MOBILE STORE ! GREATER NOIDA'],
    ['amanmobilestore','AMAN MOBILE STORE ! GREATER NOIDA'],
    ['ambe','AMBE SOFTWARE & HARDWARE REP CENTRE (DADRI) ! GREATER NOIDA'],
    ['ambey','AMBE SOFTWARE & HARDWARE REP CENTRE (DADRI) ! GREATER NOIDA'],
    ['ambesoftwareandhardwarerepcentre','AMBE SOFTWARE & HARDWARE REP CENTRE (DADRI) ! GREATER NOIDA'],
    ['arish','ARISH MOBILE CENTER ! GREATER NOIDA'],
    ['arishmobilecenter','ARISH MOBILE CENTER ! GREATER NOIDA'],
    ['atul','ATUL TELECOM CENTRE (KASNA) ! GREATER NOIDA'],
    ['atultelecomcentre','ATUL TELECOM CENTRE (KASNA) ! GREATER NOIDA'],
    ['avni','AVNI MOBILE SHOP (AICHER) ! GREATER NOIDA'],
    ['avnimobileshop','AVNI MOBILE SHOP (AICHER) ! GREATER NOIDA'],
    ['anupam','Anupam telecom ! GREATER NOIDA'],
    ['anupamtelecom','Anupam telecom ! GREATER NOIDA'],
    ['anushka','Anuska mobile center 2 ! GREATER NOIDA'],
    ['anushkamobilecenter','Anuska mobile center 2 ! GREATER NOIDA'],
    ['ayush','Ayush Communication ! GREATER NOIDA'],
    ['ayushcommunication','Ayush Communication ! GREATER NOIDA'],
    ['balajimobilezone','BALAJI MOBILE & ELECTRONICS (DADRI) ! GREATER NOIDA'],
    ['balajidadri','BALAJI MOBILE & ELECTRONICS (DADRI) ! GREATER NOIDA'],
    ['balajimobileandelectronics','BALAJI MOBILE & ELECTRONICS (DADRI) ! GREATER NOIDA'],
    ['bansiwala','BANSIWALA STORES (GAMMA-2) ! GREATER NOIDA'],
    ['bansiwalastores','BANSIWALA STORES (GAMMA-2) ! GREATER NOIDA'],
    ['bhoomi','BHOOMI MOBILE SOLUTION ! GREATER NOIDA'],
    ['bhoomimobilesolution','BHOOMI MOBILE SOLUTION ! GREATER NOIDA'],
    ['brs','BRS ELECTRONICS (KASNA) ! GREATER NOIDA'],
    ['brselectronics','BRS ELECTRONICS (KASNA) ! GREATER NOIDA'],
    ['balajitrader','Balaji Traders/Greater Noida ! GREATER NOIDA'],
    ['balajitraders','Balaji Traders/Greater Noida ! GREATER NOIDA'],
    ['computer','Computer Wizard ! GREATER NOIDA'],
    ['wizard','Computer Wizard ! GREATER NOIDA'],
    ['computerwizard','Computer Wizard ! GREATER NOIDA'],
    ['devent','DEV ENTERPRISES. ! GREATER NOIDA'],
    ['deventerprises','DEV ENTERPRISES. ! GREATER NOIDA'],
    ['devcom','Dev Communication (AICHER) ! GREATER NOIDA'],
    ['devcommunication','Dev Communication (AICHER) ! GREATER NOIDA'],
    ['famous','Famous Mobile Point ! GREATER NOIDA'],
    ['famousmobilepoint','Famous Mobile Point ! GREATER NOIDA'],
    ['fauji','Fauji Telecom(DADRI) ! GREATER NOIDA'],
    ['faujitelecom','Fauji Telecom(DADRI) ! GREATER NOIDA'],
    ['goel','GOEL MOBILE & SAMARTH ELECTRONICS ! GREATER NOIDA'],
    ['samarth','GOEL MOBILE & SAMARTH ELECTRONICS ! GREATER NOIDA'],
    ['goelmobileandsamarthelectronics','GOEL MOBILE & SAMARTH ELECTRONICS ! GREATER NOIDA'],
    ['istore','I Store ! GREATER NOIDA'],
    ['ishu','ISHU COMMUNICATION ! GREATER NOIDA'],
    ['ishucommunication','ISHU COMMUNICATION ! GREATER NOIDA'],
    ['jagdamba','JAGDAMBA MOBILE HUB (JAGAT FARM) ! GREATER NOIDA'],
    ['jagdambamobilehub','JAGDAMBA MOBILE HUB (JAGAT FARM) ! GREATER NOIDA'],
    ['jaiambeyent','JAI AMBEY COMMUNICATION ENTERPRISES ! GREATER NOIDA'],
    ['jaiambeyenterprises','JAI AMBEY COMMUNICATION ENTERPRISES ! GREATER NOIDA'],
    ['jaiambeycommunicationenterprises','JAI AMBEY COMMUNICATION ENTERPRISES ! GREATER NOIDA'],
    ['jaiambeent','JAI AMBEY COMMUNICATION ENTERPRISES ! GREATER NOIDA'],
    ['jrb','JRB TELECOM ! GREATER NOIDA'],
    ['jaiambeycom','Jai Ambey Communication ! GREATER NOIDA'],
    ['jaiambeycommunication','Jai Ambey Communication ! GREATER NOIDA'],
    ['jaiambecom','Jai Ambey Communication ! GREATER NOIDA'],
    ['kgn','K G N COMMUNICATION ! GREATER NOIDA'],
    ['kgncommunication','K G N COMMUNICATION ! GREATER NOIDA'],
    ['kanika','KANIKA COMMUNICATION (HABIBPUR) ! GREATER NOIDA'],
    ['kanikacommunication','KANIKA COMMUNICATION (HABIBPUR) ! GREATER NOIDA'],
    ['kashish','KASHISH COMMUNICATION ! GREATER NOIDA'],
    ['kashishcommunication','KASHISH COMMUNICATION ! GREATER NOIDA'],
    ['kgad','KGAD MOBIWORLD ! GREATER NOIDA'],
    ['kgadmobiworld','KGAD MOBIWORLD ! GREATER NOIDA'],
    ['krishna','KRISHNA TELECOM (GN) ! GREATER NOIDA'],
    ['krishnatelecom','KRISHNA TELECOM (GN) ! GREATER NOIDA'],
    ['keshav','Keshav Mobile Point(Sec-32) ! GREATER NOIDA'],
    ['keshavmobilepoint','Keshav Mobile Point(Sec-32) ! GREATER NOIDA'],
    ['lk','L K MOBILE POINT ! GREATER NOIDA'],
    ['lkmobilepoint','L K MOBILE POINT ! GREATER NOIDA'],
    ['mr','M.R. COMMUNICATION (KASNA) ! GREATER NOIDA'],
    ['mrcom','M.R. COMMUNICATION (KASNA) ! GREATER NOIDA'],
    ['mrcommunication','M.R. COMMUNICATION (KASNA) ! GREATER NOIDA'],
    ['ms','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['mscom','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['msdivinecom','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['msdivine','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['msdivinecommunication','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['mscommunication','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['mahalaxmip','MAHALAXMI MOBILE POINT ! GREATER NOIDA'],
    ['mahalaxmimobilepoint','MAHALAXMI MOBILE POINT ! GREATER NOIDA'],
    ['mahalaxmipoint','MAHALAXMI MOBILE POINT ! GREATER NOIDA'],
    ['mahalaxmis','MAHALAXMI MOBILE STORE ! GREATER NOIDA'],
    ['mahalaxmimobilestore','MAHALAXMI MOBILE STORE ! GREATER NOIDA'],
    ['mahalaxmistore','MAHALAXMI MOBILE STORE ! GREATER NOIDA'],
    ['matrix','MATRIX NETWORK MOBILE STORE ! GREATER NOIDA'],
    ['hotspot','MOBILE HOTSPOT ! GREATER NOIDA'],
    ['mobilehotspot','MOBILE HOTSPOT ! GREATER NOIDA'],
    ['shingar','MOBILE SHINGAR (DADRI) ! GREATER NOIDA'],
    ['mobileshingar','MOBILE SHINGAR (DADRI) ! GREATER NOIDA'],
    ['solution','Mobile Solution ! GREATER NOIDA'],
    ['mobilesolution','Mobile Solution ! GREATER NOIDA'],
    ['mobileworld','Mobile World (noida) ! GREATER NOIDA'],
    ['world','Mobile World (noida) ! GREATER NOIDA'],
    ['newlavish','NEW LAVISH COMM & MOBILE WORLD (HABIBPUR) ! GREATER NOIDA'],
    ['lavish','NEW LAVISH COMM & MOBILE WORLD (HABIBPUR) ! GREATER NOIDA'],
    ['newradhey','NEW RADHEY ELECTRONICS & MOBILE CENTER ! GREATER NOIDA'],
    ['radhey','NEW RADHEY ELECTRONICS & MOBILE CENTER ! GREATER NOIDA'],
    ['newrajdeep','NEW RAJDEEP MOBILE POINT (SURAJPUR) ! GREATER NOIDA'],
    ['newuniversal','NEW UNIVERSAL OFFICE SYSTEM ! GREATER NOIDA'],
    ['noble','Noble Mobile Shope ! GREATER NOIDA'],
    ['nobel','Noble Mobile Shope ! GREATER NOIDA'],
    ['noor','Noor Communication ! GREATER NOIDA'],
    ['om','OM COMMUNICATION ! GREATER NOIDA'],
    ['omcom','OM COMMUNICATION ! GREATER NOIDA'],
    ['omsai','Om Sai Communication( Greater Noida) ! GREATER NOIDA'],
    ['pandey','PANDEY COMMUNICATION ! GREATER NOIDA'],
    ['pooja','POOJA COMMUNICATION (G.NOIDA) ! GREATER NOIDA'],
    ['praveen2','PRAVEEN MOBILE CENTER -2 ! GREATER NOIDA'],
    ['praveen','PRAVEEN MOBILE CENTRE (SURJPUR) ! GREATER NOIDA'],
    ['praveen1','PRAVEEN MOBILE CENTRE (SURJPUR) ! GREATER NOIDA'],
    ['praveensurajpur','PRAVEEN MOBILE CENTRE (SURJPUR) ! GREATER NOIDA'],
    ['priyanka','PRIYANKA MOBILE WORLD (HALDONI) ! GREATER NOIDA'],
    ['prince','Prince Enterpirese ! GREATER NOIDA'],
    ['rk','R K TELECOM (TUGALPUR) ! GREATER NOIDA'],
    ['rahul','RAHUL TELECOM (AICHER) ! GREATER NOIDA'],
    ['rana','RANA ENTERPRISES ! GREATER NOIDA'],
    ['rajdeep','Rajdeep Mobile Point ! GREATER NOIDA'],
    ['royal','Royal mobile house and electronics ! GREATER NOIDA'],
    ['sn','S N COMMUNICATION (HALDONI) ! GREATER NOIDA'],
    ['sm','S.M TRADER (KASNA) ! GREATER NOIDA'],
    ['sachin','SACHIN TELECOM AND MOBILE SHOP ! GREATER NOIDA'],
    ['sanchar','SANCHAR BHAWAN (GREATER NOIDA) ! GREATER NOIDA'],
    ['satnam','SATNAM MOBILE STORE ! GREATER NOIDA'],
    ['shivshakti','SHIV SHAKTI ELECTRONICS ! GREATER NOIDA'],
    ['shivtraders','SHIV TRADERS (SURAJPUR) ! GREATER NOIDA'],
    ['shivsurajpur','SHIV TRADERS (SURAJPUR) ! GREATER NOIDA'],
    ['shreebaba','SHREE BABA COMMUNICATION (KASNA) ! GREATER NOIDA'],
    ['shreebalajicom','SHREE BALAJI COMMUNICATION (SURAJPUR) ! GREATER NOIDA'],
    ['shreebalajisurajpur','SHREE BALAJI COMMUNICATION (SURAJPUR) ! GREATER NOIDA'],
    ['shreebalajicenter','SHREE BALAJI MOBILE CENTER (KASNA) ! GREATER NOIDA'],
    ['shreebalajicentre','SHREE BALAJI MOBILE CENTER (KASNA) ! GREATER NOIDA'],
    ['shreebalajikasna','SHREE BALAJI MOBILE CENTER (KASNA) ! GREATER NOIDA'],
    ['shreeram','SHREE RAM MOBILE GALLERY ! GREATER NOIDA'],
    ['shrisahibji','SHRI SAHIB JI MOBILE SOLUTION (DADRI) ! GREATER NOIDA'],
    ['shrisahib','SHRI SAHIB JI MOBILE SOLUTION (DADRI) ! GREATER NOIDA'],
    ['sahib','SHRI SAHIB JI MOBILE SOLUTION (DADRI) ! GREATER NOIDA'],
    ['shrisahibji2','SHRIB SAHIB JI MOBILE SOLUTION-2 ! GREATER NOIDA'],
    ['shrisahib2','SHRIB SAHIB JI MOBILE SOLUTION-2 ! GREATER NOIDA'],
    ['sahib2','SHRIB SAHIB JI MOBILE SOLUTION-2 ! GREATER NOIDA'],
    ['sony','SONY ELECTRONICS (SURAJPUR) ! GREATER NOIDA'],
    ['star','STAR TELECOM CENTER(GEJHA) ! GREATER NOIDA'],
    ['susshma','SUSSHMA MOBILE POINT (TUGALPUR) ! GREATER NOIDA'],
    ['sushma','SUSSHMA MOBILE POINT (TUGALPUR) ! GREATER NOIDA'],
    ['sanjay','Sanjay Communication(Sec-93) ! GREATER NOIDA'],
    ['shyamlal','Shyam Lal & Sons ! GREATER NOIDA'],
    ['shyam','Shyam Lal & Sons ! GREATER NOIDA'],
    ['tomar','TOMAR ELECTRONICS ! GREATER NOIDA'],
    ['tanish','Tanish Telecom(Surajpur) ! GREATER NOIDA'],
    ['tanishq','Tanish Telecom(Surajpur) ! GREATER NOIDA'],
    ['mobilelife','The Mobile Life ! GREATER NOIDA'],
    ['life','The Mobile Life ! GREATER NOIDA'],
    ['themobilelife','The Mobile Life ! GREATER NOIDA'],
    ['universal','UNIVERSAL MOBILE CAFE ! GREATER NOIDA'],
    ['cafe','UNIVERSAL MOBILE CAFE ! GREATER NOIDA'],
    ['universalcafe','UNIVERSAL MOBILE CAFE ! GREATER NOIDA'],
    ['vk','V.K Mobile Point (HALDONI) ! GREATER NOIDA'],
    ['vaishnav','VAISHNAV TELECOM ( ANSAL PLAZA) ! GREATER NOIDA'],
    ['vishal','VISHAL MOBILE HOUSE ! GREATER NOIDA'],
    ['vikky','Vikky Communication ! GREATER NOIDA'],
    ['viky','Vikky Communication ! GREATER NOIDA'],
    ['yash','YASH SANCHAR WORLD ! GREATER NOIDA']
])

app.get(process.env.uri, (req, res) => {
    let a = imeiModel.distinct("Distributor")
    let b = imeiModel.distinct("Model")
    let c = imeiModel.distinct("Color")
    let d = fosModel.distinct("FOS")
    let e = nameModel.find()
    temp1=undefined
    temp2=undefined
    temp3=undefined
    temp4=undefined
    temp5=undefined
    Promise.all([a, b,c,d,e]).then((returnedValues) => {
        const [dealer, model,color, fosd, names] = returnedValues;
        dealers=dealer
        colors=color
        models=model
        fosds=fosd
        for(var i=0;i<names.length;i++){
            nameMap.set(names[i].PortalName,names[i].TallyName)
        }
        res.render(process.env.h, {
            dealerDetails: dealer,
            modelDetails: model,
            colorDetails: color,
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

app.post(process.env.uri, uploads.single('csv'), (req, res) => { 
    console.log(req.body.upload) 
    if(req.body.upload=='fos'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            fosModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    fosModel.insertMany(jsonObj, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Fos Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('FosSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='class'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            classModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    classModel.insertMany(jsonObj, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Class Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('ClassSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='psv'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            objct=[]
            for (var x = 0; x < jsonObj.length; x++) {
                temp = parseFloat(jsonObj[x]["IMEI 1"])
                to={}
                to["IMEI"] = temp;
                to["Model"]=jsonObj[x]["Product Model"]
                to["Color"]=jsonObj[x]["Color"]
                to["Distributor"]=jsonObj[x]["Distributor"]
                to["VerificationTime"]=jsonObj[x]["Verification Time"]
                objct.push(to)
            }
            imeiModel.deleteMany({'VerificationTime':{$ne:null}},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    imeiModel.insertMany(objct, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Portal Sale Verification Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('IMEISuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='ps'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            objct=[]
            for (var x = 0; x < jsonObj.length; x++) {
                temp = parseFloat(jsonObj[x]["IMEI 1"])
                to={}
                to["IMEI"] = temp;
                to["Model"]=jsonObj[x]["Product Model"]
                to["Color"]=jsonObj[x]["Color"]
                to["Distributor"]=jsonObj[x]["Distributor"]
                to["VerificationTime"]=null
                objct.push(to)
            }
            imeiModel.deleteMany({'VerificationTime':null},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    imeiModel.insertMany(objct, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Portal Stock Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('IMEISuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='scan'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            var object=[]
            for (var x = 0; x < jsonObj.length; x++) {
                var exobj={}
                temp = parseFloat(jsonObj[x]["IMEI NO"])
                exobj['IMEI']=temp
                exobj['Model']=jsonObj[x]["MODEL"]
                exobj['Distributor']=jsonObj[x]["Located Warehouse/Store"]
                object.push(exobj)
            }
            scanModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    scanModel.insertMany(object, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Scan Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('ScanSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='price'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            for (var x = 0; x < jsonObj.length; x++) {
                if(jsonObj[x].DP==''){jsonObj[x].DP='0'}
                temp = parseFloat(jsonObj[x].DP)
                jsonObj[x].DP=temp
            }
            priceModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    priceModel.insertMany(jsonObj, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Price Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('PriceSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='prev'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            for (var x = 0; x < jsonObj.length; x++) {
                var temp=jsonObj[x].Distributor
                jsonObj[x].Distributor=temp+' ! GREATER NOIDA'
                temp = parseFloat(jsonObj[x].SALE)
                jsonObj[x].SALE = temp;
            }
            prevModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    prevModel.insertMany(jsonObj, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Previous Month Sale Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('PrevSaleSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='stock'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            console.log(jsonObj)
            jobj=[]
            for (var x = 0; x < jsonObj.length; x++) {
                tempobj={}
                tempobj["Model"]=jsonObj[x].MODEL
                tempobj["Color"]=jsonObj[x].COLOUR
                if(jsonObj[x]['CLSOING STOCK']==''){
                    jsonObj[x]['CLSOING STOCK']='0'
                }
                temp = parseFloat(jsonObj[x]['CLSOING STOCK'])
                tempobj["Stock"] = temp;
                jobj.push(tempobj)
            }
            stockModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    stockModel.insertMany(jobj, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Hardika Stock Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('StockSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='acsa'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            var objt=[]
            for (var x = 0; x < jsonObj.length; x++) {
                var asobj={}
                temp = parseFloat(jsonObj[x]["IMEI 1"])
                asobj['IMEI']=temp
                asobj['Model']=jsonObj[x]["Product Model"]
                asobj['Distributor']=jsonObj[x]["Distributor"]
                objt.push(asobj)
            }
            actualSaleModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    actualSaleModel.insertMany(objt, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Actual Sale Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('ActualSaleSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='lim'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            var objt=[]
            for (var x = 0; x < jsonObj.length; x++) {
                var asobj={}
                if(jsonObj[x]["LIMITS"]==''){
                    jsonObj[x]["LIMITS"]='0'
                }
                asobj['Limit']=jsonObj[x]["LIMITS"]
                asobj['Distributor']=jsonObj[x]["DEALER NAME"]
                objt.push(asobj)
            }
            limitModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    limitModel.insertMany(objt, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Limit Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('LimitSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='dnr'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            var objt=[]
            for (var x = 0; x < jsonObj.length; x++) {
                var asobj={}
                asobj['TallyName']=jsonObj[x]["Tally"]
                asobj['PortalName']=jsonObj[x]["Portal"]
                objt.push(asobj)
            }
            nameModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    nameModel.insertMany(objt, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Dealer Name Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('DealerNameSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='out'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            var objt=[]
            for (var x = 0; x < jsonObj.length; x++) {
                var asobj={}
                asobj['Distributor']=jsonObj[x]["Dealer"]
                var a=jsonObj[x]["Debit"],b=jsonObj[x]["Credit"]
                if(a==''){
                    asobj['Outstanding']=-1*parseInt(b);
                }
                else{
                    asobj['Outstanding']=parseInt(a);
                }
                objt.push(asobj)
            }
            outstandingModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    outstandingModel.insertMany(objt, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Outstanding Records")
                            res.redirect(process.env.uri);
                        } else {
                            console.log('OutstandingSuccess')
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else if(req.body.upload=='chq'){
        csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            var objt=[]
            for (var x = 0; x < jsonObj.length; x++) {
                var asobj={}
                asobj['Distributor']=jsonObj[x]["DEALER"]
                if(jsonObj[x]["CHQ AMOUNT"]==''){
                    jsonObj[x]["CHQ AMOUNT"]='0'
                }
                asobj['Chq']=parseFloat(jsonObj[x]["CHQ AMOUNT"])
                objt.push(asobj)
            }
            chqModel.deleteMany({},(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    chqModel.insertMany(objt, (err, data) => {
                        if (err) {
                            alert("Re Upload the correct Cheque Records")
                            res.redirect(process.env.uri);
                        } else {
                            res.redirect(process.env.uri);
                        }
                    });
                }
            })
        });
    }
    else{
        alert("Please select the correct upload type to upload the records")
        res.redirect(process.env.uri);
    }
});

app.post(process.env.duri,(req,res)=>{
    const {deal,model,color,report,fosd}=req.body
    temp1=deal
    temp2=model
    temp3=color[0]
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
                t=[]
                t.push(imeiModel.distinct("Distributor"))
                t.push(imeiModel.distinct("Model"))
                t.push(fosModel.distinct("FOS"))
                if(temp3=="No"){
                    for(var i=0;i<temp1.length;i++){
                        for(var j=0;j<temp2.length;j++){
                            t.push(imeiModel.find({"Distributor":temp1[i],"Model":temp2[j],"VerificationTime":{$ne:null}}).count())
                            t.push(imeiModel.find({"Distributor":temp1[i],"Model":temp2[j],"VerificationTime":null}).count())
                            t.push(stockModel.find({'Model':temp2[j]}))
                        }
                        t.push(prevModel.distinct('SALE',prevModel.find({'Distributor':temp1[i]})))
                        t.push(fosModel.distinct('FOS',fosModel.find({'Distributor':temp1[i]})))
                        t.push(classModel.distinct('CLASS',classModel.find({'Distributor':temp1[i]})))
                        t.push(imeiModel.find({"Distributor":temp1[i],"VerificationTime":{$ne:null}}).count())
                        t.push(imeiModel.find({"Distributor":temp1[i],"VerificationTime":null}).count())
                    }
                }
                else{
                    for(var i=0;i<temp1.length;i++){
                        for(var j=0;j<temp2.length;j++){
                            for(var k=0;k<colors.length;k++){
                                t.push(imeiModel.find({"Distributor":temp1[i],"Model":temp2[j],"Color":colors[k],"VerificationTime":{$ne:null}}).count())
                                t.push(imeiModel.find({"Distributor":temp1[i],"Model":temp2[j],"Color":colors[k],"VerificationTime":null}).count())
                            }
                            t.push(stockModel.find({'Model':temp2[j]}))
                        }
                        t.push(prevModel.distinct('SALE',prevModel.find({'Distributor':temp1[i]})))
                        t.push(fosModel.distinct('FOS',fosModel.find({'Distributor':temp1[i]})))
                        t.push(classModel.distinct('CLASS',classModel.find({'Distributor':temp1[i]})))
                        t.push(imeiModel.find({"Distributor":temp1[i],"VerificationTime":{$ne:null}}).count())
                        t.push(imeiModel.find({"Distributor":temp1[i],"VerificationTime":null}).count())
                    }
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
                    if(temp3=="No"){
                        for(var i=0;i<temp1.length;i++){
                            for(var j=0;j<temp2.length;j++){
                                    sale.push(arr[itr])
                                    stock.push(arr[itr+1])
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
                            tsale.push(arr[itr+3])
                            tstock.push(arr[itr+4])
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
                    }
                    else{
                        for(var i=0;i<temp1.length;i++){
                            for(var j=0;j<temp2.length;j++){
                                for(var k=0;k<colors.length;k++){
                                    sale.push(arr[itr])
                                    stock.push(arr[itr+1])
                                    itr+=2
                                }
                                var str=""
                                for(var l=0;l<arr[itr].length;l++){
                                    str+=map.get(arr[itr][l].Color)
                                    str+=(arr[itr][l].Stock).toString()
                                    str+=' '
                                }
                                stockstr.push(str)
                                itr++
                            }
                            var x=data.find(o=>o.Distributor==temp1[i])
                            if(x==undefined){
                                fos.push(arr[itr].toString()+' '+arr[itr+1]+' ')
                            }
                            else{
                                fos.push(arr[itr].toString()+' '+arr[itr+1]+' '+x.Class[0].CLASS)
                            }
                            tsale.push(arr[itr+3])
                            tstock.push(arr[itr+4])
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
                    }
                    if(temp3=="No"){
                        res.render(process.env.ssd,{
                            dealerDetails:arr[0],
                            modelDetails:arr[1],
                            fosDetails:arr[2],
                            dealer:obj['dealer'],
                            model:obj['model'],
                            sale:sale,
                            stock:stock,
                            isColor:temp3,
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
                    }
                    else{
                        t=[]
                        for(var i=0;i<temp2.length;i++){
                            t.push(imeiModel.distinct('Color',imeiModel.find({'Model':temp2[i]})));
                        }
                        Promise.all(t).then((value)=>{
                            arr1=value;
                            res.render(process.env.ssd,{
                                dealerDetails:arr[0],
                                modelDetails:arr[1],
                                fosDetails:arr[2],
                                dealer:obj['dealer'],
                                model:obj['model'],
                                colors:colors,
                                sale:sale,
                                stock:stock,
                                distColors:arr1,
                                isColor:temp3,
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
                        }).catch((error) => {
                                console.log(error)
                        }); 
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
    })
});

app.get(process.env.mduri,(req,res)=>{
    var modelreports=[]
    for(var i=0;i<models.length;i++){
        modelreports.push(imeiModel.find({"Model":models[i],"VerificationTime":{$ne:null}}).count())
        modelreports.push(imeiModel.find({"Model":models[i],"VerificationTime":null}).count())
    }
    Promise.all(modelreports).then((value)=>{
        var modelwise=[]
        var itr=0
        for(var i=0;i<value.length;i+=2){
            var modelobj={}
            modelobj['model']=models[itr]
            itr++
            modelobj['sale']=value[i]
            modelobj['stock']=value[i+1]
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
            t=[]
            t.push(imeiModel.distinct('Distributor'))
            t.push(imeiModel.distinct('Model'))
            Promise.all(t).then((val)=>{
                var t1=val[0],t2=val[1]
                var outstandingreports=[]
                for(var i=0;i<t1.length;i++){
                    for(var j=0;j<t2.length;j++){
                        outstandingreports.push(imeiModel.find({"Distributor":t1[i],"Model":t2[j],"VerificationTime":null}))
                        outstandingreports.push(scanModel.find({"Distributor":t1[i],"Model":t2[j]}))
                        outstandingreports.push(actualSaleModel.find({"Distributor":t1[i],"Model":t2[j]}))
                        outstandingreports.push(priceModel.distinct('DP',priceModel.find({"Model":t2[j]})))
                    }
                    outstandingreports.push(fosModel.distinct('FOS',fosModel.find({'Distributor':t1[i]})))
                    outstandingreports.push(classModel.distinct('CLASS',classModel.find({'Distributor':t1[i]})))
                    outstandingreports.push(limitModel.distinct('Limit',limitModel.find({'Distributor':t1[i]})))
                    outstandingreports.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':nameMap.get(t1[i])})))
                    outstandingreports.push(chqModel.distinct('Chq',chqModel.find({'Distributor':nameMap.get(t1[i])})))
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
                        outstd.push({
                            'fos':array[itr]+' '+array[itr+1],
                            'shop':dealers[i],
                            'limit':array[itr+2],
                            'outstanding':array[itr+3],
                            'chq':array[itr+4],
                            'qty':sum1,
                            'price':sum2,
                        })
                        itr+=5
                    }
                    outstd.sort((a,b)=>{
                        return classobj.indexOf(a.fos.split(' ')[1])-classobj.indexOf(b.fos.split(' ')[1]);
                    })
                    res.render(process.env.od,{
                        dealerDetails:dealers,
                        modelDetails:models,
                        fosDetails:fosds,
                        outstanding:outstd,
                        model:temp2,
                        selectedfos:temp5,
                        baseurl:process.env.BASE_URL,
                        link:process.env.link
                    })
                }).catch((error) => {
                    console.log(error)
                });
            }).catch((error) => {
                console.log(error)
            });
                
        }
    })
});


app.get(process.env.aduri,(req,res)=>{
    t=[]
    t.push(imeiModel.distinct('Distributor'))
    t.push(imeiModel.distinct('Model'))
    Promise.all(t).then((val)=>{
        var t1=val[0],t2=val[1]
        var outstandingreports=[]
        for(var i=0;i<t1.length;i++){
            for(var j=0;j<t2.length;j++){
                outstandingreports.push(imeiModel.find({"Distributor":t1[i],"Model":t2[j],"VerificationTime":null}))
                outstandingreports.push(scanModel.find({"Distributor":t1[i],"Model":t2[j]}))
                outstandingreports.push(actualSaleModel.find({"Distributor":t1[i],"Model":t2[j]}))
                outstandingreports.push(priceModel.distinct('DP',priceModel.find({"Model":t2[j]})))
            }
            outstandingreports.push(fosModel.distinct('FOS',fosModel.find({'Distributor':t1[i]})))
            outstandingreports.push(classModel.distinct('CLASS',classModel.find({'Distributor':t1[i]})))
        }
        Promise.all(outstandingreports).then((returnedValues) => {
            var outstd=[]
            var itr=0
            var array=returnedValues
            var flags=[]
            for(var i=0;i<t2.length;i++){
                flags.push(false)
            }
            for(var i=0;i<t1.length;i++){
                var sum1=0,sum2=0
                var cnt=[]
                var zero=false
                for(var j=0;j<t2.length;j++){
                    var arr1=[]
                    for(var k=0;k<array[itr].length;k++){
                        arr1.push(array[itr][k].IMEI)
                    }
                    var x=arr1.length,temp=0
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
                            temp++
                        }
                    }
                    sum1+=x;
                    sum2+=(x*array[itr+3])
                    itr+=4
                    if(temp>0){
                        flags[j]=true;
                        zero=true;
                    }
                    cnt.push(temp)
                }
                outstd.push({
                    'fos':array[itr]+' '+array[itr+1],
                    'shop':dealers[i],
                    'price':sum2,
                    'model':t2,
                    'cnt':cnt,
                    'isZero':zero,
                })
                itr+=2
            }
            res.render(process.env.ad,{
                modelDetails:t2,
                outstanding:outstd,
                flag:flags,
                baseurl:process.env.BASE_URL,
                img:process.env.img,
                link:process.env.link
            })
        }).catch((error) => {
            console.log(error)
        });
    }).catch((error) => {
        console.log(error)
    });
});

app.get(process.env.suri,(req,res)=>{
    res.render(process.env.ss,{
        dealerDetails:dealers,
        modelDetails:models,
        fosDetails:fosds,
        dealer:temp1,
        model:temp2,
        isColor:temp3,
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

app.post(process.env.wl, (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const messageBody = req.body.Body;
    const fromNumber = req.body.From;
    var dlr=messageBody.toLowerCase()
    var mapper=new Map()
    if(dlr.split(' ')[0].toLowerCase()=='help'){
        var ch=dlr.split(' ')[1][0].toLowerCase();
        dummy.forEach((val,key)=>{
            if(val[0].toLowerCase()==ch){
                if(mapper.has(val.split('!')[0])){
                    if(mapper.get(val.split('!')[0]).length>key.length)
                    mapper.set(val.split('!')[0],key)
                }
                else{
                    mapper.set(val.split('!')[0],key)
                }
            }
        })
        var msg='';
        mapper.forEach(function(value, key) {
            msg+=(key+' -> '+value+'\n');
        })
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
        dlr=dummy.get(dlr);
        var t=[]
        t.push(imeiModel.find({"Distributor":dlr,"VerificationTime":{$ne:null}}).count())
        t.push(imeiModel.distinct("Distributor"))
        t.push(imeiModel.distinct('Model'))
        Promise.all(t).then((v)=>{
            var outreport=[]
            var models=v[2]
            for(var i=0;i<v[2].length;i++){
                outreport.push(imeiModel.find({"Distributor":dlr,"Model":v[2][i],"VerificationTime":null}))
                outreport.push(scanModel.find({"Distributor":dlr,"Model":v[2][i]}))
                outreport.push(actualSaleModel.find({"Distributor":dlr,"Model":v[2][i]}))
                outreport.push(priceModel.distinct('DP',priceModel.find({"Model":v[2][i]})))
            }
            outreport.push(fosModel.distinct('FOS',fosModel.find({'Distributor':dlr})))
            outreport.push(classModel.distinct('CLASS',classModel.find({'Distributor':dlr})))
            outreport.push(limitModel.distinct('Limit',limitModel.find({'Distributor':dlr})))
            outreport.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':nameMap.get(dlr)})))
            outreport.push(chqModel.distinct('Chq',chqModel.find({'Distributor':nameMap.get(dlr)})))
            Promise.all(outreport).then((value)=>{
                var itr=0
                var sum1=0,sum2=0
                for(var i=0;i<models.length;i++){
                    var arr1=[]
                    for(var k=0;k<value[itr].length;k++){
                        arr1.push(value[itr][k].IMEI)
                    }
                    var x=arr1.length
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
                        }
                    }
                    sum1+=x;
                    sum2+=(x*value[itr+3])
                    itr+=4
                }
                client.messages.create({
                    from: process.env.NO,
                    to: fromNumber,
                    body: '*'+dlr.split('!')[0]+'*'+'\n*LIMIT:* '+value[itr+2].toString()+'\n'+'*OUTSTANDING:* '+value[itr+3].toString()+'\n'+'*CHQ VALUE:* '+value[itr+4].toString()+'\n'+'*STOCK VALUE:* '+sum2.toString()+'\n'+'*GAP:* '+(value[itr+3]-sum2).toString()
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
    }
  });

app.listen(port, () => console.log('server run at port ' + port));