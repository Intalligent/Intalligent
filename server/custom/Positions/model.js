var mongoose = require('mongoose');

var PositionsSchema = new mongoose.Schema({
    draft: {type: Boolean},
    positionName: {type: String, required: true},
    positionCode: {type: String},
    positionBrand: {type: Array},
    positionUnit: {type: Array},
    positionDescription: {type: String},
    positionCategory: {type: String},
    positionArea: {type: String},
    professionalGroup: {type: String},
    department: {type: Array},
    status: {type: Number, required: true},
    autoAssessment: {type: Boolean, required: true},
    personalityAssessment: {type: Boolean, required: true},
    ratingCalculationType: {type: Number, required: true},
    areas: [areasSchema],
    topPerformerAlgorithm: {type: Boolean},
    assessmentToEverybody: {type: Boolean, required: true},
    assessmentTo: {type: Array},
    assessmentScopeEverybody: {type: Boolean, required: true},
    assessmentScope : {type: Array},
    canViewEverybody: {type: Boolean, required: true},
    canView : {type: Array},
    canViewScopeEverybody: {type: Boolean, required: true},
    canViewScope : {type: Array},
    manageActionPlansToEverybody: {type: Boolean, required: true},
    manageActionPlansTo : {type: Array},
    manageActionPlansScopeEverybody: {type: Boolean, required: true},
    manageActionPlansScope : {type: Array},
    sendEmailAfterEvaluation: {type: Boolean, required: true},
    nd_trash_deleted:{type: Boolean},
    nd_trash_deleted_date: {type: Date}
}, { collection: config.app.customCollectionsPrefix+'Positions' })

var areasSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    draft: {type: Boolean},
    areaName: {type: String, required: true},
    areaDescription: {type: String},
    areaCode: {type: String},
    //areaCompetence: {type: Array},
    status: {type: Number, required: true},
    areaOrder: {type: Number, required: true},
    areaColor: {type: String, required: true},
    areaWeightActive: {type: Boolean},
    areaWeight: {type: Number},
    behaviours: [behavioursSchema],
    actionPlan: [actionPlansSchema],
    targets: [targetsSchema]
})

var behavioursSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    draft: {type: Boolean},
    behaviourName: {type: String, required: true},
    behaviourDescription: {type: String},
    showBehaviourDescription: {type: Boolean, required: true},
    itemSubtype: {type: Number},
    itemOrder: {type: Number, required: true},
    allowComments: {type: Boolean, required: true},
    reportComments: {type: String},
    showReportComments: {type: Boolean, required: true},
    status: {type: Number, required: true},
    mandatory: {type: Boolean, required: true},
    ratingViewType: {type: Number},
    behaviourWeightActive: {type: Boolean},
    behaviourWeight: {type: Number},
    notApplicable: {type: Boolean, required: true},
    behaviourCompetence: {type: String},
    ratingConfiguration: [ratingConfigurationsSchema]
})

var ratingConfigurationsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    draft: {type: Boolean},
    ratingDescription: {type: String, required: true},
    ratingValue: {type: Number, required: true},
    ratingOrder: {type: Number, required: true},
    ratingColor: {type: String},
    ratingImage: {type: String},
    actionPlan: [actionPlansSchema],
    targets: [targetsSchema]
})

var actionPlansSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    actionPlanDescription: {type: String, required: true},
    actionPlanInstructions: {type: String},
    actionCategory: {type: String},
    actionOrder: {type: Number, required: true},
    valueFrom: {type: Number},
    valueTo: {type: Number},
    urls: [urlsSchema],
    documents: [documentsSchema],
    status: {type: Number, required: true}
})

var urlsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    urlName: {type: String, required: true},
    urlAddress: {type: String, required: true},
    urlDescription: {type: String}
})

var documentsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    documentURL: {type: String, required: true}
})

var targetsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    targetDescription: {type: String, required: true},
    status: {type: Number, required: true},
    urls: [urlsSchema],
    documents: [documentsSchema]
})


PositionsSchema.statics.validatePosition = function(position){
    if (typeof position.positionName == 'undefined')
        return false;
    if (position.positionName === '')
        return false;
    if (typeof position.status == 'undefined')
        return false;
    if (position.status === '')
        return false;
    if (typeof position.autoAssessment == 'undefined')
        return false;
    if (position.autoAssessment === '')
        return false;
    if (typeof position.personalityAssessment == 'undefined')
        return false;
    if (position.personalityAssessment === '')
        return false;
    if (typeof position.ratingCalculationType == 'undefined')
        return false;
    if (position.ratingCalculationType === '')
        return false;

    if (position.areas && !this.validateAreas(position.areas))
        return false;

    return true;
}

PositionsSchema.statics.validateAreas = function(areas){
    for (var i in areas) {
        if (typeof areas[i].areaName == 'undefined')
            return false;
        if (areas[i].areaName === '')
            return false;
        if (typeof areas[i].status == 'undefined')
            return false;
        if (areas[i].status === '')
            return false;

        if (areas[i].behaviours && !this.validateBehaviours(areas[i].behaviours))
            return false;
        if (areas[i].actionPlan && !this.validateActionPlan(areas[i].actionPlan))
            return false;
        if (areas[i].targets && !this.validateTargets(areas[i].targets))
            return false;
    }

    return true;
}

PositionsSchema.statics.validateBehaviours = function(behaviours){
    for (var i in behaviours) {
        if (typeof behaviours[i].behaviourName == 'undefined')
            return false;
        if (behaviours[i].behaviourName === '')
            return false;
        if (typeof behaviours[i].status == 'undefined')
            return false;
        if (behaviours[i].status === '')
            return false;

        if (behaviours[i].ratingConfiguration && !this.validateRatingConfiguration(behaviours[i].ratingConfiguration))
            return false;
    }

    return true;
}

PositionsSchema.statics.validateActionPlan = function(actionPlan){
    for (var i in actionPlan) {
        if (typeof actionPlan[i].actionPlanDescription == 'undefined')
            return false;
        if (actionPlan[i].actionPlanDescription === '')
            return false;
        if (typeof actionPlan[i].status == 'undefined')
            return false;
        if (actionPlan[i].status === '')
            return false;

        if (actionPlan[i].documents && !this.validateDocuments(actionPlan[i].documents))
            return false;
        if (actionPlan[i].urls && !this.validateURLs(actionPlan[i].urls))
            return false;
    }

    return true;
}

PositionsSchema.statics.validateTargets = function(targets){
    for (var i in targets) {
        if (typeof targets[i].targetDescription == 'undefined')
            return false;
        if (targets[i].targetDescription === '')
            return false;
        if (typeof targets[i].status == 'undefined')
            return false;
        if (targets[i].status === '')
            return false;

        if (targets[i].documents && !this.validateDocuments(targets[i].documents))
            return false;
        if (targets[i].urls && !this.validateURLs(targets[i].urls))
            return false;
    }

    return true;
}

PositionsSchema.statics.validateRatingConfiguration = function(ratingConfiguration){
    for (var i in ratingConfiguration) {
        if (typeof ratingConfiguration[i].ratingDescription == 'undefined')
            return false;
        if (ratingConfiguration[i].ratingDescription === '')
            return false;
        if (typeof ratingConfiguration[i].ratingValue == 'undefined')
            return false;
        if (ratingConfiguration[i].ratingValue === '')
            return false;

        if (ratingConfiguration[i].actionPlan && !this.validateActionPlan(ratingConfiguration[i].actionPlan))
            return false;
        if (ratingConfiguration[i].targets && !this.validateTargets(ratingConfiguration[i].targets))
            return false;
    }

    return true;
}

PositionsSchema.statics.validateDocuments = function(documents){
    for (var i in documents) {
        if (typeof documents[i].documentURL == 'undefined')
            return false;
        if (documents[i].documentURL === '')
            return false;
    }

    return true;
}

PositionsSchema.statics.validateURLs = function(urls){
    for (var i in urls) {
        if (typeof urls[i].urlName == 'undefined')
            return false;
        if (urls[i].urlName === '')
            return false;
        if (typeof urls[i].urlAddress == 'undefined')
            return false;
        if (urls[i].urlAddress === '')
            return false;
    }

    return true;
}


var Positions = connection.model('Positions', PositionsSchema);
module.exports = Positions;