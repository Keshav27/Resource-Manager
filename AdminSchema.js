var mongoose = require('mongoose');
var admin = new mongoose.Schema({
    resname: {
        type: String
    }
})
mongoose.model('admin', admin);
