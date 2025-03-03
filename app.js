var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var xlsx = require('xlsx');
var fs = require('fs');
var fosModel = require('./models/fos');
var priceModel = require('./models/price');
var nameModel = require('./models/dealername');
var outstandingModel = require('./models/outstanding');
var chqModel = require('./models/cheque');
var outstandingDaysModel = require('./models/daysOutstanding');
var warehouseModel = require('./models/warehouse');
var marketSaleModel = require('./models/marketSale');
var marketStockModel = require('./models/marketStock');
var tallyModel = require('./models/tally');
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

const dummy = new Map([
    ['momin','MOMIN TELECOM (TUGHALPUR) (REAL)'],
    ['momintelecom','MOMIN TELECOM (TUGHALPUR) (REAL)'],
    ['absolute','ABSOLUTE ENTERPRISES (SECTOR 63) (REAL)'],
    ['absoluteenterprises','ABSOLUTE ENTERPRISES (SECTOR 63) (REAL)'],
    ['ajay','AJAY MOBILE POINT (SECTROR 63) (REAL)'],
    ['ajaymobile','AJAY MOBILE POINT (SECTROR 63) (REAL)'],
    ['ajaymobilepoint','AJAY MOBILE POINT (SECTROR 63) (REAL)'],
    ['ambe','AMBE SOFTWARE AND HARDWARE REPAIRING CENTRE (REAL)'],
    ['ambesoftware','AMBE SOFTWARE AND HARDWARE REPAIRING CENTRE (REAL)'],
    ['anushkacenter','ANUSHKA MOBILE CENTER (AICHAR) (REAL)'],
    ['anushkamobilecenter','ANUSHKA MOBILE CENTER (AICHAR) (REAL)'],
    ['anushkahouse','ANUSHKA MOBILE HOUSE (EICHAR) (REAL)'],
    ['anushkamobilehouse','ANUSHKA MOBILE HOUSE (EICHAR) (REAL)'],
    ['ashu','ASHU COMMUNICATION (DADRI) (REAL)'],
    ['ashucommunication','ASHU COMMUNICATION (DADRI) (REAL)'],
    ['pandey','PANDEY COMMUNICATION (REAL)'],
    ['pandeycommunication','PANDEY COMMUNICATION (REAL)'],
    ['bk','B.K. ELECTRONICS (NOIDA) (REAL)'],
    ['bkelectronics','B.K. ELECTRONICS (NOIDA) (REAL)'],
    ['balaji','BALAJI COMMUNICATION (SUTHIYANA) (REAL)'],
    ['balajicommunication','BALAJI COMMUNICATION (SUTHIYANA) (REAL)'],
    ['bansiwala','BANSIWALA STORES (GN) (REAL)'],
    ['brs','BRS ELECTRONICS (KASNA) (REAL)'],
    ['choudhary','CHOUDHARY TRADING CO. (Kuleshra) (REAL)'],
    ['choudharytrading','CHOUDHARY TRADING CO. (Kuleshra) (REAL)'],
    ['devcom','DEV COMMUNICATION (AICHER) (REAL)'],
    ['devcommunication','DEV COMMUNICATION (AICHER) (REAL)'],
    ['devent','DEV ENTERPRISES (GN) (REAL)'],
    ['deventerprises','DEV ENTERPRISES (GN) (REAL)'],
    ['digital','Digital Gadget Cafe (GB NAGAR) (REAL)'],
    ['digitalgadget','Digital Gadget Cafe (GB NAGAR) (REAL)'],
    ['digitalcafe','Digital Gadget Cafe (GB NAGAR) (REAL)'],
    ['divine','DIVINE COMMUNICATION (GN) (REAL)'],
    ['divinecomm','DIVINE COMMUNICATION (GN) (REAL)'],
    ['dream','DREAM COMMUNICATION (SURAJPUR) (REAL)'],
    ['dreamcomm','DREAM COMMUNICATION (SURAJPUR) (REAL)'],
    ['electronic126','ELECTRONIC 126 (NOIDA) (REAL)'],
    ['goel','GOEL MOBILE AND SAMARTH ELECTRONICS(REAL)'],
    ['goelmobile','GOEL MOBILE AND SAMARTH ELECTRONICS(REAL)'],
    ['goelmobileandsamarth','GOEL MOBILE AND SAMARTH ELECTRONICS(REAL)'],
    ['jaiambeyent','JAI AMBEY COMMUNICATION ENTERPRISES (DADRI) (REAL)'],
    ['jaiambeycomment','JAI AMBEY COMMUNICATION ENTERPRISES (DADRI) (REAL)'],
    ['jaiambeycomm','JAI AMBEY COMMUNICATION (DADRI) (REAL)'],
    ['kd','K D MOBILE WORLD (DADRI) (REAL)'],
    ['kdmobile','K D MOBILE WORLD (DADRI) (REAL)'],
    ['kashish','KASHISH COMMUNICATION (KULESHRA) (REAL)'],
    ['kashishcomm','KASHISH COMMUNICATION (KULESHRA) (REAL)'],
    ['kgad','KGAD MOBIWORLD  (GEJHA) (REAL)'],
    ['kgadmobiworld','KGAD MOBIWORLD  (GEJHA) (REAL)'],
    ['krishna','KRISHNA TELECOM (RAMPUR) (REAL)'],
    ['krishnatelecom','KRISHNA TELECOM (RAMPUR) (REAL)'],
    ['lovemobile','LOVE MOBILE CENTRE (SURAJPUR) (REAL)'],
    ['lovemobilecentre','LOVE MOBILE CENTRE (SURAJPUR) (REAL)'],
    ['mobihub','MOBI HUB (NOIDA) (REAL)'],
    ['mobilemart','MOBILE MART (AICHER) (REAL)'],
    ['masantoshi','MA SANTOSHI COMMUNICATION (CHHAJARASI) (REAL)'],
    ['masantoshicomm','MA SANTOSHI COMMUNICATION (CHHAJARASI) (REAL)'],
    ['mobileshingar','MOBILE SHINGAR (DADRI) (REAL)'],
    ['mymobile','MY MOBILE REPARING CENTER (SUTHYANA) (REAL)'],
    ['mymobilerepairing','MY MOBILE REPARING CENTER (SUTHYANA) (REAL)'],
    ['newuniversal','NEW UNIVERSAL OFFICE SYSTEM (JAGAT FARM) (REAL)'],
    ['newuniversaloffice','NEW UNIVERSAL OFFICE SYSTEM (JAGAT FARM) (REAL)'],
    ['nobel','NOBEL MOBILE SHOPEE (REAL)'],
    ['nobelmobile','NOBEL MOBILE SHOPEE (REAL)'],
    ['noor','NOOR COMMUNICATION (REAL)'],
    ['noorcomm','NOOR COMMUNICATION (REAL)'],
    ['om','OM COMMUNICATIONS (KULESARA) (Real)'],
    ['omcomm','OM COMMUNICATIONS (KULESARA) (Real)'],
    ['parv','PARV ENTERPRISES (GN) (REAL)'],
    ['parvent','PARV ENTERPRISES (GN) (REAL)'],
    ['prince','PRINCE ENTERPRISES (GHORI) (REAL)'],
    ['princeent','PRINCE ENTERPRISES (GHORI) (REAL)'],
    ['rajdeep','RAJDEEP MOBILE POINT (SURAJPUR) (REAL)'],
    ['rajdeepmobilepoint','RAJDEEP MOBILE POINT (SURAJPUR) (REAL)'],
    ['rana','RANA ENTERPRISES (DADRI) (REAL)'],
    ['ranaent','RANA ENTERPRISES (DADRI) (REAL)'],
    ['riyaj','RIYAJ MOBILE STORE (SECTOR 63) (REAL)'],
    ['riyajmobilestore','RIYAJ MOBILE STORE (SECTOR 63) (REAL)'],
    ['royal','ROYAL MOBILE HOUSE & ELECTRONICS(REAL)'],
    ['royalmobilehouse','ROYAL MOBILE HOUSE & ELECTRONICS(REAL)'],
    ['scphone','S C PHONE PLAZA (KULESHRA) (REAL)'],
    ['scphoneplaza','S C PHONE PLAZA (KULESHRA) (REAL)'],
    ['sm','S.M TRADERS (KASNA) (REAL)'],
    ['smtraders','S.M TRADERS (KASNA) (REAL)'],
    ['sn','S N COMMUNICATION (HALDONI) (REAL)'],
    ['sncomm','S N COMMUNICATION (HALDONI) (REAL)'],
    ['satnam','SATNAM MOBILE STORE (KULESRA) (REAL)'],
    ['satnammobilestore','SATNAM MOBILE STORE (KULESRA) (REAL)'],
    ['sharma','SHARMA COMMUNICATION (GN) (REAL)'],
    ['sharmacomm','SHARMA COMMUNICATION (GN) (REAL)'],
    ['shivshakti','SHIV SHAKTI ELECTRONICS (KASNA) (REAL)'],
    ['shivshaktielectronics','SHIV SHAKTI ELECTRONICS (KASNA) (REAL)'],
    ['shreebalajimobilecenter','SHREE BALAJI MOBILE CENTER (KASNA) (REAL)'],
    ['shreebalajielectronics','SHREE BALAJI ELECTRONICS & MOBILE WORLD(REAL)'],
    ['shreebalajimobileworld','SHREE BALAJI ELECTRONICS & MOBILE WORLD(REAL)'],
    ['shrigogaji','SHRI GOGAJI ENTERPRISES (JEWAR) (REAL)'],
    ['shrigogajient','SHRI GOGAJI ENTERPRISES (JEWAR) (REAL)'],
    ['gurukripa','SHRI GURU KRIPA TELECOM CENTER (SECTROR 141) (REAL)'],
    ['shrigurukripa','SHRI GURU KRIPA TELECOM CENTER (SECTROR 141) (REAL)'],
    ['shrisahibji','SHRI SAHIB JI MOBILE SOLUTIONS (REAL)'],
    ['sahibji','SHRI SAHIB JI MOBILE SOLUTIONS (REAL)'],
    ['shubhamelectroworld','SHUBHAM ELECTRO WORLD (DADRI) (REAL)'],
    ['shyamlal','SHYAM LAL & SONS (G.B NAGAR) (REAL)'],
    ['shyamlalandsons','SHYAM LAL & SONS (G.B NAGAR) (REAL)'],
    ['sonu','SONU COMMUNICATION (DADRI) (REAL)'],
    ['sonucomm','SONU COMMUNICATION (DADRI) (REAL)'],
    ['star','STAR TELECOM CENTER (SECTOR 93) (REAL)'],
    ['startelecom','STAR TELECOM CENTER (SECTOR 93) (REAL)'],
    ['mobilehouse','THE MOBILE HOUSE (GN) (REAL)'],
    ['themobilehouse','THE MOBILE HOUSE (GN) (REAL)'],
    ['mobilelife','THE MOBILE LIFE (ANSAL PLAZA) (REAL)'],
    ['themobilelife','THE MOBILE LIFE (ANSAL PLAZA) (REAL)'],
    ['unique','UNIQUE TELECOM (REAL)'],
    ['uniquetelecom','UNIQUE TELECOM (REAL)'],
    ['vk','V.K MOBILE POINT (HALDONI) (REAL)'],
    ['vkmobilepoint','V.K MOBILE POINT (HALDONI) (REAL)'],
    ['vardan','VARDAN COMMUNICATION (GN) (REAL)'],
    ['vardancomm','VARDAN COMMUNICATION (GN) (REAL)'],
    ['ar','A R COMMUNICATION (JAGAT FARM) (REAL)'],
    ['arcomm','A R COMMUNICATION (JAGAT FARM) (REAL)'],
    ['balajimobile','BALAJI MOBILE ZONE (DADRI) (REAL)'],
    ['balajimobilezone','BALAJI MOBILE ZONE (DADRI) (REAL)'],
    ['balajitelecom','BALAJI TELECOM (SECTOR-65) (REAL)'],
    ['bhagwati','BHAGWATI TELECOM (GN) (REAL)'],
    ['bhagwatitelecom','BHAGWATI TELECOM (GN) (REAL)'],
    ['bhoomi','BHOOMI MOBILE SOLUTION (DADRI) (REAL)'],
    ['bhoomimobilesolution','BHOOMI MOBILE SOLUTION (DADRI) (REAL)'],
    ['choudhary','CHOUDHARY TELECOM (DADRI) (REAL)'],
    ['choudharytelecom','CHOUDHARY TELECOM (DADRI) (REAL)'],
    ['gadgetdoctors','GADGET DOCTORZ (NOIDA) (REAL)'],
    ['istore','I STOR (ANSAL) (REAL)'],
    ['jaiambey2','JAI AMBEY COMMUNICATION -2 (GN) (REAL)'],
    ['jaiambeycomm2','JAI AMBEY COMMUNICATION -2 (GN) (REAL)'],
    ['kgn','K G N COMMUNICATION (NAYA GAON) (REAL)'],
    ['kgncomm','K G N COMMUNICATION (NAYA GAON) (REAL)'],
    ['kamal','KAMAL ELECTROMART (NOIDA) (REAL)'],
    ['kamalelectromart','KAMAL ELECTROMART (NOIDA) (REAL)'],
    ['lk','L.K Mobile Point (KASNA) (REAL)'],
    ['lkmobilepoint','L.K Mobile Point (KASNA) (REAL)'],
    ['lavi','LAVI ENTERPRISES (SECTOR 16B) (REAL)'],
    ['lavient','LAVI ENTERPRISES (SECTOR 16B) (REAL)'],
    ['mr','M.R COMMUNICATION (KASNA) (REAL)'],
    ['mrcomm','M.R COMMUNICATION (KASNA) (REAL)'],
    ['mahalaxmi','MAHALAXMI ELECTRONICS MART (AICHER) (REAL)'],
    ['mahalaxmielectronicsmart','MAHALAXMI ELECTRONICS MART (AICHER) (REAL)'],
    ['mobilejunction','Mobile Junction (SECTOR 4) (REAL)'],
    ['mrk','MRK TRADERS (KASNA) (REAL)'],
    ['mrktraders','MRK TRADERS (KASNA) (REAL)'],
    ['nk','N.K.TELECOM (SECT-87)(REAL)'],
    ['nktelecom','N.K.TELECOM (SECT-87)(REAL)'],
    ['ranveer','RANVEER TELECOM(SECT-65) (REAL)'],
    ['ranveertelecom','RANVEER TELECOM(SECT-65) (REAL)']
]);

function excelDateParser(serial) {
    const day0 = new Date(1899, 11, 30);
    let date =  new Date(day0.getTime() + serial * 86400000);
    date.setHours(date.getHours() + 5, date.getMinutes() + 30);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
}

function pad(str,len) {
    const currLen = str.length;
    for(var i=1;currLen+i<=len;i++){
        str+=' '
    }
    return str
}

app.get(process.env.uri, (req, res) => {
    res.render(process.env.h, {
        dealerDetails: [],
        modelDetails: [],
        fosDetails: [],
        suri:process.env.suri,
        muri:process.env.muri,
        ouri:process.env.ouri,
        auri:process.env.auri,
        duri:process.env.duri,
        mduri:process.env.mduri,
        uri:process.env.uri
    })
});

app.post(process.env.uri, upload.single('file'), (req, res) => {
    var cnt=0;
    const workbook = xlsx.readFile(req.file.path);
    const sheets = workbook.SheetNames;
    for (const sheetName of sheets) {
        if(sheetName==="PORTAL DATA"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const warehouse = [], marketSale=[], marketStock=[];
            for(data in sheetData){
                const entry = sheetData[data];
                if(entry.hasOwnProperty("Dealer Name")){
                    if(entry.hasOwnProperty("Activate Time")){
                        if(new Date(entry["Activate Time"]).getMonth() == new Date().getMonth()){
                            marketSale.push({
                                IMEI: entry["IMEI/SN"],
                                Model: entry["SPU Name"],
                                ModelSpec: entry["SKU Spec"],
                                Color: entry["Color"],
                                Distributor: entry["Dealer Name"],
                                ActivationTime: new Date(entry["Activate Time"])
                            })
                        }
                    }
                    else{
                        marketStock.push({
                            IMEI: entry["IMEI/SN"],
                            Model: entry["SPU Name"],
                            ModelSpec: entry["SKU Spec"],
                            Color: entry["Color"],
                            Distributor: entry["Dealer Name"]
                        })
                    }
                }
                else{
                    warehouse.push({
                        IMEI: entry["IMEI/SN"],
                        Model: entry["SPU Name"],
                        ModelSpec: entry["SKU Spec"],
                        Color: entry["Color"]
                    })
                }
            }               
            Promise.all([warehouseModel.deleteMany(), marketSaleModel.deleteMany(), marketStockModel.deleteMany()])
                .then(()=>{
                    Promise.all([warehouseModel.insertMany(warehouse), marketSaleModel.insertMany(marketSale), marketStockModel.insertMany(marketStock)])
                        .then(()=>{
                            console.log('PortalStockSuccess')
                            cnt++;
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
                            }
                        })                          
                        .catch((err)=>{
                            console.log("Re Upload the correct portal stock")
                        })

                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="TALLY DATA"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const tally = [];
            for(var i=0;i<sheetData.length;i++){
                const entry=sheetData[i];
                const imei = entry["IMEI No1"], date = new Date(excelDateParser(entry["Bill Date"]));
                let existingRecord = tally.find(record => record.IMEI === imei);
                if (!existingRecord) {
                    tally.push({
                        IMEI: imei,
                        Distributor: entry["Party Name"],
                        Date: date
                    })
                } else {
                    if (date > existingRecord.date) {
                        existingRecord.date = date;
                        existingRecord.Distributor = entry["Party Name"];
                    }
                }
            }
            tallyModel.deleteMany({})
                .then(()=>{
                    tallyModel.insertMany(tally)
                        .then(()=>{
                            console.log('TallySuccess')
                            cnt++
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct tally data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="NAME COMPATABLE"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const name = [], fos=[];
            for(var i=0;i<sheetData.length;i++){
                const entry = sheetData[i];
                name.push({
                    TallyName: entry["TALLY NAME"] === undefined ? "" : entry["TALLY NAME"],
                    PortalName: entry["Dealer Name"] === undefined ? "" : entry["Dealer Name"]
                })
                fos.push({
                    Distributor: entry["TALLY NAME"] === undefined ? "" : entry["TALLY NAME"],
                    FOS: entry["FOS"] === undefined ? "" : entry["FOS"]
                })
            }
            Promise.all([nameModel.deleteMany(), fosModel.deleteMany()])
                .then(()=>{
                    Promise.all([nameModel.insertMany(name), fosModel.insertMany(fos)])
                        .then(()=>{
                            console.log('NameCompatable & FOS Success')
                            cnt++
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
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
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const price = [];
            for(var i=0;i<sheetData.length;i++){
                const entry = sheetData[i];
                price.push({
                    Model: entry["SPU Name"],
                    ModelSpec: entry["SKU Spec"],
                    DP: entry["DP"]
                })
            }
            priceModel.deleteMany({})
                .then(()=>{
                    priceModel.insertMany(price)
                        .then(()=>{
                            console.log('DPSuccess')
                            cnt++
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct dp data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="DAYS OUTSTANDING"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const outstdDays = [];
            for(var i=0;i<sheetData.length;i++){
                const entry = sheetData[i];
                const billDate = entry["DATE"];
                const targetDate = new Date(excelDateParser(billDate));
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                const differenceInMilliseconds = today - targetDate;
                const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)) - 1;
                outstdDays.push({
                    Distributor: entry["NAME"],
                    Amount: entry["AMOUNT"],
                    Bill: entry["BILL NO."],
                    Days: differenceInDays
                })
            }
            outstandingDaysModel.deleteMany({})
                .then(()=>{
                    outstandingDaysModel.insertMany(outstdDays)
                        .then(()=>{
                            console.log('OutstandingDaysSuccess')
                            cnt++
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct outstanding days data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="OUTSTANDING"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const outstd = [];
            for(var i=0;i<sheetData.length;i++){
                const entry = sheetData[i];
                var to6={}
                to6["Distributor"]=entry["PARTY NAME"]
                var a=entry["Debit"]
                var b=entry["Credit"]
                if(a==undefined){
                    to6["Outstanding"]=-1*parseInt(b)
                }
                else{
                    to6["Outstanding"]=parseInt(a)
                }
                outstd.push(to6)
            }
            outstandingModel.deleteMany({})
                .then(()=>{
                    outstandingModel.insertMany(outstd)
                        .then(()=>{
                            console.log('OutstandingSuccess')
                            cnt++
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct outstanding data")
                        })
                })
                .catch((err)=>{
                })
        }
        else if(sheetName==="CHQ DETAILS"){
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            const chq = [];
            for(var i=0;i<sheetData.length;i++){
                const entry = sheetData[i];
                chq.push({
                    Distributor: entry["TALLY NAME"],
                    Chq: entry["AMOUNT"] == undefined ? 0 : entry["AMOUNT"]
                })
            }
            chqModel.deleteMany({})
                .then(()=>{
                    chqModel.insertMany(chq)
                        .then(()=>{
                            console.log('ChequeSuccess')
                            cnt++
                            if(cnt==7){
                                console.log("Completed")
                                console.log(new Date())
                                res.redirect(process.env.uri);
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct cheque data")
                        })
                })
                .catch((err)=>{
                })
        }
    }
    fs.unlinkSync(req.file.path);
});

var numbers=['whatsapp:+917303470338','whatsapp:+918860024618','whatsapp:+919810143424']

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
            dlr=dlr.split(' ').join('');
        dlr=stringSimilarity.findBestMatch(dlr,Array.from(dummy.keys())).bestMatch.target;
        dlr=dummy.get(dlr);
        let response = '*'+'Name:'+'*'+' '+dlr+'\n';
        nameModel.find({'TallyName': dlr})
            .then((value)=>{
                const nameList = [value[0].TallyName, value[0].PortalName];    
                tallyModel.distinct('IMEI',tallyModel.find({'Distributor': { $in: nameList }}))
                     .then((value) => {
                        const imeis = value;
                        const arr = [];
                        arr.push(chqModel.find({"Distributor": { $in: nameList }}));
                        arr.push(outstandingModel.find({"Distributor": { $in: nameList }}));
                        arr.push(outstandingDaysModel.find({"Distributor": { $in: nameList }}));
                        arr.push(fosModel.find({"Distributor": { $in: nameList }}));
                        arr.push(marketStockModel.find({"IMEI": { $in: imeis }}));
                        arr.push(marketSaleModel.find({"IMEI": { $in: imeis }}));
                        arr.push(priceModel.find({}));
                        Promise.all(arr)
                            .then((value)=>{
                                const chq=value[0].length==0?0:value[0][0].Chq, outstd=value[1].length==0?0:value[1][0].Outstanding, daysoutstd = value[2], fos = value[3].length==0?'':value[3][0].FOS, stock = value[4], sale = value[5], dp = value[6];
                                let fifteenDaysOutstd = 0, twentyDaysOutstd = 0, stockVal = 0, stockQty = 0, saleVal = 0, saleQty = 0;
                                //stock
                                stockQty = stock.length;
                                for(var itr=0;itr<stockQty;itr++){
                                    const name = stock[itr].Model, spec = stock[itr].ModelSpec;
                                    const price = dp.find(record => record.Model == name && record.ModelSpec == spec).DP;
                                    stockVal += price;
                                }
                                stockVal = Math.round(stockVal);
                                //sale
                                saleQty = sale.length;
                                for(var itr=0;itr<saleQty;itr++){
                                    const name = sale[itr].Model, spec = sale[itr].ModelSpec;
                                    const price = dp.find(record => record.Model == name && record.ModelSpec == spec).DP;
                                    saleVal += price;
                                }
                                saleVal = Math.round(saleVal);
                                daysoutstd.sort((a, b) => b.Days - a.Days);
                                response += '*'+'FOS:'+'*'+' '+fos+'\n';
                                response += '*'+'Total Outstanding:'+'*'+' '+outstd.toString()+'\n';
                                response += '*'+'Stock:'+'*'+' '+stockQty.toString()+' ( '+stockVal.toString()+' )'+'\n';
                                response += '*'+'Sale:'+'*'+' '+saleQty.toString()+' ( '+saleVal.toString()+' )'+'\n';
                                response += '*'+'Chq Details:'+'*'+' '+chq.toString()+'\n';
                                response += '*'+'Days Outstanding:'+'*'+'\n';
                                response += '+------------------------+'+'\n';
                                response += '| Bill No. | Amount   | Days |'+'\n';
                                response += '+------------------------+'+'\n';
                                for( var itr=0;itr<daysoutstd.length;itr++){
                                    const billNo = daysoutstd[itr].Bill.split('-')[2], amount = daysoutstd[itr].Amount, days = daysoutstd[itr].Days;
                                    if(days>=15){
                                        fifteenDaysOutstd+=amount;
                                    }
                                    if(days>=20){
                                        twentyDaysOutstd+=amount;
                                    }
                                    response +='| '+pad(billNo,8)+' | '+pad(amount.toString(),9)+' | '+pad(days.toString(),6)+' |'+'\n'; 
                                }
                                response += '+------------------------+'+'\n';
                                response += '*'+'Fifteen Days Outstanding:'+'*'+' '+fifteenDaysOutstd.toString()+'\n';
                                response += '*'+'Twenty Days Outstanding:'+'*'+' '+twentyDaysOutstd.toString()+'\n';
                                client.messages.create({
                                    from: process.env.NO,
                                    to: fromNumber,
                                    body: response
                                }).then(message => {
                                    console.log('Message sent:', message.sid);
                                    res.end(twiml.toString());
                                }).catch(error => {
                                    console.error('Error sending message:', error);
                                    res.status(500).end();
                                });
                            })
                            .catch((err)=>{
                                console.log("Unable to get details for the given dealer");
                            })
                     }) 
                     .catch((err) => {
                        console.log("Error getting imei data for given input");
                     })               
            })
            .catch((err)=>{
                console.log("Error getting data for given input");
            })
        }
    }
    else{
        console.log("Unauthorised User: "+fromNumber.toString());
    }
});

app.listen(port, () => console.log('server run at port ' + port));
