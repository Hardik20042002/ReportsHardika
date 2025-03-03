var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    IMEI:{
        type:Number
    },
    Distributor:{
        type:String
    },
    Model:{
        type:String
    },
    ModelSpec:{
        type:String,
        default: ""
    },
    Color:{
        type:String
    },
    ActivationTime:{
        type:Date
    }
});

module.exports = mongoose.model('marketsalerecords',csvSchema);