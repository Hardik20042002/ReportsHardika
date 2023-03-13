var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    TallyName:{
        type:String
    },
    PortalName:{
        type:String
    },
});

module.exports = mongoose.model('dealernamerecords',csvSchema);