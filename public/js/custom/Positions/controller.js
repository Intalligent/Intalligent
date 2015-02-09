app.controller('PositionsCtrl', function ($scope, $q, $sce, $filter, EvaluationsModel, ActionCategoriesModel,
                                          PositionsModel, BrandsModel, PositionCategoriesModel, PositionAreasModel, ProfessionalGroupsModel, DepartmentsModel, CompetenciesModel, RatingTemplatesModel) {
    $scope.submenu = '/partial/custom/Positions/PositionsSubmenu';
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope.PositionsModel = PositionsModel;
    $scope.data = null;

    $scope.statuses = [
        {name: $scope.getTranslation('Active'), value: 1},
        {name: $scope.getTranslation('Not Active'), value: 0}
    ];

    $scope.positionRatingCalculationType = [
        {name: $scope.getTranslation('Last Evaluation'), value: 1},
        {name: $scope.getTranslation('Average'), value: 2},
        {name: $scope.getTranslation('Last month average'), value: 3},
        {name: $scope.getTranslation('Last six month average'), value: 4},
        {name: $scope.getTranslation('Last year average'), value: 5}
    ];

    $scope.behaviourItemType = [
        {name: $scope.getTranslation('Rating'), value: 1},
        {name: $scope.getTranslation('Free Text'), value: 0}
    ];

    $scope.behaviourRatingViewType = [
        //{name: $scope.getTranslation('Stars'), value: 1},
        {name: $scope.getTranslation('Button'), value: 2},
        {name: $scope.getTranslation('Combo Box'), value: 3},
        {name: $scope.getTranslation('Radio Button'), value: 4}
    ];

    $scope.scopes = [
        {name: $scope.getTranslation('Department'), value: 1},
        {name: $scope.getTranslation('Unit'), value: 2},
        {name: $scope.getTranslation('Brand'), value: 3}
    ];

    $scope.areasList = '/partial/custom/Positions/areasList';
    $scope.behavioursList = '/partial/custom/Positions/behavioursList';
    $scope.actionPlansList = '/partial/custom/Positions/actionPlansList';
    $scope.targetsList = '/partial/custom/Positions/targetsList';
    $scope.ratingConfigurationsList = '/partial/custom/Positions/ratingConfigurationsList';

    //loadPositions();

    $scope.getPositions = function(page, search) {
        $scope.selectedPosition = null;
        $scope.subPage = '/partial/custom/Positions/list';

        if (!$scope.data || page || search){
            var params = {};
            params.page = (page) ? page : 1;

            if (search) {
                $scope.search = search;
            }
            else if (page == 1) {
                $scope.search = '';
            }
            if ($scope.search) {
                params.search = $scope.search;
            }

            $scope.showLoader();

            $q.all([
                    PositionsModel.getPositions(params)
                ]).then(function(data) {
                    $scope.page = PositionsModel.data.page;
                    $scope.pages = PositionsModel.data.pages;
                    $scope.data = PositionsModel.data;

                    $scope.hideLoader();
                });
        }
    };

    /*function getPosition(id) {
        $q.all([
            PositionsModel.getPosition(id)
         ]).then(function(data) {
            PositionsModel.data.status = $filter('getByValue')($scope.statuses, PositionsModel.data.status);

            $scope.selectedPosition = PositionsModel.data;
        });
    }*/

    $scope.addPosition = function() {
        $scope.selectedPosition = {};
        $scope.selectedPosition.status = 1;

        $scope.selectedPosition.ratingCalculationType = 1;

        $scope.selectedPosition.assessmentToEverybody = true;
        $scope.selectedPosition.assessmentScopeEverybody = true;
        $scope.selectedPosition.canViewEverybody = true;
        $scope.selectedPosition.canViewScopeEverybody = true;
        $scope.selectedPosition.manageActionPlansToEverybody = true;
        $scope.selectedPosition.manageActionPlansScopeEverybody = true;
        $scope.selectedPosition.sendEmailAfterEvaluation = false;

        $scope.mode = 'insert';
        $scope.subPage = '/partial/custom/Positions/form';
    };

    $scope.editPosition = function(id) {
        $q.all([
            PositionsModel.getPosition(id)
        ]).then(function(data) {
            //PositionsModel.data.status = $filter('getByValue')($scope.statuses, PositionsModel.data.status);

            $scope.selectedPosition = PositionsModel.data;

            $scope.mode = 'update';
            $scope.subPage = '/partial/custom/Positions/form';
        });
    };

    $scope.duplicatePosition = function(id) {
        $q.all([
                PositionsModel.getPosition(id)
            ]).then(function(data) {
                $scope.selectedPosition = PositionsModel.data;

                $scope.mode = 'duplicate';
                $scope.subPage = '/partial/custom/Positions/form';
            });
    };

    $scope.editSelectedPosition = function(position) {
        $scope.selectedPosition = position;
        $scope.mode = 'update';
        $scope.subPage = '/partial/custom/Positions/form';
    };

    $scope.savePosition = function(data) {
        if ($scope.mode == 'insert') {
            data.status = 0;
            data.draft = true;

            $q.all([
                PositionsModel.addPosition(data)
            ]).then(function(data) {
                $scope.data.items.push(data[0].item);
                $scope.positions.push(data[0].item);

                $scope.getPositions();
            });
        }
        else if ($scope.mode == 'duplicate') {
            $q.all([
                PositionsModel.duplicatePosition(data)
            ]).then(function(data) {
                $scope.getPositions();
            });
        }
        else {
            $q.all([
                PositionsModel.editPosition(data)
            ]).then(function(data) {
                for (var i in $scope.data.items) {
                    if ($scope.data.items[i]._id == $scope.selectedPosition._id) {
                        $scope.data.items[i] = $scope.selectedPosition;
                        break;
                    }
                }

                $scope.getPositions();
            });
        }
    };

    $scope.deletePosition = function(id) {
        $scope.delete_id = id;
        $scope.delete_mode = 'positions';
        $('#deleteModal').modal('show');
    };
    $scope.confirmDelete = function(id) {
        $('#deleteModal').modal('hide');
        if ($scope.delete_mode == 'positions') {
            PositionsModel.deletePosition($scope.delete_id);

            $('#'+$scope.delete_id).remove();
        }
        else {
            if ($scope.delete_mode == 'areas') {
                var index = $scope.selectedPosition.areas.indexOf($scope.delete_item);

                if (index > -1) $scope.selectedPosition.areas.splice(index, 1);

                //if ($scope.selectedPosition.areas.length == 0) $scope.selectedPosition.draft = true;

                $scope.editSelectedPosition($scope.selectedPosition);
            }
            else if ($scope.delete_mode == 'behaviours') {
                var index = $scope.selectedArea.behaviours.indexOf($scope.delete_item);

                if (index > -1) $scope.selectedArea.behaviours.splice(index, 1);

                //if ($scope.selectedArea.behaviours.length == 0) $scope.selectedArea.draft = true;

                $scope.editArea($scope.selectedArea);
            }
            else if ($scope.delete_mode == 'ratingConfigurations') {
                var index = $scope.selectedBehaviour.ratingConfiguration.indexOf($scope.delete_item);

                if (index > -1) $scope.selectedBehaviour.ratingConfiguration.splice(index, 1);

                //if ($scope.selectedBehaviour.ratingConfiguration.length == 0) $scope.selectedBehaviour.draft = true;

                $scope.editBehaviour($scope.selectedBehaviour);
            }
            else if ($scope.delete_mode == 'actionPlans') {
                if ($scope.actionPlansFor == 'areas') {
                    var index = $scope.selectedArea.actionPlan.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedArea.actionPlan.splice(index, 1);

                    $scope.editArea($scope.selectedArea);
                }
                if ($scope.actionPlansFor == 'ratingConfiguration') {
                    var index = $scope.selectedRatingConfiguration.actionPlan.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedRatingConfiguration.actionPlan.splice(index, 1);

                    $scope.editRatingConfiguration($scope.selectedRatingConfiguration);
                }
            }
            else if ($scope.delete_mode == 'targets') {
                if ($scope.targetsFor == 'areas') {
                    var index = $scope.selectedArea.targets.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedArea.targets.splice(index, 1);

                    $scope.editArea($scope.selectedArea);
                }
                if ($scope.targetsFor == 'ratingConfiguration') {
                    var index = $scope.selectedRatingConfiguration.targets.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedRatingConfiguration.targets.splice(index, 1);

                    $scope.editRatingConfiguration($scope.selectedRatingConfiguration);
                }
            }
            else if ($scope.delete_mode == 'urls') {
                if ($scope.urlsFor == 'targets') {
                    var index = $scope.selectedTarget.urls.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedTarget.urls.splice(index, 1);

                    $scope.editTarget($scope.selectedTarget);
                }
                if ($scope.targetsFor == 'actionPlan') {
                    var index = $scope.selectedActionPlan.urls.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedActionPlan.urls.splice(index, 1);

                    $scope.editActionPlan($scope.selectedActionPlan);
                }
            }
            else if ($scope.delete_mode == 'documents') {
                if ($scope.targetsFor == 'targets') {
                    var index = $scope.selectedTarget.documents.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedTarget.documents.splice(index, 1);

                    $scope.editTarget($scope.selectedTarget);
                }
                if ($scope.targetsFor == 'actionPlan') {
                    var index = $scope.selectedActionPlan.documents.indexOf($scope.delete_item);

                    if (index > -1) $scope.selectedActionPlan.documents.splice(index, 1);

                    $scope.editActionPlan($scope.selectedActionPlan);
                }
            }

            //PositionsModel.editPosition($scope.selectedPosition);
            savePosition();
        }
    };
    $scope.deletePositionItem = function(mode, item) {
        $scope.delete_mode = mode;
        $scope.delete_item = item;
        $('#deleteModal').modal('show');
    };

    $scope.viewTopPerformerAlgorithm = function() {
        $scope.calculateAlgorithmTotal();
        $scope.mode = 'algorithm';
        $scope.subPage = '/partial/custom/Positions/topPerformerAlgorithm';
    };

    $scope.saveAlgorithm = function() {
        if ($scope.calculateAlgorithmTotal() == 100) {
            savePosition($scope.editSelectedPosition($scope.selectedPosition));
        }
        else {
            noty({text: $scope.getTranslation('Invalid Algorithm Data'),  timeout: 2000, type: 'error'});
        }
    };

    $scope.calculateAlgorithmTotal = function() {
        var algorithmTotal = 0;

        if ($scope.selectedPosition.areas) {
            for (var i in $scope.selectedPosition.areas) {
                if ($scope.selectedPosition.areas[i].areaWeightActive && $scope.selectedPosition.areas[i].areaWeight && !$scope.selectedPosition.areas[i].draft && $scope.selectedPosition.areas[i].status == 1) {
                    algorithmTotal += Number($scope.selectedPosition.areas[i].areaWeight);
                }
            }
        }

        return algorithmTotal;
    };

    function savePosition(callLater) {
        var topPerformerAlgorithm = 0;

        $scope.selectedPosition.draft = true;
        $scope.selectedPosition.topPerformerAlgorithm = true;

        if ($scope.selectedPosition.areas) {
            for (var a in $scope.selectedPosition.areas) {
                var area = $scope.selectedPosition.areas[a];

                if (!area._id) area['_id'] = new ObjectId().toString();

                area.draft = true;

                if (area.behaviours) {
                    for (var b in area.behaviours) {
                        var behaviour = area.behaviours[b];

                        if (!behaviour._id) behaviour['_id'] = new ObjectId().toString();

                        behaviour.draft = true;

                        if (behaviour.ratingConfiguration) {
                            for (var rc in behaviour.ratingConfiguration) {
                                var ratingConfiguration = behaviour.ratingConfiguration[rc];

                                if (!ratingConfiguration._id) ratingConfiguration['_id'] = new ObjectId().toString();

                                behaviour.draft = false;

                                if (ratingConfiguration.actionPlan) {
                                    for (var ap in ratingConfiguration.actionPlan) {
                                        var actionPlan = ratingConfiguration.actionPlan[ap];

                                        if (!actionPlan._id) actionPlan['_id'] = new ObjectId().toString();

                                        ratingConfiguration.actionPlan[ap] = actionPlan;
                                    }
                                }
                                if (ratingConfiguration.targets) {
                                    for (var t in ratingConfiguration.targets) {
                                        var target = ratingConfiguration.targets[t];

                                        if (!target._id) target['_id'] = new ObjectId().toString();

                                        ratingConfiguration.targets[t] = target;
                                    }
                                }

                                behaviour.ratingConfiguration[rc] = ratingConfiguration;
                            }
                        }

                        if (behaviour.draft == false && behaviour.status != 0) {
                            area.draft = false;
                        }

                        area.behaviours[b] = behaviour;
                    }
                }
                if (area.actionPlan) {
                    for (var ap in area.actionPlan) {
                        var actionPlan = area.actionPlan[ap];

                        if (!actionPlan._id) actionPlan['_id'] = new ObjectId().toString();

                        area.actionPlan[ap] = actionPlan;
                    }
                }
                if (area.targets) {
                    for (var t in area.targets) {
                        var target = area.targets[t];

                        if (!target._id) target['_id'] = new ObjectId().toString();

                        area.targets[t] = target;
                    }
                }

                if (area.draft == false && area.status != 0) {
                    $scope.selectedPosition.draft = false;
                }

                if (area.areaWeightActive && area.draft == false && area.status == 1) {
                    topPerformerAlgorithm += Number(area.areaWeight);
                }

                $scope.selectedPosition.areas[a] = area;
            }
        }

        if (topPerformerAlgorithm != 100) {
            $scope.selectedPosition.draft = true;
            $scope.selectedPosition.topPerformerAlgorithm = false;
        }

        if ($scope.selectedPosition.draft == false) {
            $scope.selectedPosition.status = 0;
        }

        $q.all([
            PositionsModel.editPosition($scope.selectedPosition)
        ]).then(function(data) {
            for (var i in $scope.data.items) {
                if ($scope.data.items[i]._id == $scope.selectedPosition._id) {
                    $scope.data.items[i] = $scope.selectedPosition;
                    break;
                }
            }

            if (typeof callLater != 'undefined')
                callLater();
        });
    }

    loadPositions();
    function loadPositions(callLater) {
        $q.all([
            PositionsModel.loadPositions()
        ]).then(function(data) {
            $scope.positions = data[0].items;

            if (typeof callLater != 'undefined')
                callLater();
        });
    }
    loadBrands();
    function loadBrands() {
        $q.all([
            BrandsModel.getBrands_documents()
        ]).then(function(data) {
            $scope.brands = data[0].items;
        });
    }
    loadPositionCategories();
    function loadPositionCategories() {
        $q.all([
            PositionCategoriesModel.getPositionCategories_documents()
        ]).then(function(data) {
            $scope.positionCategories = data[0].items;
        });
    }
    loadPositionAreas();
    function loadPositionAreas() {
        $q.all([
                PositionAreasModel.getPositionAreas_documents()
            ]).then(function(data) {
                $scope.positionAreas = data[0].items;
            });
    }
    loadProfessionalGroups();
    function loadProfessionalGroups() {
        $q.all([
            ProfessionalGroupsModel.getProfessionalGroups_documents()
        ]).then(function(data) {
            $scope.professionalGroups = data[0].items;
        });
    }
    loadDepartments();
    function loadDepartments() {
        $q.all([
            DepartmentsModel.getDepartments_documents()
        ]).then(function(data) {
            $scope.departments = data[0].items;
        });
    }
    loadCompetencies();
    function loadCompetencies() {
        $q.all([
                CompetenciesModel.getCompetencies_documents()
            ]).then(function(data) {
                $scope.competencies = data[0].items;
            });
    }
    loadRatingTemplates();
    function loadRatingTemplates() {
        $q.all([
            RatingTemplatesModel.getRatingTemplates()
        ]).then(function(data) {
            $scope.ratingTemplates = data[0].items;
        });
    }
    loadActionCategories();
    function loadActionCategories() {
        $q.all([
                ActionCategoriesModel.getActionCategories_documents()
            ]).then(function(data) {
                $scope.actionCategories = data[0].items;
            });
    }

    $scope.sortableOptions = {
        update: function(e, ui) {
            savePosition();
        },
        handle: ".sortable-handle"
    };

    $scope.setPositionStatus = function(position, status) {
        position.status = status;

        var data = {id: position._id, status: position.status};

        PositionsModel.setStatus(data);
    };

    $scope.setStatus = function(item, status) {
        item.status = status;

        savePosition();
    };

    $scope.setTooltips = function() {
        $('[data-rel=tooltip]').tooltip();
    };

    $scope.initChosen = function(elementID) {
        switch (elementID) {
            /*case 'areaCompetence':
                for (var i in $scope.competencies) {
                    var selected = '';

                    if ($scope.selectedArea)
                    for (var j in $scope.selectedArea.areaCompetence) {
                        if ($scope.selectedArea.areaCompetence[j] == $scope.competencies[i]._id) {
                            selected = ' selected';
                        }
                    }

                    $("#"+elementID).append('<option value="'+$scope.competencies[i]._id+'"'+selected+'>'+$scope.competencies[i].competency+'</option>');
                }
                break;*/
            case 'assessmentTo':
                for (var i in $scope.positions) {
                    if ($scope.positions[i]._id != $scope.selectedPosition._id) {
                        var selected = '';

                        if ($scope.selectedPosition)
                            for (var j in $scope.selectedPosition.assessmentTo) {
                                if ($scope.selectedPosition.assessmentTo[j] == $scope.positions[i]._id) {
                                    selected = ' selected';
                                }
                            }

                        $("#"+elementID).append('<option value="'+$scope.positions[i]._id+'"'+selected+'>'+$scope.positions[i].positionName+'</option>');
                    }
                }
                break;
            case 'canView':
                for (var i in $scope.positions) {
                    if ($scope.positions[i]._id != $scope.selectedPosition._id) {
                        var selected = '';

                        if ($scope.selectedPosition)
                            for (var j in $scope.selectedPosition.canView) {
                                if ($scope.selectedPosition.canView[j] == $scope.positions[i]._id) {
                                    selected = ' selected';
                                }
                            }

                        $("#"+elementID).append('<option value="'+$scope.positions[i]._id+'"'+selected+'>'+$scope.positions[i].positionName+'</option>');
                    }
                }
                break;
            case 'canViewScope':
                for (var i in $scope.scopes) {
                    var selected = '';

                    if ($scope.selectedPosition)
                        for (var j in $scope.selectedPosition.canViewScope) {
                            if ($scope.selectedPosition.canViewScope[j] == $scope.scopes[i].value) {
                                selected = ' selected';
                            }
                        }

                    $("#"+elementID).append('<option value="'+$scope.scopes[i].value+'"'+selected+'>'+$scope.scopes[i].name+'</option>');
                }
                break;
            case 'assessmentScope':
                for (var i in $scope.scopes) {
                    var selected = '';

                    if ($scope.selectedPosition)
                        for (var j in $scope.selectedPosition.assessmentScope) {
                            if ($scope.selectedPosition.assessmentScope[j] == $scope.scopes[i].value) {
                                selected = ' selected';
                            }
                        }

                    $("#"+elementID).append('<option value="'+$scope.scopes[i].value+'"'+selected+'>'+$scope.scopes[i].name+'</option>');
                }
                break;
            case 'manageActionPlansTo':
                for (var i in $scope.positions) {
                    if ($scope.positions[i]._id != $scope.selectedPosition._id) {
                        var selected = '';

                        if ($scope.selectedPosition)
                            for (var j in $scope.selectedPosition.manageActionPlansTo) {
                                if ($scope.selectedPosition.manageActionPlansTo[j] == $scope.positions[i]._id) {
                                    selected = ' selected';
                                }
                            }

                        $("#"+elementID).append('<option value="'+$scope.positions[i]._id+'"'+selected+'>'+$scope.positions[i].positionName+'</option>');
                    }
                }
                break;
            case 'manageActionPlansScope':
                for (var i in $scope.scopes) {
                    var selected = '';

                    if ($scope.selectedPosition)
                        for (var j in $scope.selectedPosition.manageActionPlansScope) {
                            if ($scope.selectedPosition.manageActionPlansScope[j] == $scope.scopes[i].value) {
                                selected = ' selected';
                            }
                        }

                    $("#"+elementID).append('<option value="'+$scope.scopes[i].value+'"'+selected+'>'+$scope.scopes[i].name+'</option>');
                }
                break;
            case 'positionBrand':
                for (var i in $scope.brands) {
                    var selected = '';

                    if ($scope.selectedPosition)
                        for (var j in $scope.selectedPosition.positionBrand) {
                            if ($scope.selectedPosition.positionBrand[j] == $scope.brands[i]._id) {
                                selected = ' selected';
                            }
                        }

                    $("#"+elementID).append('<option value="'+$scope.brands[i]._id+'"'+selected+'>'+$scope.brands[i].brand+'</option>');
                }
                break;
            case 'department':
                for (var i in $scope.departments) {
                    var selected = '';

                    if ($scope.selectedPosition)
                        for (var j in $scope.selectedPosition.department) {
                            if ($scope.selectedPosition.department[j] == $scope.departments[i]._id) {
                                selected = ' selected';
                            }
                        }

                    $("#"+elementID).append('<option value="'+$scope.departments[i]._id+'"'+selected+'>'+$scope.departments[i].department+'</option>');
                }
                break;
        }

        $("#"+elementID).chosen({placeholder_text: $scope.getTranslation('Select Some')});
    };

    $scope.previewEvaluation = function(positionTo) {
        $q.all([
                PositionsModel.getPosition(positionTo)
            ]).then(function(data) {
                $scope.selectedPosition = data[0].item;

                var areas = EvaluationsModel.getAreasForEvaluationPreview($scope, $scope.selectedPosition, null);

                $scope.mode = 'evaluation-preview';
                $scope.subPage = '/partial/custom/Positions/evaluationPreview';
                $scope.areas = areas;
            });
    };

    $scope.updateEvaluation = function(positionFrom) {
        var areas = EvaluationsModel.getAreasForEvaluationPreview($scope, $scope.selectedPosition, positionFrom);

        $scope.areas = areas;
    };

    $scope.changeRatingConfiguration = function(behaviour) {
        behaviour = EvaluationsModel.changeRatingConfiguration(behaviour);
    };

    $scope.setBGColor = function(id, color) {
        setTimeout(function() {
            $('.'+id).css("background-color", color);
        }, 1000);
    };

    /* Areas */

    $scope.getAreas = function() {
        $scope.selectedArea = null;

        if (!$scope.selectedPosition.areas) $scope.selectedPosition.areas = [];
    };

    $scope.addArea = function() {
        $scope.selectedArea = {};
        $scope.selectedArea.status = 1;

        $scope.subPage = '/partial/custom/Positions/areasForm';
        $scope.mode = 'insert';
    };

    $scope.editArea = function(area) {
        $scope.subPage = '/partial/custom/Positions/areasForm';
        $scope.mode = 'update';
        $scope.selectedArea = area;
    };

    $scope.saveArea = function(data) {
        //data.areaCompetence = $('#form-field-tags').val();
        //data.areaWeight = $('#weight').val();

        if ($scope.mode == 'insert') {
            data.draft = true;
            data.status = 0;

            $scope.selectedPosition.areas.push(data);

            $scope.selectedPosition.draft = false;
        }

        savePosition($scope.editSelectedPosition($scope.selectedPosition));
    };

    /* Behaviours */

    $scope.getBehaviours = function() {
        $scope.selectedBehaviour = null;

        if (!$scope.selectedArea.behaviours) $scope.selectedArea.behaviours = [];
    };

    $scope.addBehaviour = function() {
        $scope.selectedBehaviour = {};
        $scope.selectedBehaviour.status = 1;
        $scope.selectedBehaviour.itemType = 1;
        $scope.selectedBehaviour.ratingViewType = 2;

        $scope.subPage = '/partial/custom/Positions/behavioursForm';
        $scope.mode = 'insert';
    };

    $scope.editBehaviour = function(behaviour) {
        $scope.subPage = '/partial/custom/Positions/behavioursForm';
        $scope.mode = 'update';
        $scope.selectedBehaviour = behaviour;
    };

    $scope.saveBehaviour = function(data) {
        //data.behaviourWeight = $('#weight').val();

        if ($scope.mode == 'insert') {
            data.status = 0;
            data.draft = true;

            $scope.selectedArea.behaviours.push(data);

            //$scope.selectedArea.draft = false;
        }
        savePosition($scope.editArea($scope.selectedArea));
    };

    $scope.addRatings = function(ratings) {
        if (!$scope.selectedBehaviour.ratingConfiguration) $scope.selectedBehaviour.ratingConfiguration = [];

        for (var i in ratings)
            $scope.selectedBehaviour.ratingConfiguration.push(ratings[i]);

        $scope.selectedBehaviour.draft = false;

        savePosition();
    };

    /* RatingConfigurations */

    $scope.getRatingConfigurations = function() {
        $scope.selectedRatingConfiguration = null;

        if (!$scope.selectedBehaviour.ratingConfiguration) $scope.selectedBehaviour.ratingConfiguration = [];
    };

    $scope.addRatingConfiguration = function() {
        $scope.selectedRatingConfiguration = {};
        $scope.subPage = '/partial/custom/Positions/ratingConfigurationsForm';
        $scope.mode = 'insert';
    };

    $scope.editRatingConfiguration = function(ratingConfiguration) {
        $scope.subPage = '/partial/custom/Positions/ratingConfigurationsForm';
        $scope.mode = 'update';
        $scope.selectedRatingConfiguration = ratingConfiguration;
    };

    $scope.saveRatingConfiguration = function(data) {
        if ($scope.mode == 'insert') {
            $scope.selectedBehaviour.ratingConfiguration.push(data);

            $scope.selectedBehaviour.draft = false;
        }
        savePosition($scope.editBehaviour($scope.selectedBehaviour));
    };

    /* ActionPlans */

    $scope.getActionPlans = function(parent) { //parent: areas, ratingConfiguration
        $scope.selectedActionPlan = null;
        $scope.actionPlansFor = parent;

        if (parent == 'areas') {
            if (!$scope.selectedArea.actionPlan) $scope.selectedArea.actionPlan = [];

            $scope.actionPlans = $scope.selectedArea.actionPlan;
        }
        if (parent == 'ratingConfiguration') {
            if (!$scope.selectedRatingConfiguration.actionPlan) $scope.selectedRatingConfiguration.actionPlan = [];

            $scope.actionPlans = $scope.selectedRatingConfiguration.actionPlan;
        }
    };

    $scope.addActionPlan = function() {
        $scope.selectedActionPlan = {};
        $scope.selectedActionPlan.status = 1;

        $scope.subPage = '/partial/custom/Positions/actionPlansForm';
        $scope.mode = 'insert';
    };

    $scope.editActionPlan = function(actionPlan) {
        $scope.subPage = '/partial/custom/Positions/actionPlansForm';
        $scope.mode = 'update';
        $scope.selectedActionPlan = actionPlan;
    };

    $scope.saveActionPlan = function(data) {
        if ($scope.mode == 'insert') {
            data.status = 2;

            if ($scope.actionPlansFor == 'areas') {
                $scope.selectedArea.actionPlan.push(data);
            }
            if ($scope.actionPlansFor == 'ratingConfiguration') {
                $scope.selectedRatingConfiguration.actionPlan.push(data);
            }
        }
        if ($scope.actionPlansFor == 'areas') {
            savePosition($scope.editArea($scope.selectedArea));
        }
        if ($scope.actionPlansFor == 'ratingConfiguration') {
            savePosition($scope.editRatingConfiguration($scope.selectedRatingConfiguration));
        }
    };

    /* Targets */

    $scope.getTargets = function(parent) { //parent: areas, ratingConfiguration
        $scope.selectedTarget = null;
        $scope.targetsFor = parent;

        if (parent == 'areas') {
            if (!$scope.selectedArea.targets) $scope.selectedArea.targets = [];

            $scope.targets = $scope.selectedArea.targets;
        }
        if (parent == 'ratingConfiguration') {
            if (!$scope.selectedRatingConfiguration.targets) $scope.selectedRatingConfiguration.targets = [];

            $scope.targets = $scope.selectedRatingConfiguration.targets;
        }
    };

    $scope.addTarget = function() {
        $scope.selectedTarget = {};
        $scope.selectedTarget.status = 1;

        $scope.subPage = '/partial/custom/Positions/targetsForm';
        $scope.mode = 'insert';
    };

    $scope.editTarget = function(target) {
        $scope.subPage = '/partial/custom/Positions/targetsForm';
        $scope.mode = 'update';
        $scope.selectedTarget = target;
    };

    $scope.saveTarget = function(data) {
        if ($scope.mode == 'insert') {
            data.status = 0;
            data.draft = true;

            if ($scope.targetsFor == 'areas') {
                $scope.selectedArea.targets.push(data);
            }
            if ($scope.targetsFor == 'ratingConfiguration') {
                $scope.selectedRatingConfiguration.targets.push(data);
            }
        }
        if ($scope.targetsFor == 'areas') {
            savePosition($scope.editArea($scope.selectedArea));
        }
        if ($scope.targetsFor == 'ratingConfiguration') {
            savePosition($scope.editRatingConfiguration($scope.selectedRatingConfiguration));
        }
    };

    /* URLs */

    $scope.getURLs = function(parent) { //parent: targets, actionPlan
        $scope.selectedURL = null;
        $scope.urlsFor = parent;

        if (parent == 'targets') {
            if (!$scope.selectedTarget.urls) $scope.selectedTarget.urls = [];

            $scope.urls = $scope.selectedActionPlan.urls;
        }
        if (parent == 'actionPlan') {
            if (!$scope.selectedActionPlan.urls) $scope.selectedActionPlan.urls = [];

            $scope.urls = $scope.selectedActionPlan.urls;
        }
    };

    $scope.addURL = function() {
        $scope.subPage = '/partial/custom/Positions/urlsForm';
        $scope.mode = 'insert';
    };

    $scope.editURL = function(url) {
        $scope.subPage = '/partial/custom/Positions/urlsForm';
        $scope.mode = 'update';
        $scope.selectedURL = url;
    };

    $scope.saveURL = function(data) {
        if ($scope.mode == 'insert') {
            if ($scope.urlsFor == 'targets') {
                $scope.selectedTarget.urls.push(data);
            }
            if ($scope.urlsFor == 'actionPlan') {
                $scope.selectedActionPlan.urls.push(data);
            }
        }
        if ($scope.urlsFor == 'targets') {
            savePosition($scope.editTarget($scope.selectedTarget));
        }
        if ($scope.urlsFor == 'actionPlan') {
            savePosition($scope.editActionPlan($scope.selectedActionPlan));
        }
    };

    /* Documents */

    $scope.getDocuments = function(parent) { //parent: targets, actionPlan
        $scope.selectedDocument = null;
        $scope.documentsFor = parent;

        if (parent == 'targets') {
            if (!$scope.selectedTarget.documents) $scope.selectedTarget.documents = [];

            $scope.documents = $scope.selectedActionPlan.documents;
        }
        if (parent == 'actionPlan') {
            if (!$scope.selectedActionPlan.documents) $scope.selectedActionPlan.documents = [];

            $scope.documents = $scope.selectedActionPlan.documents;
        }
    };

    $scope.addDocument = function() {
        $scope.subPage = '/partial/custom/Positions/documentsForm';
        $scope.mode = 'insert';
    };

    $scope.editDocument = function(document) {
        $scope.subPage = '/partial/custom/Positions/documentsForm';
        $scope.mode = 'update';
        $scope.selectedDocument = document;
    };

    $scope.saveDocument = function(data) {
        if ($scope.mode == 'insert') {
            if ($scope.documentsFor == 'targets') {
                $scope.selectedTarget.documents.push(data);
            }
            if ($scope.documentsFor == 'actionPlan') {
                $scope.selectedActionPlan.documents.push(data);
            }
        }
        if ($scope.documentsFor == 'targets') {
            savePosition($scope.editTarget($scope.selectedTarget));
        }
        if ($scope.documentsFor == 'actionPlan') {
            savePosition($scope.editActionPlan($scope.selectedActionPlan));
        }
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('positions',{
        url:'/positions',
        templateUrl: '/partial/custom/Positions/index',
        controller: 'PositionsCtrl'
    })

});

