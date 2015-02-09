var mongoose = require('mongoose');


    var nd_historyDepartmentsSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var DepartmentsSchema = new mongoose.Schema({ 
         department: {type: String, required: true},
         nd_history: [nd_historyDepartmentsSchema]
     }, { collection: config.app.customCollectionsPrefix+'Departments' })


var Departments = connection.model('Departments', DepartmentsSchema);
module.exports = Departments;