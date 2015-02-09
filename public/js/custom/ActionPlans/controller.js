app.controller('ActionPlansCtrl', function ($scope, EmployeesModel, ActionPlansModel, ActionCategoriesModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._ActionPlansModel = ActionPlansModel;
    $scope.mode == 'none';
    $scope.modeField == 'none';

    $scope.actionPlansStatuses = [
        {name: $scope.getTranslation('Not initialized'), value: 1},
        {name: $scope.getTranslation('In progress'), value: 2},
        {name: $scope.getTranslation('Completed'), value: 3}
    ];

    $scope.initActionPlans = function() {
        $scope.mode = $stateParams.mode;
        $scope.from = $stateParams.from;

        switch ($scope.mode) {
            case 'manage': case 'view-all': $scope.viewActionPlans();
                break;
            case 'view': $scope.viewActionPlan();
        }
    };

    $scope.viewActionPlans = function(orderBy) {
        var employeeID = $stateParams.id;

        $scope.showLoader();

        $q.all([
                EmployeesModel.getEmployee(employeeID)
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;

                $q.all([
                        ActionPlansModel.getEmployeeActionPlans(employeeID, orderBy)
                    ]).then(function(data) {
                        //var items = data[0].items;

                        $scope.actionPlans = data[0].items; //[];
                        $scope.canManage = data[0].canManage;

                        /*if (orderBy) {
                            $scope.actionPlans = items;
                        }
                        else {
                            for (var a in $scope.analyticsMeasures) {
                                for (var i in items) {
                                    if ($scope.analyticsMeasures[a].measureID == items[i].sourceID) {
                                        $scope.actionPlans.push(items[i]);
                                    }
                                }
                            }
                            for (var i in items) {
                                if (items[i].sourceType == 'MANUAL') {
                                    $scope.actionPlans.push(items[i]);
                                }
                            }

                            for (var a in $scope.actionPlans) {
                                if ($scope.actionPlans[a].actionCategory) {
                                    for (var ac in $scope.actionCategories) {
                                        if ($scope.actionPlans[a].actionCategory == $scope.actionCategories[ac]._id) {
                                            $scope.actionPlans[a]['actionCategoryName'] = $scope.actionCategories[ac].actionCategory;
                                        }
                                    }
                                }
                            }
                        }*/

                        $scope.hideLoader();
                        $scope.mode = 'list';
                        $scope.subPage = '/partial/custom/ActionPlans/list';
                    });
            });
    };

    $scope.viewActionPlan = function(actionPlanID) {
        if (actionPlanID) {
            var id = actionPlanID;

            $scope.internalLink = true;
        }
        else {
            var id = $stateParams.id;

            $scope.internalLink = false;
        }

        $q.all([
                ActionPlansModel.getActionPlans_document($scope, id)
            ]).then(function(data) {
                $scope.selectedActionPlan = data[0].item;

                if ($scope.selectedActionPlan.actionCategory) {
                    for (var ac in $scope.actionCategories) {
                        if ($scope.selectedActionPlan.actionCategory == $scope.actionCategories[ac]._id) {
                            $scope.selectedActionPlan['actionCategoryName'] = $scope.actionCategories[ac].actionCategory;
                        }
                    }
                }

                $q.all([
                        EmployeesModel.getEmployee($scope.selectedActionPlan.employeeID)
                    ]).then(function(data) {
                        $scope.selectedEmployee = EmployeesModel.data;
                        $scope.APmode = 'viewActionPlan';
                        $scope.subPage= '/partial/custom/ActionPlans/view';
                    });
            });
    };

    $scope.addActionPlan = function() {
        loadEmployees(function() {
            $scope.selectedActionPlan = {status: 1};
            $scope.APmode = 'newActionPlan';
            $scope.subPage= '/partial/custom/ActionPlans/form';
        });
    };

    $scope.editActionPlan = function(id) {
        loadEmployees(function() {
            $q.all([
                    ActionPlansModel.getActionPlans_document($scope, id)
                ]).then(function(data) {
                    $scope.selectedActionPlan = data[0].item;

                    //$scope.selectedActionPlan['percentCompleted'] = ($scope.selectedActionPlan.percentCompleted) ? $scope.selectedActionPlan.percentCompleted : 0;
                    $scope.APmode = 'editActionPlan';
                    $scope.subPage= '/partial/custom/ActionPlans/form';
                });
        });
    };

    $scope.saveActionPlan = function(data) {
        $scope.showLoader();
        if ($scope.APmode == 'newActionPlan') {
            data.employeeID = $scope.selectedEmployee._id;
            data.employeeName = $scope.selectedEmployee.employeeName;

            $q.all([
                    ActionPlansModel.addActionPlans($scope, data)
                ]).then(function(data) {
                    //if (!$scope.actionPlans) $scope.actionPlans = [];
                    //$scope.actionPlans.push(data[0].item);
                    $scope.hideLoader();
                    $scope.viewActionPlans($scope.selectedEmployee._id);
                });
        }
        else {
            $q.all([
                    ActionPlansModel.editActionPlans($scope, data)
                ]).then(function(data) {
                    $scope.hideLoader();
                    $scope.viewActionPlans($scope.selectedEmployee._id);
                });
        }
    };

    $scope.deleteActionPlan = function(id) {
        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {
        $('#deleteModal').modal('hide');
        ActionPlansModel.deleteActionPlans($scope, $scope.delete_id);
    };

    /* LOADERS */

    //loadEmployees();
    function loadEmployees(callLater) {
        if ($scope.employees) {
            if (typeof callLater != 'undefined')
                callLater();

            return;
        }

        $scope.showLoader();

        $q.all([
                EmployeesModel.getEmployees({})
            ]).then(function(data) {
                $scope.employees = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();

                $scope.hideLoader();
            });
    }
    loadActionCategories();
    function loadActionCategories(callLater) {
        $q.all([
                ActionCategoriesModel.getActionCategories()
            ]).then(function(data) {
                $scope.actionCategories = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }

    /* JQUERY */

    $scope.initChosen = function(elementID) {
        switch (elementID) {
            case 'trainers':
                for (var i in $scope.employees) {
                    if ($scope.employees[i]._id != $scope.selectedEmployee._id) {
                        var selected = '';

                        if ($scope.selectedActionPlan)
                            for (var j in $scope.selectedActionPlan.trainers) {
                                if ($scope.selectedActionPlan.trainers[j] == $scope.employees[i]._id) {
                                    selected = ' selected';
                                }
                            }

                        $("#"+elementID).append('<option value="'+$scope.employees[i]._id+'"'+selected+'>'+$scope.employees[i].employeeName+'</option>');
                    }
                }
                break;
        }

        $("#"+elementID).chosen();
    };
});

app.config(function($stateProvider) {

    $stateProvider.state('ActionPlans',{
        url:'/action-plans/:mode/:from/:id',
        templateUrl: '/partial/custom/ActionPlans/index',
        controller: 'ActionPlansCtrl'
    })

});
