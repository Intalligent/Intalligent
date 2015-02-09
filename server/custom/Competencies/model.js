var mongoose = require('mongoose');


    var nd_historyCompetenciesSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var CompetenciesSchema = new mongoose.Schema({ 
         competency: {type: String, required: true},
         nd_history: [nd_historyCompetenciesSchema]
     }, { collection: config.app.customCollectionsPrefix+'Competencies' })


var Competencies = connection.model('Competencies', CompetenciesSchema);
module.exports = Competencies;