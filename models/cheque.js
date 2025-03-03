var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    Chq:{
        type:Number
    }
});

module.exports = mongoose.model('chequerecords',csvSchema);