var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    Outstanding:{
        type:Number
    }
});

module.exports = mongoose.model('outstandingrecords',csvSchema);