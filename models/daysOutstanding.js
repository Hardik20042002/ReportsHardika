var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    Amount:{
        type:Number
    },
    Bill:{
        type:String
    },
    Days:{
        type:Number
    }
});

module.exports = mongoose.model('outstandingdaysrecords',csvSchema);