var mongoose = require('mongoose');
var Resource =new mongoose.Schema({
    resname :{
        type : String
    },
    restime :{
        type : String
    },
    username :{
        type : String
    }
})
mongoose.model('Resource',Resource);
