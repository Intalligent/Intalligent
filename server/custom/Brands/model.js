var mongoose = require('mongoose');


    var nd_historyBrandsSchema = new mongoose.Schema({ 
         text: String, 
         user_id: String, 
         user_name: String,
         created: { type: Date, default: Date.now } 
    }); 


     var BrandsSchema = new mongoose.Schema({ 
         brand: {type: String, required: true},
         code: {type: String},
         loadBrandCSS: {type: Boolean, required: true},
         brandCSS: {type: String},
         loadBrandHomeFile: {type: Boolean, required: true},
         brandHomeFile: {type: String},
         showBrandLogo: {type: Boolean, required: true},
         brandLogo: {type: String},
         nd_history: [nd_historyBrandsSchema]
     }, { collection: config.app.customCollectionsPrefix+'Brands' })


var Brands = connection.model('Brands', BrandsSchema);
module.exports = Brands;