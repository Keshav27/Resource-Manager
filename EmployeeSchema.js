var mongoose = require('mongoose');
var EmployerDB =new mongoose.Schema({
    empid :{
        type : String
    },
    name :{
        type : String
    },
    password :{
        type : String
    },
    email :{
        type : String
    },
    contactno :{
        type : String
    }
})
mongoose.model('EmployerDB',EmployerDB);
