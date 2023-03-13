var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    CLASS:{
        type:String
    }
});

module.exports = mongoose.model('classrecords',csvSchema);