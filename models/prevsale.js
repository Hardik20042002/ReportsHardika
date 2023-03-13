var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    SALE:{
        type:Number
    }
});

module.exports = mongoose.model('prevsalerecords',csvSchema);