var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    FOS:{
        type:String
    },
    CLASS:{
        type:String
    }
});

module.exports = mongoose.model('fosrecords',csvSchema);