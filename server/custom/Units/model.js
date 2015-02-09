var mongoose = require('mongoose');


    var nd_historyUnitsSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var UnitsSchema = new mongoose.Schema({ 
         unit: {type: String, required: true},
         brand: {type: String, required: true},
         nd_history: [nd_historyUnitsSchema]
     }, { collection: config.app.customCollectionsPrefix+'Units' })


var Units = connection.model('Units', UnitsSchema);
module.exports = Units;