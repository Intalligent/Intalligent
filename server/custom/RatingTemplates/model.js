var mongoose = require('mongoose');

var RatingTemplatesSchema = new mongoose.Schema({
    ratingTemplateName: {type: String, required: true},
    ratingTemplateDescription: {type: String},
    ratings: [ratingsSchema],
    nd_trash_deleted:{type: Boolean},
    nd_trash_deleted_date: {type: Date}
}, { collection: config.app.customCollectionsPrefix+'RatingTemplates' })

var ratingsSchema = new mongoose.Schema({
    ratingDescription: {type: String, required: true},
    ratingValue: {type: Number, required: true},
    ratingOrder: {type: Number, required: true},
    ratingColor: {type: String},
    ratingImage: {type: String}
})

RatingTemplatesSchema.statics.validateRatingTemplate = function(RatingTemplate){
    if (typeof RatingTemplate.ratingTemplateName == 'undefined')
        return false;
    if (RatingTemplate.ratingTemplateName === '')
        return false;

    if (RatingTemplate.areas)
        return this.validateRatings(RatingTemplate.ratings);

    return true;
}

RatingTemplatesSchema.statics.validateRatings = function(ratings){
    for (var i in ratings) {
        if (typeof ratings[i].ratingDescription == 'undefined')
            return false;
        if (ratings[i].ratingDescription === '')
            return false;
        if (typeof ratings[i].ratingValue == 'undefined')
            return false;
        if (ratings[i].ratingValue === '')
            return false;
    }

    return true;
}

var RatingTemplates = connection.model('RatingTemplates', RatingTemplatesSchema);
module.exports = RatingTemplates;