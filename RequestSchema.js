var mongoose = require('mongoose');
var Request =new mongoose.Schema({
    resholdername :{
        type : String
    },
    resourcewant :{
        type : String
    },
    requestmaker :{
        type : String
    },
    restime :{
        type : String
    }
})
mongoose.model('Request',Request);
