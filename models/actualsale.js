var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    IMEI:{
        type:Number
    },
    Model:{
        type:String
    },
    Distributor:{
        type:String
    },
});

module.exports = mongoose.model('actualsalerecords',csvSchema);