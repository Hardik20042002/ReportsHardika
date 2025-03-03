var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Model:{
        type:String
    },
    ModelSpec:{
        type:String,
        default: ""
    },
    DP:{
        type:Number
    }
});

module.exports = mongoose.model('pricerecords',csvSchema);