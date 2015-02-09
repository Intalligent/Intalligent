var mongoose = require('mongoose');


    var nd_historyPositionCategoriesSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var PositionCategoriesSchema = new mongoose.Schema({ 
         positionCategory: {type: String, required: true},
         code: {type: String},
         nd_history: [nd_historyPositionCategoriesSchema]
    }, { collection: config.app.customCollectionsPrefix+'PositionCategories' })


var PositionCategories = connection.model('PositionCategories', PositionCategoriesSchema);
module.exports = PositionCategories;