var mongoose = require('mongoose');


    var nd_historyActionCategoriesSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var ActionCategoriesSchema = new mongoose.Schema({ 
         actionCategory: {type: String, required: true},
         code: {type: String},
         nd_history: [nd_historyActionCategoriesSchema]
    }, { collection: config.app.customCollectionsPrefix+'ActionCategories' })


var ActionCategories = connection.model('ActionCategories', ActionCategoriesSchema);
module.exports = ActionCategories;