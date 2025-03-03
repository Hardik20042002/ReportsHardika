var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Date:{
        type:Date
    },
    Distributor:{
        type:String
    },
    IMEI:{
        type:Number
    },
});

module.exports = mongoose.model('tallyrecords',csvSchema);