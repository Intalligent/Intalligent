var mongoose = require('mongoose');


    var nd_historyProfessionalGroupsSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var ProfessionalGroupsSchema = new mongoose.Schema({ 
         professionalGroup: {type: String, required: true},
         code: {type: String},
         nd_history: [nd_historyProfessionalGroupsSchema]
     }, { collection: config.app.customCollectionsPrefix+'ProfessionalGroups' })


var ProfessionalGroups = connection.model('ProfessionalGroups', ProfessionalGroupsSchema);
module.exports = ProfessionalGroups;