app.service('EvaluationsModel' , function ($http, $q) {
    this.data = null;

    this.changeRatingConfiguration = function(behaviour, ratingValue) {
        if (ratingValue) {
            for (var i in behaviour.ratingConfiguration) {
                if (behaviour.ratingConfiguration[i].ratingValue == ratingValue) {
                    behaviour.selectedValue = behaviour.ratingConfiguration[i].ratingValue;
                    behaviour.selectedValueDescription = behaviour.ratingConfiguration[i].ratingDescription;
                    behaviour.selectedValueColor = behaviour.ratingConfiguration[i].ratingColor;

                    break;
                }
            }
        }
        else {
            for (var i in behaviour.ratingConfiguration) {
                if (behaviour.selectedValue == behaviour.ratingConfiguration[i].ratingValue) {
                    if (Number(i) == behaviour.ratingConfiguration.length-1) {
                        behaviour.selectedValue = behaviour.ratingConfiguration[0].ratingValue;
                        behaviour.selectedValueDescription = behaviour.ratingConfiguration[0].ratingDescription;
                        behaviour.selectedValueColor = behaviour.ratingConfiguration[0].ratingColor;
                    }
                    else {
                        behaviour.selectedValue = behaviour.ratingConfiguration[Number(i)+1].ratingValue;
                        behaviour.selectedValueDescription = behaviour.ratingConfiguration[Number(i)+1].ratingDescription;
                        behaviour.selectedValueColor = behaviour.ratingConfiguration[Number(i)+1].ratingColor;
                    }
                    break;
                }
            }
        }

        return behaviour;
    };

    this.getAreasForEvaluation = function($scope, position, appraisalStorage) {
        var areas = [];

        for (var i in position.areas) {
            var evaluable = true;

            if (position.areas[i].status == 1 && position.areas[i].draft == false && evaluable) {
                var behaviours = [];

                for (var j in position.areas[i].behaviours) {
                    if (position.areas[i].behaviours[j].status == 1 && position.areas[i].behaviours[j].draft == false) {
                        var behaviour = position.areas[i].behaviours[j];

                        if (behaviour.notApplicable && Boolean(behaviour.notApplicable) == true)
                            behaviour.ratingConfiguration.unshift({ratingValue: -2, ratingDescription: $scope.getTranslation('Not Applicable'), ratingColor: '#FFFFFF'});
                        if (!Boolean(behaviour.mandatory))
                            behaviour.ratingConfiguration.unshift({ratingValue: -1, ratingDescription: $scope.getTranslation('Without Answer'), ratingColor: '#FFFFFF'});

                        behaviour['selectedValue'] = behaviour.ratingConfiguration[0].ratingValue;
                        behaviour['selectedValueDescription'] = behaviour.ratingConfiguration[0].ratingDescription;
                        behaviour['selectedValueColor'] = behaviour.ratingConfiguration[0].ratingColor;

                        if (typeof behaviour.ratingViewType == 'undefined') {
                            behaviour['ratingViewType'] = 2;
                        }
                        else if (behaviour.ratingViewType != 2 && behaviour.ratingViewType != 3 && behaviour.ratingViewType != 4) {
                            behaviour['ratingViewType'] = 2;
                        }

                        if (appraisalStorage) {
                            for (var a in appraisalStorage.areasOverview) {
                                var areaOverview = appraisalStorage.areasOverview[a];

                                for (var b in areaOverview.behaviours) {
                                    if (areaOverview.behaviours[b].behaviourID == behaviour._id) {
                                        behaviour['selectedValue'] = (areaOverview.behaviours[b].notApplicable && behaviour.notApplicable) ? -2 : areaOverview.behaviours[b].behaviourValue;
                                        behaviour['selectedValueDescription'] = areaOverview.behaviours[b].behaviourValueDescription;
                                        behaviour['selectedValueColor'] = areaOverview.behaviours[b].behaviourValueColor;
                                        behaviour['comments'] = areaOverview.behaviours[b].behaviourNotes;
                                        break;
                                    }
                                }
                            }
                        }

                        behaviours.push(behaviour);
                    }
                }

                position.areas[i]['behaviours'] = behaviours;

                areas.push(position.areas[i]);
            }
        }

        return areas;
    };

    this.getAreasForEvaluationPreview = function($scope, position, positionFrom) {
        var areas = [];

        for (var i in position.areas) {
            var evaluable = true;

            if (position.areas[i].status == 1 && position.areas[i].draft == false && evaluable) {
                var behaviours = [];

                for (var j in position.areas[i].behaviours) {
                    if (position.areas[i].behaviours[j].status == 1 && position.areas[i].behaviours[j].draft == false) {
                        var behaviour = position.areas[i].behaviours[j];

                        if (positionFrom == null) {
                            if (behaviour.notApplicable && Boolean(behaviour.notApplicable) == true)
                                behaviour.ratingConfiguration.unshift({ratingValue: -2, ratingDescription: $scope.getTranslation('Not Applicable'), ratingColor: '#FFFFFF'});
                            if (!Boolean(behaviour.mandatory))
                                behaviour.ratingConfiguration.unshift({ratingValue: -1, ratingDescription: '', ratingColor: '#FFFFFF'});
                        }

                        behaviour['selectedValue'] = behaviour.ratingConfiguration[0].ratingValue;
                        behaviour['selectedValueDescription'] = behaviour.ratingConfiguration[0].ratingDescription;
                        behaviour['selectedValueColor'] = behaviour.ratingConfiguration[0].ratingColor;

                        if (typeof behaviour.ratingViewType == 'undefined') {
                            behaviour['ratingViewType'] = 2;
                        }
                        else if (behaviour.ratingViewType != 2 && behaviour.ratingViewType != 3 && behaviour.ratingViewType != 4) {
                            behaviour['ratingViewType'] = 2;
                        }

                        behaviours.push(behaviour);
                    }
                }

                position.areas[i]['behaviours'] = behaviours;

                areas.push(position.areas[i]);
            }
        }

        return areas;
    };

    this.getResumeData = function($scope, areas) {
        var appraisalStorage = {}, areasOverview = [], appraisalValue = 0, appraisalMaxValue = 0, appraisalPercent = 0;
        var areasWeight = 0;

        for (var a in areas) {
            var area = areas[a], areaWeight = 1, behaviours = [];
            var applicableBehaviours = 0, behavioursWeight = 0;
            var areaValue = 0, areaMaxValue = 0, areaPercent = 0;

            if (area.areaWeightActive) {
                areaWeight = area.areaWeight / 100;

                areasWeight += areaWeight;
            }

            for (var b in area.behaviours) {
                var behaviour = area.behaviours[b], behaviourWeight = 1;

                if (behaviour.selectedValue != -1) {
                    behaviour.behaviourValue = (behaviour.selectedValue == -2) ? 0 : Number(behaviour.selectedValue);
                    behaviour.behaviourValueDescription = behaviour.selectedValueDescription;
                    behaviour.behaviourValueColor = behaviour.selectedValueColor;
                    behaviour.behaviourNotes = behaviour.comments;
                    behaviour.behaviourMaxValue = 0;

                    for (var r in behaviour.ratingConfiguration) {
                        if (behaviour.ratingConfiguration[r].ratingValue > behaviour.behaviourMaxValue) {
                            behaviour.behaviourMaxValue = behaviour.ratingConfiguration[r].ratingValue;
                        }
                    }

                    behaviour.behaviourPercent = Math.round((behaviour.behaviourValue/behaviour.behaviourMaxValue)*100);
                    behaviour.behaviourWeightActive = behaviour.behaviourWeightActive;
                    behaviour.behaviourWeight = behaviour.behaviourWeight;
                    behaviour.notApplicable = (behaviour.selectedValue == -2);

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

                    behaviours.push(behaviour);
                }
            }

            area['behaviours'] = behaviours;

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

            areasOverview[a] = area;
        }

        appraisalStorage['areasOverview'] = areasOverview;
        appraisalStorage['appraisalValue'] = appraisalValue;
        appraisalStorage['appraisalMaxValue'] = appraisalMaxValue;
        appraisalStorage['appraisalPercent'] = Math.round((areasWeight == 0) ? appraisalPercent / appraisalStorage.areasOverview.length : appraisalPercent / areasWeight);
        appraisalStorage['appraisalGapValue'] = appraisalMaxValue - appraisalValue;
        appraisalStorage['appraisalGapPercent'] = Math.round(100 - appraisalStorage.appraisalPercent);

        return appraisalStorage;
    };

    return this;
});

