var mongoose = require('mongoose');

var RatingsSchema = new mongoose.Schema({
    rating: {type: String}
}, { collection: config.app.customCollectionsPrefix+'ratings' })

RatingsSchema.statics.calculateRating = function(req, appraisalStorage, done){
    var appraisalValue = 0, appraisalMaxValue = 0, appraisalPercent = 0;
    var areasWeight = 0;

    for (var a in appraisalStorage.areasOverview) {
        var area = appraisalStorage.areasOverview[a], areaWeight = 1; //behaviours = [];
        var applicableBehaviours = 0, behavioursWeight = 0;
        var areaValue = 0, areaMaxValue = 0, areaPercent = 0;

        if (area.areaWeightActive) {
            areaWeight = area.areaWeight / 100;

            areasWeight += areaWeight;
        }

        for (var b in area.behaviours) {
            var behaviour = area.behaviours[b], behaviourWeight = 1;

            behaviour.behaviourValue = Number(behaviour.behaviourValue);
            behaviour.behaviourMaxValue = Number(behaviour.behaviourMaxValue);
            behaviour.behaviourPercent = Number(behaviour.behaviourPercent);

            if (!behaviour.notApplicable) {
                applicableBehaviours++;

                if (behaviour.behaviourWeightActive) {
                    behaviourWeight = behaviour.behaviourWeight / 100;

                    behavioursWeight += behaviourWeight;
                }

                areaValue += behaviour.behaviourValue;
                areaMaxValue += behaviour.behaviourMaxValue;
                areaPercent += behaviour.behaviourPercent*behaviourWeight;
            }

            area.behaviours[b] = behaviour;
        }

        area['areaValue'] = areaValue;
        area['areaMaxValue'] = areaMaxValue;
        if (behavioursWeight == 0 && applicableBehaviours == 0)
            area['areaPercent'] = 0;
        else
            area['areaPercent'] = Math.round((behavioursWeight == 0) ? areaPercent / applicableBehaviours : areaPercent / behavioursWeight);
        area['areaGapValue'] = areaMaxValue - areaValue;
        area['areaGapPercent'] = Math.round(100 - area.areaPercent);

        appraisalValue += areaValue;
        appraisalMaxValue += areaMaxValue;
        appraisalPercent += area.areaPercent*areaWeight;

        appraisalStorage.areasOverview[a] = area;
    }

    appraisalStorage['appraisalValue'] = appraisalValue;
    appraisalStorage['appraisalMaxValue'] = appraisalMaxValue;
    appraisalStorage['appraisalPercent'] = Math.round((areasWeight == 0) ? appraisalPercent / appraisalStorage.areasOverview.length : appraisalPercent / areasWeight);
    //if (areasWeight == 0) areasWeight = 1;
    //appraisalStorage['appraisalPercent'] =  Math.round((appraisalValue*(areasWeight*100))/appraisalMaxValue);
    appraisalStorage['appraisalGapValue'] = appraisalMaxValue - appraisalValue;
    appraisalStorage['appraisalGapPercent'] = Math.round(100 - appraisalStorage.appraisalPercent);

    var AnalyticsMeasureLevel = connection.model('AnalyticsMeasureLevel');

    AnalyticsMeasureLevel.saveRatings(req, appraisalStorage, function() {
        done(appraisalStorage);
    });
}

RatingsSchema.statics.calculatePersonalityRating = function(req, personalityStorage, done){
    var appraisalValue = 0, appraisalMaxValue = 0, appraisalPercent = 0;

    for (var d in personalityStorage.dimensionsOverview) {
        var dimension = personalityStorage.dimensionsOverview[d];
        var dimensionValue = 0, dimensionMaxValue = 0, dimensionPercent = 0;

        for (var s in dimension.scales) {
            var scale = dimension.scales[s];
            var scaleValue = 0, scaleMaxValue = 0, scalePercent = 0;

            for (var i in scale.items) {
                var item = scale.items[i];

                item.itemValue = Number(item.itemValue);
                item.itemMaxValue = Number(item.itemMaxValue);
                item.itemPercent = Number(item.itemPercent);

                scaleValue += item.itemValue;
                scaleMaxValue += item.itemMaxValue;

                scale.items[i] = item;
            }

            scale['scaleValue'] = scaleValue;
            scale['scaleMaxValue'] = scaleMaxValue;
            scale['scalePercent'] = (scale.items.length == 0) ? 0 : Math.round(scaleValue / scale.items.length);
            scale['scaleGapValue'] = scaleMaxValue - scaleValue;
            scale['scaleGapPercent'] = Math.round(100 - scale.scalePercent);

            dimensionValue += scaleValue;
            dimensionMaxValue += scaleMaxValue;

            dimension.scales[s] = scale;
        }

        dimension['dimensionValue'] = dimensionValue;
        dimension['dimensionMaxValue'] = dimensionMaxValue;
        dimension['dimensionPercent'] = (dimension.scales.length == 0) ? 0 : Math.round(dimensionValue / dimension.scales.length);
        dimension['dimensionGapValue'] = dimensionMaxValue - dimensionValue;
        dimension['dimensionGapPercent'] = Math.round(100 - dimension.dimensionPercent);

        appraisalValue += dimensionValue;
        appraisalMaxValue += dimensionMaxValue;

        personalityStorage.dimensionsOverview[d] = dimension;
    }

    personalityStorage['appraisalValue'] = appraisalValue;
    personalityStorage['appraisalMaxValue'] = appraisalMaxValue;
    personalityStorage['appraisalPercent'] = (personalityStorage.dimensionsOverview.length == 0) ? 0 : Math.round(appraisalValue / personalityStorage.dimensionsOverview.length);
    personalityStorage['appraisalGapValue'] = appraisalMaxValue - appraisalValue;
    personalityStorage['appraisalGapPercent'] = Math.round(100 - personalityStorage.appraisalPercent);

    var PersonalityAnalyticsMeasure = connection.model('PersonalityAnalyticsMeasure');

    PersonalityAnalyticsMeasure.saveRatings(req, personalityStorage, function() {
        done(personalityStorage);
    });
}

var Ratings = connection.model('Ratings', RatingsSchema);
module.exports = Ratings;