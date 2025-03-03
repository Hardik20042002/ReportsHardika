var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    IMEI:{
        type:Number
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
    }
});

module.exports = mongoose.model('warehouserecords',csvSchema);