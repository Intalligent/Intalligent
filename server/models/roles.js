var mongoose = require('mongoose');

var rolesSchema = new mongoose.Schema({
    name: String
}, { collection: config.app.collectionsPrefix+'roles' })

// other virtual / static methods added to schema


// admin methods

var Roles = connection.model('Roles', rolesSchema);
module.exports = Roles;