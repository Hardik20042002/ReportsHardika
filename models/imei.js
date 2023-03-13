var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    IMEI:{
        type:Number
    },
    Model:{
        type:String
    },
    Color:{
        type:String
    },
    Distributor:{
        type:String
    },
    VerificationTime:{
        type:Date,
        default: null
    }
});

module.exports = mongoose.model('imeirecords',csvSchema);