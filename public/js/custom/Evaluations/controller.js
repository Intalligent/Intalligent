app.controller('EvaluationsCtrl', function ($scope, $rootScope, $stateParams, EvaluationsModel, EmployeesModel, PositionsModel, AppraisalStorageModel, AutoAppraisalStorageModel,
                                            AnalyticsMeasureLevelAutoAssesmentModel, AnalyticsMeasureLevelModel, $q, $sce, $filter, $window) {

    $scope.finalizeModal = '/partial/custom/Evaluations/finalizeEvaluationModal';
    $scope.EvaluationsModel = EvaluationsModel;
    $scope.data = null;
    $scope.stateParam = false;

    $scope.initEvaluation = function() {
        $scope.mode = $stateParams.mode;
        $scope.from = $stateParams.from;

        switch ($scope.mode) {
            case 'evaluate': $scope.evaluate();
                break;
            case 'auto-evaluate': $scope.autoEvaluate();
                break;
            case 'view-evaluation': $scope.evaluateReadOnly();
                break;
            case 'view-auto-evaluation': $scope.autoEvaluateReadOnly();
                break;
            case 'auto-evaluation-analysis': $scope.viewAutoEvaluation();
                break;
            case 'view-area': $scope.viewArea();
                break;
            case 'view-behaviour': $scope.viewBehaviour();
        }
    };

    $scope.evaluate = function() {
        var employeeID = $stateParams.id;

        $scope.showLoader();

        $q.all([
                EmployeesModel.getEmployee(employeeID)
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;

                $q.all([
                        PositionsModel.getPosition($scope.selectedEmployee.actualPosition)
                    ]).then(function(data) {
                        var position = data[0].item, areas = [];

                        $q.all([
                                AppraisalStorageModel.getAppraisalStorage($scope.selectedEmployee._id, $scope.myEmployee._id)
                            ]).then(function(data) {
                                var appraisalStorage = data[0].item;

                                areas = EvaluationsModel.getAreasForEvaluation($scope, position, appraisalStorage);

                                $scope.hideLoader();
                                $scope.mode = 'evaluate';
                                $scope.subPage = '/partial/custom/Evaluations/evaluate';
                                $scope.areas = areas;
                            });
                    });
            });
    };

    $scope.autoEvaluate = function() {
        var employeeID = $scope.myEmployee._id;

        $scope.showLoader();

        $q.all([
                EmployeesModel.getEmployee(employeeID)
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;

                $q.all([
                        PositionsModel.getPosition($scope.selectedEmployee.actualPosition)
                    ]).then(function(data) {
                        var position = data[0].item, areas = [];

                        $q.all([
                                AutoAppraisalStorageModel.getAutoAppraisalStorage($scope.selectedEmployee._id, $scope.myEmployee._id)
                            ]).then(function(data) {
                                var appraisalStorage = data[0].item;

                                areas = EvaluationsModel.getAreasForEvaluation($scope, position, appraisalStorage);

                                $scope.hideLoader();
                                $scope.mode = 'autoEvaluate';
                                $scope.subPage = '/partial/custom/Evaluations/autoEvaluate';
                                $scope.areas = areas;
                            });
                    });
            });
    };

    $scope.showEvaluationResume = function() {
        $scope.resumeData =  EvaluationsModel.getResumeData($scope, $scope.areas);

        if ($scope.mode == 'evaluate') {
            $scope.subPage = '/partial/custom/Evaluations/evaluateResume';
        }
        if ($scope.mode == 'autoEvaluate') {
            $scope.subPage = '/partial/custom/Evaluations/autoEvaluateResume';
        }
    };

    $scope.setBGColor = function(id, color) {
        setTimeout(function() {
            $('.'+id).css("background-color", color);
        }, 1000);
    };

    $scope.changeRatingConfiguration = function(behaviour, ratingConfiguration) {
        behaviour = EvaluationsModel.changeRatingConfiguration(behaviour, ratingConfiguration);

        $scope.saveEvaluation();
    };

    $scope.saveEvaluation = function() {
        if ($scope.mode == 'evaluate')
            AppraisalStorageModel.saveAppraisalStorage($scope, $scope.selectedEmployee, $scope.areas);
        if ($scope.mode == 'autoEvaluate')
            AutoAppraisalStorageModel.saveAutoAppraisalStorage($scope, $scope.selectedEmployee, $scope.areas);
    };

    $scope.finalizeEvaluation = function() {
        $('#finalizeEvaluationModal').modal('show');
    };
    $scope.confirmFinalizeEvaluation = function() {
        $('#finalizeEvaluationModal').modal('hide');
        $scope.showLoader();
        setTimeout(function() {
            if ($scope.mode == 'evaluate') {
                $q.all([
                        AppraisalStorageModel.saveAppraisalStorage($scope, $scope.selectedEmployee, $scope.areas, 2)
                    ]).then(function(data) {
                        $scope.hideLoader();
                        $window.location.href = "/home/#/employees/"+$scope.selectedEmployee._id;
                        //$scope.viewEmployee($scope.selectedEmployee._id);
                    });
            }
            if ($scope.mode == 'autoEvaluate') {
                $q.all([
                        AutoAppraisalStorageModel.saveAutoAppraisalStorage($scope, $scope.selectedEmployee, $scope.areas, 2)
                    ]).then(function(data) {
                        $scope.hideLoader();
                        $window.location.href = "/home/#/my-employee-profile";
                        //$scope.getMyEmployeeProfile();
                    });
            }
        }, 500);
    };

    $scope.evaluateReadOnly = function() {
        var id = $stateParams.id;

        $scope.showLoader();

        $q.all([
                AppraisalStorageModel.getAppraisalStorage_document($scope, id)
            ]).then(function(data) {
                $scope.selectedAppraisalStorage = data[0].item;

                $q.all([
                        EmployeesModel.getEmployee($scope.selectedAppraisalStorage.appraisalToEmployee)
                    ]).then(function(data) {
                        $scope.selectedEmployee = EmployeesModel.data;

                        $q.all([
                                PositionsModel.getPosition($scope.selectedEmployee.actualPosition)
                            ]).then(function(data) {
                                var position = data[0].item;

                                for (var a in $scope.selectedAppraisalStorage.areasOverview) {
                                    var area = $scope.selectedAppraisalStorage.areasOverview[a];

                                    for (var a2 in position.areas) {
                                        if (area.areaID == position.areas[a2]._id) {
                                            for (var b in area.behaviours) {
                                                if (typeof area.behaviours[b].behaviourValueDescription == 'undefined' || typeof area.behaviours[b].behaviourValueColor == 'undefined') {
                                                    for (var b2 in position.areas[a2].behaviours) {
                                                        if (area.behaviours[b].behaviourID == position.areas[a2].behaviours[b2]._id) {
                                                            for (var r in position.areas[a2].behaviours[b2].ratingConfiguration) {
                                                                if (area.behaviours[b].behaviourValue == position.areas[a2].behaviours[b2].ratingConfiguration[r].ratingValue) {
                                                                    $scope.selectedAppraisalStorage.areasOverview[a].behaviours[b].behaviourValueDescription = position.areas[a2].behaviours[b2].ratingConfiguration[r].ratingDescription;
                                                                    $scope.selectedAppraisalStorage.areasOverview[a].behaviours[b].behaviourValueColor = position.areas[a2].behaviours[b2].ratingConfiguration[r].ratingColor;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                $scope.hideLoader();
                                $scope.subPage = '/partial/custom/Evaluations/evaluateReadOnly';
                            });
                    });
            });
    };

    $scope.autoEvaluateReadOnly = function() {
        var id = $stateParams.id;

        $scope.showLoader();

        $q.all([
                AutoAppraisalStorageModel.getAutoAppraisalStorage_document($scope, id)
            ]).then(function(data) {
                $scope.selectedAutoAppraisalStorage = data[0].item;

                $q.all([
                        EmployeesModel.getEmployee($scope.selectedAutoAppraisalStorage.appraisalToEmployee)
                    ]).then(function(data) {
                        $scope.selectedEmployee = EmployeesModel.data;
                        $scope.hideLoader();
                        $scope.subPage = '/partial/custom/Evaluations/autoEvaluateReadOnly';
                    });
            });
    };

    $scope.viewAutoEvaluation = function() {
        var employeeID = $stateParams.id;

        $scope.showLoader();

        $q.all([
                EmployeesModel.getEmployee(employeeID)
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;

                $scope.subPage = '/partial/custom/Evaluations/viewAutoEvaluation';

                $scope.hideLoader();

                $q.all([
                        AutoAppraisalStorageModel.getLastAutoEvaluation($scope.selectedEmployee._id)
                    ]).then(function(data) {
                        $scope.lastAutoEvaluation = data[0].items;

                        $q.all([
                                AppraisalStorageModel.getEmployeeLastEvaluation($scope.selectedEmployee._id)
                            ]).then(function(data) {
                                $scope.lastEvaluation = data[0].items;

                                setTimeout(function() {
                                    //$scope.initGraphs('autoevaluation-graph');

                                    var graphData = [], ticks = [], evaluationData = [], autoEvaluationData = [];

                                    for (var i in $scope.lastAutoEvaluation) {
                                        var evaluationFound = false;

                                        for (var j in $scope.lastEvaluation) {
                                            if ($scope.lastAutoEvaluation[i].areaID == $scope.lastEvaluation[j].areaID) {
                                                evaluationFound = true;

                                                evaluationData.push([Number(i), Math.round($scope.lastEvaluation[j].areaPercent/10)]);
                                                autoEvaluationData.push([Number(Number(i)+0.5), Math.round($scope.lastAutoEvaluation[i].areaPercent/10)]);

                                                ticks.push([(Number(i)+1)-0.75, $scope.lastAutoEvaluation[i].areaSubject]);
                                            }
                                        }

                                        if (!evaluationFound) {
                                            evaluationData.push([Number(i), 0]);
                                            autoEvaluationData.push([Number(Number(i)+0.5), Math.round($scope.lastAutoEvaluation[i].areaPercent/10)]);

                                            ticks.push([(Number(i)+1)-0.75, $scope.lastAutoEvaluation[i].areaSubject]);
                                        }
                                    }

                                    graphData.push({label: $scope.getTranslation('Evaluation'), color: "#FF7070", data: evaluationData});
                                    graphData.push({label: $scope.getTranslation('Auto Evaluation'), color: "#0022FF", data: autoEvaluationData});

                                    $.plot("#autoevaluation-graph", graphData, {
                                        legend: { show: true },
                                        series: { bars: { show: true, barWidth: 0.45, fill: 0.7, align: "center" } },
                                        xaxis: { ticks: ticks },
                                        yaxis: { min: 0, max: 10 }
                                    });
                                }, 1000);
                            });
                        ;
                    });
                ;

                $q.all([
                        AnalyticsMeasureLevelAutoAssesmentModel.getLastAutoTPRating($scope.selectedEmployee._id)
                    ]).then(function(data) {
                        $scope.lastAutoTPRating = data[0].item;

                        $q.all([
                                AnalyticsMeasureLevelModel.getEmployeeLastTPRating($scope.selectedEmployee._id)
                            ]).then(function(data) {
                                $scope.lastTPRating = data[0].item;

                                setTimeout(function() {
                                    //$scope.initGraphs('autoevaluation-tp-graph');

                                    var data = [];

                                    data.push(["Evaluation", ($scope.lastTPRating) ? $scope.lastTPRating.value : 0]);
                                    data.push(["Auto Evaluation", $scope.lastAutoTPRating.value]);

                                    $.plot("#autoevaluation-tp-graph", [ data ], {
                                        series: { bars: { show: true, barWidth: 0.6, align: "center" } },
                                        xaxis: { mode: "categories", tickLength: 0 },
                                        yaxis: { min: 0, max: 10 },
                                        //colors: ["#FF7070", "#0022FF"]
                                    });
                                }, 1000);
                            });
                        ;
                    });
                ;
            });
    };

    /* AREAS */
    $scope.viewArea = function() {
        var ids = String($stateParams.id).split('-');

        $scope.showLoader();
        $scope.mode = 'view';
        $scope.subPage = '/partial/custom/Evaluations/areaView';

        $q.all([
                EmployeesModel.getEmployee(ids[0])
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;

                $q.all([
                        PositionsModel.getAreaData($scope.selectedEmployee.actualPosition, ids[1])
                    ]).then(function(data) {
                        $scope.selectedArea = PositionsModel.data;

                        $q.all([
                                AnalyticsMeasureLevelModel.getAreaAnalyticsEvolution($scope.selectedEmployee._id, ids[1])
                            ]).then(function(data) {
                                $scope.selectedAreaEvolution = data[0].items;
                                $scope.initGraphs('area');
                                $scope.hideLoader();
                            });
                    });
            });
    };

    /* BEHAVIOURS */
    $scope.viewBehaviour = function(behaviour) {
        $scope.selectedBehaviour = behaviour;

        $q.all([
                AppraisalStorageModel.getEmployeeAppraisalStorageBehaviourHistory($scope.selectedEmployee._id, $scope.myEmployee._id, behaviour._id)
            ]).then(function(data) {
                $scope.behavioursHistory = data[0].items;

                $q.all([
                        AutoAppraisalStorageModel.getAutoAppraisalStorageBehaviourHistory($scope.selectedEmployee._id, behaviour._id)
                    ]).then(function(data) {
                        $scope.autoBehavioursHistory = data[0].items;

                        $scope.mode = 'view';
                        $scope.subPage = '/partial/custom/Evaluations/behaviourView';
                    });
            });

    };

    $scope.initGraphs = function(graph) {
        if (graph == 'area') {
            var graphData = [], areaData = [];

            for (var i in $scope.selectedAreaEvolution) {
                var area = $scope.selectedAreaEvolution[i];
                var measureDate = String(area.measureDate).split(':');

                areaData.push([measureDate[0], Math.round(area.value/10)]);
            }

            graphData.push({data: areaData});

            $.plot("#area-graph", graphData, {
                series: { lines: { show: true }, points: { show: false, fill: true } },
                grid: { hoverable: false, clickable: false },
                yaxis: { min: 0, max: 10 },
                xaxis: { mode: "categories", tickLength: 0, ticks: [] }
            });
        }
    };
});

app.config(function($stateProvider) {

    $stateProvider.state('evaluations',{
        url:'/evaluations/:mode/:from/:id',
        templateUrl: '/partial/custom/Evaluations/index',
        controller: 'EvaluationsCtrl'
    })

});

