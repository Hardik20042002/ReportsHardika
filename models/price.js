var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Model:{
        type:String
    },
    DP:{
        type:Number
    }
});

module.exports = mongoose.model('pricerecords',csvSchema);