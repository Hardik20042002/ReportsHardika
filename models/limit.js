var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    Limit:{
        type:String
    },
});

module.exports = mongoose.model('limitrecords',csvSchema);