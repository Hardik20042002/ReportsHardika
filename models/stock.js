var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Model:{
        type:String
    },
    Color:{
        type:String
    },
    Stock:{
        type:Number
    }
});

module.exports = mongoose.model('stockrecords',csvSchema);