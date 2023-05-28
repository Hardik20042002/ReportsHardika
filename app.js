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
var outstandingModel = require('./models/outstanding');
var chqModel = require('./models/cheque');
var ovdModel = require('./models/overdue');
var bodyParser = require('body-parser');
var stringSimilarity = require("string-similarity");
require('dotenv').config();
const accountSid = process.env.SID;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
const twilio = require('twilio');
const outstanding = require('./models/outstanding');
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
var colors=[]
var models=[]
var fosds=[]
var temp1,temp2,temp3,temp4,temp5
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
    ['atoz','0131000877'],
    ['atozmobile','0131000877'],
    ['aman','IN119161'],
    ['amanmobilestore','IN119161'],
    ['ambe','0131001006'],
    ['ambey','0131001006'],
    ['ambesoftwareandhardwarerepcentre','0131001006'],
    ['arish','0131001450'],
    ['arishmobilecenter','0131001450'],
    ['atul','0131000020'],
    ['atultelecomcentre','0131000020'],
    ['avni','0131005179'],
    ['avnimobileshop','0131005179'],
    ['anupam','0131003213'],
    ['anupamtelecom','0131003213'],
    ['anushka','0131002043'],
    ['anushkamobilecenter','0131002043'],
    ['anushkamobilecenter2','0131002043'],
    ['ayush','0131002292'],
    ['ayushcommunication','0131002292'],
    ['balajimobilezone','0131000914'],
    ['balajidadri','0131000914'],
    ['balajimobileandelectronics','0131000914'],
    ['bansiwala','0131000293'],
    ['bansiwalastores','0131000293'],
    ['bhoomi','IN117968'],
    ['bhoomimobilesolution','IN117968'],
    ['brs','0131000205'],
    ['brselectronics','0131000205'],
    ['balajitrader','0131002504'],
    ['balajitraders','0131002504'],
    ['computer','0131002931'],
    ['wizard','0131002931'],
    ['computerwizard','0131002931'],
    ['devent','0131002606'],
    ['deventerprises','0131002606'],
    ['devcom','0131005180'],
    ['devcommunication','0131005180'],
    ['divine','IN120674'],
    ['divinecom','IN120674'],
    ['famous','0131000459'],
    ['famousmobilepoint','0131000459'],
    ['fauji','0131000171'],
    ['faujitelecom','0131000171'],
    ['goel','0131002633'],
    ['samarth','0131002633'],
    ['goelmobileandsamarthelectronics','0131002633'],
    ['istore','0131002917'],
    ['ishu','0131005149'],
    ['ishucommunication','0131005149'],
    ['jagdamba','0131001118'],
    ['jagdambamobilehub','0131001118'],
    ['jaiambeyent','IN109586'],
    ['jaiambeyenterprises','IN109586'],
    ['jaiambeycommunicationenterprises','IN109586'],
    ['jaiambeent','IN109586'],
    ['jrb','IN121471'],
    ['jrbtelecom','IN121471'],
    ['jaiambeycom','0131002592'],
    ['jaiambeycommunication','0131002592'],
    ['jaiambecom','0131002592'],
    ['kgn','IN120694'],
    ['kgncom','IN120694'],
    ['kgncommunication','IN120694'],
    ['kanika','0131000704'],
    ['kanikacommunication','0131000704'],
    ['kashish','IN102857'],
    ['kashishcommunication','IN102857'],
    ['kgad','IN102858'],
    ['kgadmobiworld','IN102858'],
    ['krishna','0131002197'],
    ['krishnatelecom','0131002197'],
    ['keshav','0131002226'],
    ['keshavmobilepoint','0131002226'],
    ['lk','IN120878'],
    ['lkmobilepoint','IN120878'],
    ['mr','0131002628'],
    ['mrcom','0131002628'],
    ['mrcommunication','0131002628'],
    // ['ms','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['mscom','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['msdivinecom','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['msdivine','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['msdivinecommunication','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    // ['mscommunication','M/S DIVINE COMMUNICATION ! GREATER NOIDA'],
    ['mahalaxmip','0131000806'],
    ['mahalaxmimobilepoint','0131000806'],
    ['mahalaxmipoint','0131000806'],
    ['mahalaxmis','IN112369'],
    ['mahalaxmimobilestore','IN112369'],
    ['mahalaxmistore','IN112369'],
    ['matrix','0131000962'],
    ['matrixmobilestore','0131000962'],
    ['hotspot','IN110695'],
    ['mobilehotspot','IN110695'],
    ['mobilehotspot','IN110695'],
    ['shingar','0131001417'],
    ['shinghar','0131001417'],
    ['mobileshingar','0131001417'],
    ['solution','0131005097'],
    ['mobilesolution','0131005097'],
    ['mobileworld','0131005093'],
    ['world','0131005093'],
    ['newlavish','0131001683'],
    ['newlavishcom','0131001683'],
    ['lavish','0131001683'],
    ['newradhey','0131000546'],
    ['radhey','0131000546'],
    ['newrajdeep','0131001738'],
    ['newrajdeepmobilepoint','0131001738'],
    ['newuniversal','0131001951'],
    ['newuniversalofficesystem','0131001951'],
    ['noble','0131003071'],
    ['nobel','0131003071'],
    ['noblemobileshope','0131003071'],
    ['noor','0131002723'],
    ['noorcom','0131002723'],
    ['om','IN122886'],
    ['omcom','IN122886'],
    ['omsai','0131002143'],
    ['omsaicom','0131002143'],
    ['pandey','0131002227'],
    ['pandeycom','0131002227'],
    ['pooja','0131000713'],
    ['poojacom','0131000713'],
    ['praveen2','0131005151'],
    ['praveen-2','0131005151'],
    ['praveenmobilecenter2','0131005151'],
    ['praveen','0131001335'],
    ['praveen1','0131001335'],
    ['praveensurajpur','0131001335'],
    ['praveenmobilecenter','0131001335'],
    ['priyanka','0131000966'],
    ['priyankamobileworld','0131000966'],
    ['prince','0131005153'],
    ['princeent','0131005153'],
    ['rk','0131005092'],
    ['rktelecom','0131005092'],
    ['rahul','0131001001'],
    ['rahultelecom','0131001001'],
    ['rana','IN122846'],
    ['ranaent','IN122846'],
    ['rajdeep','0131002429'],
    ['rajdeepmobilepoint','0131002429'],
    ['royal','0131000479'],
    ['royalmobilehouseandelectronics','0131000479'],
    ['sn','0131000904'],
    ['sncom','0131000904'],
    ['sm','0131001733'],
    ['smtrader','0131001733'],
    ['sachin','IN109590'],
    ['sachintelecomandmobileshop','IN109590'],
    ['sanchar','0131002907'],
    ['sancharbhawan','0131002907'],
    ['satnam','IN107899'],
    ['satnammobilestore','IN107899'],
    ['shivshakti','IN109083'],
    ['shivshaktielectronics','IN109083'],
    ['shivtraders','0131001390'],
    ['shivsurajpur','0131001390'],
    ['shreebaba','0131001872'],
    ['baba','0131001872'],
    ['shreebabacom','0131001872'],
    ['shreebalajicom','0131001151'],
    ['shreebalajisurajpur','0131001151'],
    ['shreebalajicommunication','0131001151'],
    ['shreebalajicenter','0131002629'],
    ['shreebalajimobilecentre','0131002629'],
    ['shreebalajikasna','0131002629'],
    ['shreeram','IN121456'],
    ['shreerammobilegallery','IN121456'],
    ['shrisahibji','0131001765'],
    ['shrisahib','0131001765'],
    ['sahib','0131001765'],
    ['shrisahibjimobilesolution','0131001765'],
    ['shrisahibji2','0131000714'],
    ['shrisahib2','0131000714'],
    ['sahib2','0131000714'],
    ['shrisahibjimobilesolution2','0131000714'],
    ['sony','0131001067'],
    ['sonyelectronics','0131001067'],
    ['star','0131001871'],
    ['startelecom','0131001871'],
    ['susshma','0131000254'],
    ['sushma','0131000254'],
    ['susshmamobilepoint','0131000254'],
    ['sandeep','HARDIKA001'],
    ['sanjay','0131002604'],
    ['sanjaycom','0131002604'],
    ['shyamlal','0131002428'],
    ['shyamlalandsons','0131002428'],
    ['shyam','0131002428'],
    ['tomar','IN120680'],
    ['tomarelectronics','IN120680'],
    ['tanish','0131001337'],
    ['tanishq','0131001337'],
    ['tanishtelecom','0131001337'],
    ['mobilelife','0131002921'],
    ['life','0131002921'],
    ['themobilelife','0131002921'],
    ['universal','0131000442'],
    ['cafe','0131000442'],
    ['universalmobilecafe','0131000442'],
    ['universalcafe','0131000442'],
    ['vk','0131004902'],
    ['vkmobilepoint','0131004902'],
    ['vaishnav','0131001071'],
    ['vaishnavtelecom','0131001071'],
    ['vishal','IN109248'],
    ['vikky','0131002331'],
    ['viky','0131002331'],
    ['vikkycom','0131002331'],
    ['yash','IN102147'],
    ['yashsanchar','IN102147'],
    ['raja','0131000825'],
    ['rajamobile','0131000825'],
    ['rinku','0131000963'],
    ['rinkumobile','0131000963'],
])

app.get(process.env.uri, (req, res) => {
    let a = imeiModel.distinct("Distributor")
    let b = imeiModel.distinct("Model")
    let c = imeiModel.distinct("Color")
    let d = fosModel.distinct("FOS")
    temp1=undefined
    temp2=undefined
    temp3=undefined
    temp4=undefined
    temp5=undefined
    Promise.all([a, b,c,d]).then((returnedValues) => {
        const [dealer, model,color, fosd] = returnedValues;
        dealers=dealer
        colors=color
        models=model
        fosds=fosd
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
                to1["Color"]=sheetData[i]["Color"]
                to1["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
                to1["VerificationTime"]=null
                objct1.push(to1)
            }
            imeiModel.deleteMany({'VerificationTime':null})
                .then(()=>{
                    imeiModel.insertMany(objct1)
                        .then(()=>{
                            console.log('PortalStockSuccess')
                            cnt++;
                            if(cnt==15){
                                var updatearr=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
        else if(sheetName==="VARIFICATIONSALE"){
            var objct2=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to2={}
                temp = parseFloat(sheetData[i]["IMEI 1"])
                to2["IMEI"] = temp;
                to2["Model"]=sheetData[i]["Product Model"]
                to2["Color"]=sheetData[i]["Color"]
                to2["Distributor"]=sheetData[i]["Sales Store Code"]
                to2["VerificationTime"]=sheetData[i]["Verification Time"]
                objct2.push(to2)
            }
            imeiModel.deleteMany({'VerificationTime':{$ne:null}})
                .then(()=>{
                    imeiModel.insertMany(objct2)
                        .then(()=>{
                            console.log('VarificationSaleSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct verification sale")
                        })
                })
                .catch((err)=>{
                    
                })
        }
        else if(sheetName==="EWARRANTYSALE"){
            var objct3=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to3={}
                to3["IMEI"] = sheetData[i]["IMEI 1"]
                to3["Model"]=sheetData[i]["Product Model"]
                to3["Distributor"]=sheetData[i]["Sales Store Code"]
                objct3.push(to3)
            }
            actualSaleModel.deleteMany({})
                .then(()=>{
                    actualSaleModel.insertMany(objct3)
                        .then(()=>{
                            console.log('EWarrantySaleSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
                                })
                            }                            
                        })
                        .catch((err)=>{
                            console.log("Re Upload the correct ewarranty sale")
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
                to4["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
            outstandingModel.deleteMany({})
                .then(()=>{
                    outstandingModel.insertMany(objct6)
                        .then(()=>{
                            console.log('TallyOutstandingSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                to8["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
                to8["SALE"]=parseFloat(sheetData[i]["SALE"])
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                to9["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                to10["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                to11["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                to12["PortalName"]=sheetData[i]["Affiliated Warehouse/Store ID"]
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
            var objct13=[]
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(worksheet);
            for(var i=0;i<sheetData.length;i++){
                var to13={}
                to13["Model"]=sheetData[i]["Model"]
                to13["DP"]=sheetData[i]["DP"]
                objct13.push(to13)
            }
            priceModel.deleteMany({})
                .then(()=>{
                    priceModel.insertMany(objct13)
                        .then(()=>{
                            console.log('DPSuccess')
                            cnt++
                            if(cnt==15){
                                var updatearr=[]
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                                for(var i=0;i<object.length;i++){
                                    var dist=object[i]["Distributor"]
                                    var im=object[i]["IMEI"]
                                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                                        {
                                            $set:{
                                                "Distributor":dist
                                            }
                                        }
                                    ))
                                }
                                Promise.all(updatearr).then(()=>{
                                    console.log("Completed")
                                    console.log(new Date())
                                    res.redirect(process.env.uri);
                                }).catch((err)=>{
                                    console.log("Re Upload the correct REUPLOADING file")
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
                to15["Distributor"]=sheetData[i]["Affiliated Warehouse/Store ID"]
                to15["IMEI"]=parseFloat(sheetData[i]["IMEI 1"])
                object.push(to15)
            }
            cnt++;
            if(cnt==15){
                var updatearr=[]
                for(var i=0;i<object.length;i++){
                    var dist=object[i]["Distributor"]
                    var im=object[i]["IMEI"]
                    updatearr.push(imeiModel.updateOne({"IMEI":im},
                        {
                            $set:{
                                "Distributor":dist
                            }
                        }
                    ))
                }
                Promise.all(updatearr).then(()=>{
                    console.log("Completed")
                    console.log(new Date())
                    res.redirect(process.env.uri);
                }).catch((err)=>{
                    console.log("Re Upload the correct REUPLOADING file")
                })
            }
        }
    }
    fs.unlinkSync(req.file.path);
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
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                    else{
                        t=[]
                        for(var i=0;i<temp2.length;i++){
                            t.push(imeiModel.distinct('Color',imeiModel.find({'Model':temp2[i]})));
                        }
                        Promise.all(t).then((value)=>{
                            arr1=value;
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
                            }).catch((err)=>{
                                console.log(err)
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
            nameModel.find({},(err,names)=>{
                nameMap=new Map()
                for(var i=0;i<names.length;i++){
                    nameMap.set(names[i].PortalName,names[i].TallyName)
                }
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
                        outstandingreports.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':nameMap.get(t1[i])})))
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
                                'ovd':array[itr+5],
                                'qty':sum1,
                                'price':sum2,
                            })
                            itr+=6
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
            var dd=[]
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
                dd.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":dealers[i]})))
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
                    outreport.push(imeiModel.find({"Distributor":dlr,"Model":v[2][i],"VerificationTime":{$ne:null}}).count())
                }
                outreport.push(fosModel.distinct('FOS',fosModel.find({'Distributor':dlr})))
                outreport.push(classModel.distinct('CLASS',classModel.find({'Distributor':dlr})))
                outreport.push(limitModel.distinct('Limit',limitModel.find({'Distributor':dlr})))
                outreport.push(outstandingModel.distinct('Outstanding',outstandingModel.find({'Distributor':nameMap.get(dlr)})))
                outreport.push(chqModel.distinct('Chq',chqModel.find({'Distributor':nameMap.get(dlr)})))
                outreport.push(ovdModel.distinct('Overdue',ovdModel.find({'Distributor':nameMap.get(dlr)})))
                outreport.push(prevModel.distinct('SALE',prevModel.find({'Distributor':dlr})))
                Promise.all(outreport).then((value)=>{
                    var itr=0,maxmodel=5
                    var sum1=0,sum2=0,tstk=0,tsal=0
                    var ssarr=[]
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
                        var name=models[i].split(' ').join('').substr(4)
                        name=name.split('(')[0]+' '+name.split('(')[1].split('+')[0]+','+name.split('(')[1].split('+')[1].split('G')[0]
                        if(x!=0||value[itr+4]!=0){
                            ssarr.push({
                                "model":name,
                                "stock":x,
                                "sale":value[itr+4]
                            })
                            tstk+=x;
                            tsal+=value[itr+4]
                            if(maxmodel<name.length){
                                maxmodel=name.length
                            }
                        }
                        sum1+=x;
                        sum2+=(x*value[itr+3])
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
                    for(var i=0;i<ssarr.length;i++){
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
                    console.log(salestock)
                    var out=parseFloat(value[itr+3])+parseFloat(value[itr+4])
                    var gap=parseFloat(out)-parseFloat(sum2)
                    var lastMonth=parseFloat(value[itr+6])
                    var dealerName=[]
                    dealerName.push(nameModel.distinct("TallyName",nameModel.find({"PortalName":dlr})))
                    Promise.all(dealerName).then((val)=>{
                        nm=val
                        var msg='*'+nm[0][0].split('(')[0]+'*'+'\n'+'*Date:* '+date+'\n'+'*T.Outstanding:* '+out.toString()+'\n'+'*Above 15Days:* '+value[itr+5].toString()+'\n'+'*Yesterday Deposit:* '+value[itr+4].toString()+'\n'+'*Stock Value:* '+sum2.toString()+'\n'+'*Gap:* '+gap.toString()+'\n'+'*Limit:* '+value[itr+2].toString()+'\n'+'```'+salestock+'```'+'Last Month Sale: '+lastMonth.toString()+'\n'
                        // res.send({
                        //     message:msg
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
        })
    }
});

app.listen(port, () => console.log('server run at port ' + port));
