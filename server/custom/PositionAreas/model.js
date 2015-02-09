var mongoose = require('mongoose');


    var nd_historyPositionAreasSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var PositionAreasSchema = new mongoose.Schema({ 
         positionArea: {type: String, required: true},
         code: {type: String},
         nd_history: [nd_historyPositionAreasSchema]
    }, { collection: config.app.customCollectionsPrefix+'PositionAreas' })


var PositionAreas = connection.model('PositionAreas', PositionAreasSchema);
module.exports = PositionAreas;