var mongoose  =  require('mongoose');
var csvSchema=new mongoose.Schema({
    Distributor:{
        type:String
    },
    Overdue:{
        type:Number
    }
});

module.exports = mongoose.model('overduerecords',csvSchema);