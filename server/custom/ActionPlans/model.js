var mongoose = require('mongoose');

var ActionPlansSchema = new mongoose.Schema({
    status: {type: Number}, // 1-Not initialized, 2-In progress, 3-Completed
    employeeID: {type: String},
    employeeName: {type: String},
    actionPlanDescription: {type: String, required: true},
    actionPlanInstructions: {type: String},
    actionPlanOrder: {type: Number},
    actionCategory: {type: String},
    sourceID: {type: String},
    sourceName: {type: String},
    sourceType: {type: String},
    observations: {type: String},
    trainers: {type: Array},
    percentCompleted: {type: Number},
    link: {type: String},
    startDate: {type: Date, default: Date.now },
    endDate: {type: Date},
    revisionDate: {type: Date},
    estimatedStartDate: {type: Date},
    estimatedEndDate: {type: Date},
    nd_trash_deleted:{type: Boolean},
    nd_trash_deleted_date: {type: Date}
}, { collection: config.app.customCollectionsPrefix+'ActionPlans' })


ActionPlansSchema.statics.saveActionPlan = function(data){
    data.nd_trash_deleted = false;

    this.create(data, function(err){
        if(err) throw err;
    });
}

var ActionPlans = connection.model('ActionPlans', ActionPlansSchema);
module.exports = ActionPlans;