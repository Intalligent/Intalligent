app.controller('EmployeesCtrl', function ($scope, $rootScope, $stateParams, EmployeesModel, PositionsModel, DepartmentsModel, UnitsModel, EvaluationsModel, AnalyticsMeasureLevelAutoAssesmentModel, ExporterModel,
                                          AppraisalStorageModel, AutoAppraisalStorageModel, AnalyticsMeasureLevelModel, ActionPlansModel, BrandsModel, usersModel, $q, $sce, $filter, $window) {
    $scope.submenu = '/partial/custom/Employees/EmployeesSubmenu';
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.deleteEmployeesModal = '/partial/custom/Employees/deleteEmployeeModal';
    $scope.resetModal = '/partial/custom/Employees/resetModal';
    $scope.finalizeModal = '/partial/custom/Evaluations/finalizeEvaluationModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope.orderBy = 'topPerformerRating';
    $scope.EmployeesModel = EmployeesModel;
    $scope.data = null;
    $scope.stateParam = false;

    /////
    $rootScope.searchConditions = [];
    $rootScope.searchConditions['String'] =  [
        {condition: 'contains', label: $scope.getTranslation('Contains')},
        {condition: 'equals', label: $scope.getTranslation('Equals')},
        {condition: 'notEquals', label: $scope.getTranslation('Not Equals')}
    ];
    $rootScope.searchConditions['Number'] =  [
        {condition: 'equals', label: $scope.getTranslation('Equals')},
        {condition: 'notEquals', label: $scope.getTranslation('Not Equals')},
        {condition: 'greaterThan', label: $scope.getTranslation('Greater Than')},
        {condition: 'lowerThan', label: $scope.getTranslation('Lower Than')}
    ];
    $rootScope.searchConditions['Array'] =  [
        {condition: 'equals', label: $scope.getTranslation('Equals')},
        {condition: 'notEquals', label: $scope.getTranslation('Not Equals')}
    ];
    $rootScope.searchConditions['Boolean'] =  [
        {condition: 'equals', label: $scope.getTranslation('Equals')}
    ];
    if (typeof $rootScope.showSearch == 'undefined') $rootScope.showSearch = false;
    if (typeof $rootScope.searchFields == 'undefined') $rootScope.searchFields = [
        {name: 'employeeName', type: 'String', label: $scope.getTranslation('Employee Name')},
        {name: 'employeeCode', type: 'String', label: $scope.getTranslation('Employee Code')},
        {name: 'idunit', type: 'String', label: $scope.getTranslation('Unit')},
        {name: 'actualPosition', type: 'Array', label: $scope.getTranslation('Position')},
        {name: 'actualDepartment', type: 'Array', label: $scope.getTranslation('Department')},
        {name: 'topPerformerRating', type: 'Number', label: $scope.getTranslation('Top Performer Rating')},
        {name: 'evaluable', type: 'Boolean', label: $scope.getTranslation('Evaluable')}
    ];
    if (typeof $rootScope.filters == 'undefined') $rootScope.filters = [{}];
    $scope.addFilter = function() {
        $rootScope.filters.push({});
    };
    $scope.removeFilter = function(filter) {
        $rootScope.filters.splice($scope.filters.indexOf(filter), 1);
    };
    $scope.applyFilters = function() {
        for (var i in $rootScope.filters) {
            if (!$rootScope.filters[i].field || !$rootScope.filters[i].condition || !$rootScope.filters[i].value) {
                noty({text: $scope.getTranslation('All filters fields are required.'),  timeout: 2000, type: 'error'});
                return;
            }
        }
        $scope.getEmployees(1);
    };
    $scope.toggleFilters = function() {
        $rootScope.showSearch = !$rootScope.showSearch;
    };
    /////

    $scope.sex = [
        {name: $scope.getTranslation('Man'), value: 'Man'},
        {name: $scope.getTranslation('Woman'), value: 'Woman'}
    ];

    $scope.statuses = [
        {name: $scope.getTranslation('Active'), value: 'Active'},
        {name: $scope.getTranslation('Temporary Leave'), value: 'Temporary Leave'},
        {name: $scope.getTranslation('Out of the Company'), value: 'Out of the Company'}
    ];

    $scope.userStatuses = [
        {name: 'Active', value: 1},
        {name: 'Not Active', value: 0}
    ];

    $scope.initEmployees = function() {
        if ($stateParams.id) {
            $scope.viewEmployee();
        }
        else {
            $scope.getEmployees();
        }
    };

    $scope.getEmployees = function(page, search, orderBy) {
        $scope.selectedEmployee = null;
        $scope.subPage = '/partial/custom/Employees/list';

        /*if ($stateParams.id) {
            $scope.stateParam = true;
            $scope.viewEmployee($stateParams.id);
            return;
        }*/

        if (!$scope.data || page || search || orderBy){
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
            if ($rootScope.filters.length > 0) {
                params.filters = $rootScope.filters;
            }
            if (orderBy) $scope.orderBy = orderBy;

            params.orderBy = $scope.orderBy;

            /*if (filters) {
                params.filters = filters;
            } */

            $scope.showLoader();

            $q.all([
                    EmployeesModel.getEmployees(params)
                ]).then(function(data) {
                    $scope.errorMsg = (EmployeesModel.data.result == 0) ? EmployeesModel.data.msg : false;
                    $scope.page = EmployeesModel.data.page;
                    $scope.pages = EmployeesModel.data.pages;
                    $scope.data = EmployeesModel.data;

                    for (var i in $scope.data.items) {
                        $scope.data.items[i]['topPerformerRating'] = ($scope.data.items[i].topPerformerRating) ? $scope.data.items[i].topPerformerRating : 0;
                        $scope.data.items[i]['employeeImage'] = ($scope.data.items[i]['employeeImage']) ? $scope.data.items[i]['employeeImage'] : '/assets/img/profile-placeholder.png';

                        /*for (var j in $scope.positions) {
                            if ($scope.data.items[i].actualPosition == $scope.positions[j]._id) {
                                $scope.data.items[i]['actualPositionName'] = $scope.positions[j].positionName;
                                break;
                            }
                        }*/
                    }

                    $scope.hideLoader();
                });
        }
    };

    $scope.viewEmployee = function() {
        $scope.mode = 'view';
        $scope.subPage = '/partial/custom/Employees/view';
        $scope.selectedEmployeeId = $stateParams.id;

        $q.all([
                EmployeesModel.getEmployee($scope.selectedEmployeeId)
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;
                $scope.selectedEmployee['topPerformerRating'] = ($scope.selectedEmployee.topPerformerRating) ? $scope.selectedEmployee.topPerformerRating : 0;
                $scope.selectedEmployee['topPerformerAutoRating'] = ($scope.selectedEmployee.topPerformerAutoRating) ? $scope.selectedEmployee.topPerformerAutoRating : 0;
                $scope.selectedEmployee['employeeImage'] = ($scope.selectedEmployee['employeeImage']) ? $scope.selectedEmployee['employeeImage'] : '/assets/img/profile-placeholder.png';

                /*for (var j in $scope.positions) {
                 if ($scope.selectedEmployee.actualPosition == $scope.positions[j]._id) {
                 $scope.selectedEmployee['actualPositionName'] = $scope.positions[j].positionName;
                 break;
                 }
                 }*/
                for (var d in $scope.departments) {
                    if ($scope.selectedEmployee.actualDepartment == $scope.departments[d]._id) {
                        $scope.selectedEmployee['actualDepartmentName'] = $scope.departments[d].department;
                        break;
                    }
                }
            });
    };

    $scope.addEmployee = function() {
        $scope.showLoader();

        loadUnits(function(){
            loadEducationLevels(function(){
                loadCivilStatuses(function(){
                    loadNationalities(function(){
                        $scope.selectedEmployee = {};
                        $scope.selectedEmployee.status = 'Active';
                        $scope.selectedEmployee.sex = 'Man';

                        $scope.hideLoader();
                        $scope.mode = 'insert';
                        $scope.subPage = '/partial/custom/Employees/form';
                    });
                });
            });
        });
    };

    $scope.editEmployee = function(id) {
        $scope.showLoader();

        loadUnits(function(){
            loadBrands(function(){
                loadEducationLevels(function(){
                    loadCivilStatuses(function(){
                        loadNationalities(function(){
                            $q.all([
                                    EmployeesModel.getEmployee(id)
                                ]).then(function(data) {
                                    $scope.selectedEmployee = EmployeesModel.data;

                                    $q.all([
                                            usersModel.getUser($scope.selectedEmployee.employeeCode)
                                        ]).then(function(data) {
                                            $scope.selectedUser = data[0].user;
                                            $scope.filters = data[0].filters;

                                            $scope.hideLoader();
                                            $scope.mode = 'update';
                                            $scope.subPage = '/partial/custom/Employees/form';
                                        });
                                });
                        });
                    });
                });
            });
        });
    };

    function getFilters() {
        var filters = [];

        $("#userBrand").parent().children('.chosen-container').children('ul').children('.search-choice').each(function() {
            filters.push({name: 'IDBRAND', value: $scope.brands[$(this).children('a').attr('data-option-array-index')]._id});
        });

        $("#userUnit").parent().children('.chosen-container').children('ul').children('.search-choice').each(function() {
            filters.push({name: 'IDUNIT', value: $scope.units[$(this).children('a').attr('data-option-array-index')].unit});
        });

        $("#userDepartment").parent().children('.chosen-container').children('ul').children('.search-choice').each(function() {
            filters.push({name: 'IDDEPARTMENT', value: $scope.departments[$(this).children('a').attr('data-option-array-index')]._id});
        });

        return filters;
    }

    $scope.saveEmployee = function(data, user) {
        $scope.showLoader();

        if ($scope.mode == 'insert') {
            $q.all([
                    EmployeesModel.addEmployee(data)
                ]).then(function(data) {
                    $scope.data.items.push(data[0].item);

                    $scope.hideLoader();
                    $scope.getEmployees();
                });
        }
        else {
            if (user && user.password && user.passwordConfirmation && user.password != user.passwordConfirmation) {
                $scope.hideLoader();
                noty({text: $scope.getTranslation('Passwords do not match.'),  timeout: 2000, type: 'error'});
                return;
            }

            $q.all([
                    EmployeesModel.editEmployee(data)
                ]).then(function(data) {
                    if (user && $scope.selectedUser) {
                        $scope.selectedUser.filters = getFilters();

                        $q.all([
                                usersModel.editUser($scope.selectedUser)
                            ]).then(function(data) {
                                $scope.hideLoader();
                                $scope.viewEmployee();
                            });
                    }
                    else {
                        $scope.hideLoader();
                        $scope.viewEmployee();
                    }
                });
        }
    };

    $scope.createNewUser = function() {
        var userData = {username: $scope.selectedEmployee.employeeCode};

        $scope.showLoader();

        if ($scope.selectedEmployee.emailAddress && $scope.selectedEmployee.emailAddress != '')
            userData['email'] = $scope.selectedEmployee.emailAddress;

        $q.all([
                usersModel.createUser(userData)
            ]).then(function(data) {
                $scope.hideLoader();

                $scope.selectedUser = data[0].user;
            });
    };

    $scope.deleteEmployee = function(id) {
        $scope.delete_id = id;
        $q.all([
                usersModel.getUser($scope.selectedEmployee.employeeCode)
            ]).then(function(data) {
                $scope.associatedUser = (data[0].result == 1);
                $('#deleteEmployeeModal').modal('show');
            });
    };
    $scope.confirmDeleteEmployee = function(id) {
        $('#deleteEmployeeModal').modal('hide');
        EmployeesModel.deleteEmployee($scope.delete_id, ($scope.deleteUser));
        $scope.getEmployees(1, '');
    };

    $scope.resetEmployee = function(id) {
        $scope.resetID = id;
        $('#resetModal').modal('show');
    };
    $scope.confirmReset = function() {
        $('#resetModal').modal('hide');

        $scope.showLoader();

        $q.all([
            EmployeesModel.resetEmployee($scope.resetID)
            ]).then(function(data) {
                delete($scope.selectedEmployee.numberOfEvaluations);
                delete($scope.selectedEmployee.lastEvaluationDate);
                delete($scope.selectedEmployee.numberOfPersonalityAppraisals);
                delete($scope.selectedEmployee.lastPersonalityAppraisalDate);
                delete($scope.selectedEmployee.topPerformerRating);
                delete($scope.selectedEmployee.topPerformerRatingEvolution);
                delete($scope.selectedEmployee.topPerformerFork);
                delete($scope.selectedEmployee.topPerformerForkDescription);
                delete($scope.selectedEmployee.topPerformerRatingDate);
                delete($scope.selectedEmployee.topPerformerAutoRating);
                delete($scope.selectedEmployee.topPerformerAutoRatingEvolution);
                delete($scope.selectedEmployee.topPerformerAutoFork);
                delete($scope.selectedEmployee.topPerformerAutoForkDescription);
                delete($scope.selectedEmployee.topPerformerAutoRatingDate);
                delete($scope.selectedEmployee.topPerformerPersonalityRating);
                delete($scope.selectedEmployee.topPerformerPersonalityRatingEvolution);
                delete($scope.selectedEmployee.topPerformerPersonalityFork);
                delete($scope.selectedEmployee.topPerformerPersonalityForkDescription);
                delete($scope.selectedEmployee.topPerformerPersonalityRatingDate);

                /*for (var i in $scope.data.items) {
                    if ($scope.data.items[i]._id == $scope.selectedEmployee._id) {
                        $scope.selectedEmployee['topPerformerRating'] = ($scope.selectedEmployee.topPerformerRating) ? $scope.selectedEmployee.topPerformerRating : 0;
                        $scope.selectedEmployee['topPerformerAutoRating'] = ($scope.selectedEmployee.topPerformerAutoRating) ? $scope.selectedEmployee.topPerformerAutoRating : 0;

                        for (var j in $scope.positions) {
                            if ($scope.positions[j]._id ==  $scope.selectedEmployee.actualPosition) {
                                $scope.selectedEmployee['actualPositionName'] = $scope.positions[j].positionName;
                                break;
                            }
                        }

                        $scope.data.items[i] = $scope.selectedEmployee;
                        break;
                    }
                }*/

                $scope.hideLoader();
            });
    };

    $scope.getMyEmployeeProfile = function() {
        //$scope.selectedEmployeeId = $scope.myEmployee._id;
        $scope.showLoader();

        $q.all([
                EmployeesModel.getEmployeeProfile()
            ]).then(function(data) {
                $scope.mode = 'myProfile';
                $scope.subPage = '/partial/custom/Employees/profile';

                if (EmployeesModel.data.employee) {
                    $scope.selectedEmployeeId = EmployeesModel.data.employee._id;

                    $scope.selectedEmployee = EmployeesModel.data.employee;
                    $scope.selectedEmployee['topPerformerRating'] = ($scope.selectedEmployee.topPerformerRating) ? $scope.selectedEmployee.topPerformerRating : 0;
                    $scope.selectedEmployee['topPerformerAutoRating'] = ($scope.selectedEmployee.topPerformerAutoRating) ? $scope.selectedEmployee.topPerformerAutoRating : 0;
                    $scope.selectedEmployee['employeeImage'] = ($scope.selectedEmployee['employeeImage']) ? $scope.selectedEmployee['employeeImage'] : '/assets/img/profile-placeholder.png';

                    for (var d in $scope.departments) {
                        if ($scope.selectedEmployee.actualDepartment == $scope.departments[d]._id) {
                            $scope.selectedEmployee['actualDepartmentName'] = $scope.departments[d].department;
                            break;
                        }
                    }
                }

                $scope.showUpload = false;

                $scope.hideLoader();
            });
    };

    /* LOADERS */
    //loadEmployees();
    function loadEmployees(callLater) {
        $q.all([
                EmployeesModel.getEmployees({})
            ]).then(function(data) {
                $scope.employees = data[0].items;

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
    loadDepartments();
    function loadDepartments(callLater) {
        $q.all([
                DepartmentsModel.getDepartments()
            ]).then(function(data) {
                $scope.departments = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }
    //loadUnits();
    function loadUnits(callLater) {
        $q.all([
                UnitsModel.getUnits()
            ]).then(function(data) {
                $scope.units = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }
    //loadBrands();
    function loadBrands(callLater) {
        $q.all([
                BrandsModel.getBrands()
            ]).then(function(data) {
                $scope.brands = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }

    //loadEducationLevels();
    function loadEducationLevels(callLater) {
        $q.all([
                EmployeesModel.getFieldValues('educationLevel')
            ]).then(function(data) {
                $rootScope.educationLevels = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }
    //loadCivilStatuses();
    function loadCivilStatuses(callLater) {
        $q.all([
                EmployeesModel.getFieldValues('civilStatus')
            ]).then(function(data) {
                $rootScope.civilStatuses = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }
    //loadNationalities();
    function loadNationalities(callLater) {
        $q.all([
                EmployeesModel.getFieldValues('nationality')
            ]).then(function(data) {
                $rootScope.nationalities = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }

    $scope.loadEmployeeAnalyticsMeasureLevel = function() {
        $q.all([
                AnalyticsMeasureLevelModel.getEmployeeAnalyticsMeasureLevel_documents($scope.selectedEmployeeId)
            ]).then(function(data) {
                $scope.analyticsMeasures = data[0].items;

                $scope.initRatings('areas');
            });
        ;
    };

    $scope.loadEmployeeAppraisalStorageTo = function() {
        $q.all([
                AppraisalStorageModel.getEmployeeAppraisalStorage_documents('toEmployee', $scope.selectedEmployeeId)
            ]).then(function(data) {
                $scope.toMyAppraisalStorages = data[0].items;

                if (!$scope.toMyAppraisalStorages || $scope.toMyAppraisalStorages.length == 0)
                    $('#last-evaluations-to').find('.text-danger').show();

                $('#last-evaluations-to').find('.loader').hide();
            });
        ;
    };

    $scope.loadEmployeeAppraisalStorageBy = function() {
        $q.all([
                AppraisalStorageModel.getEmployeeAppraisalStorage_documents('byEmployee', $scope.selectedEmployeeId)
            ]).then(function(data) {
                $scope.byMyAppraisalStorages = data[0].items;

                if (!$scope.byMyAppraisalStorages || $scope.byMyAppraisalStorages.length == 0)
                    $('#last-evaluations-by').find('.text-danger').show();

                $('#last-evaluations-by').find('.loader').hide();
            });
        ;
    };

    $scope.loadEmployeeAnalyticsAreasEvolution = function() {
        $q.all([
                AnalyticsMeasureLevelModel.getEmployeeAnalyticsAreasEvolution($scope.selectedEmployeeId)
            ]).then(function(data) {
                $scope.toEmployeeAreasEvolution = data[0].items;

                $scope.initGraphs('areas');
            });
        ;
    };

    $scope.loadEmployeeAnalyticsTPEvolution = function() {
        $q.all([
                AnalyticsMeasureLevelModel.getEmployeeAnalyticsTPEvolution($scope.selectedEmployeeId)
            ]).then(function(data) {
                $scope.byEmployeeTPEvolution = data[0].items;
                setTimeout(function() {
                    $scope.initGraphs('tp');
                }, 1000);
            });
        ;
    };

    $scope.loadEmployeeAutoAppraisalStorage = function() {
        if ($scope.selectedEmployeeId) {
            $q.all([
                    AutoAppraisalStorageModel.getEmployeeAutoAppraisalStorage_documents($scope.selectedEmployeeId)
                ]).then(function(data) {
                    $scope.autoAppraisalStorage = (Array(data[0].items).length > 0) ? data[0].items[0] : null;
                });
            ;
        }
    };

    $scope.loadIncompleteEmployeeActionPlans = function() {
        $q.all([
                ActionPlansModel.getIncompleteEmployeeActionPlans($scope.selectedEmployeeId)
            ]).then(function(data) {
                /*$scope.employeeActionPlans = data[0].items;
                $scope.employeeActionsPercentCompleted = data[0].percentCompleted;
                $scope.employeeActionsCanManage = data[0].canManage;*/
                var items = data[0].items;

                $scope.employeeActionPlans = [];
                $scope.employeeActionsPercentCompleted = data[0].percentCompleted;
                $scope.employeeActionsCanManage = data[0].canManage;

                for (var a in $scope.analyticsMeasures) {
                    for (var i in items) {
                        if ($scope.analyticsMeasures[a].measureID == items[i].sourceID) {
                            $scope.employeeActionPlans.push(items[i]);
                        }
                    }
                }
                for (var i in items) {
                    if (items[i].sourceType == 'MANUAL') {
                        $scope.employeeActionPlans.push(items[i]);
                    }
                }

                setTimeout(function() {
                    if ($scope.employeeActionPlans.length == 0)
                        $('#action-plans').find('.text-danger').show();

                    $('#action-plans').find('.loader').hide();
                }, 1000);
            });
        ;
    };

    /* JQUERY */
    $scope.initRatings = function(target) {
        if (target == 'areas') {
            if (!$scope.analyticsMeasures) {
                $('#ratingsArea').children('p').show();
            }
            else {
                for (var i in $scope.analyticsMeasures) {
                    var thisRating = $('<div></div>');
                    var thisRatingName = $('<b class="area-rating-name">'+$scope.analyticsMeasures[i].measureName+'</b>');
                    var thisRatingInfo = $('<i class="hand-cursor area-rating fa fa-plus-square" area-id="'+$scope.analyticsMeasures[i].measureID+'" tooltip="'+$scope.getTranslation('Make click here to view detailled statistics about this area')+'"></i>');
                    var thisRatingStars = $('<div class="rating-disabled" data-average="'+(Number($scope.analyticsMeasures[i].value)/10)+'" rating-color="'+$scope.analyticsMeasures[i].areaColor+'"></div>');
                    var thisRatingSeparator = $('<hr class="area-rating-separator"></div>');

                    thisRating.append(thisRatingName);
                    thisRating.append(thisRatingInfo);
                    thisRating.append(thisRatingStars);
                    thisRating.append(thisRatingSeparator);

                    $('#ratingsArea').append(thisRating);
                }

                $('.area-rating').click(function() {
                    $window.location.href="/home/#/evaluations/view-area/employee/"+$scope.selectedEmployee._id+"-"+$(this).attr('area-id');
                });
            }

            $('#ratingsArea').find('.loader').hide();
        }

        $('[data-rel=tooltip]').tooltip();

        $('.rating-disabled').jRating({
            bigStarsPath: "/js/lib/jRating/stars.png",
            step: true,
            length: 10,
            rateMax: 10,
            isDisabled : true
        });
    };

    $scope.initGraphs = function(graph) {
        if (graph == 'areas') {
            var graphData = [], areasData = [];

            for (var i in $scope.toEmployeeAreasEvolution) {
                var area = $scope.toEmployeeAreasEvolution[i];
                var measureDate = String(area.measureDate).split(':');

                if (!areasData[area.measureID]) {
                    areasData[area.measureID] = {label: area.measureName, data: []};
                }

                areasData[area.measureID].data.push([measureDate[0], Math.round(area.value/10)]);
            }

            for (var i in areasData) {
                graphData.push({label: areasData[i].label, data: areasData[i].data});
            }

            if (graphData.length > 0) {
                $("#areas-graph").show();

                $.plot("#areas-graph", graphData, {
                    series: { lines: { show: true }, points: { show: false, fill: true } },
                    grid: { hoverable: true, clickable: false },
                    legend: {show: false},
                    yaxis: { min: 0, max: 10 },
                    xaxis: { mode: "categories", tickLength: 0, ticks: [] }
                });

                var plot = $("#areas-graph");
            }
            else
                $('#areas-evolution').find('.text-danger').show();

            $('#areas-evolution').find('.loader').hide();
        }
        if (graph == 'tp') {
            var graphData = [], tpData = [];

            for (var i in $scope.byEmployeeTPEvolution) {
                var tp = $scope.byEmployeeTPEvolution[i];
                var measureDate = String(tp.measureDate).split(':');

                tpData.push([measureDate[0], tp.value]);
            }

            graphData.push({data: tpData});

            if (tpData.length > 0) {
                $("#tp-graph").show();

                $.plot("#tp-graph", graphData, {
                    series: { lines: { show: true }, points: { show: false, fill: true } },
                    grid: { hoverable: false, clickable: false },
                    yaxis: { min: 0, max: 10 },
                    xaxis: { mode: "categories", tickLength: 0, ticks: [] }
                });
            }
            else
                $('#tp-evolution').find('.text-danger').show();

            $('#tp-evolution').find('.loader').hide();
        }

        if (plot)
        plot.bind("plothover", function (event, pos, item) {
            if (item) {
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                $("#graph-tooltip").html(item.series.label+ " = " + y)
                    .css({top: item.pageY+5, left: item.pageX+5})
                    .fadeIn(200);
            } else {
                $("#graph-tooltip").hide();
            }
        });
    };

    $scope.initChosen = function(elementID) {
        switch (elementID) {
            case 'userBrand':
                for (var i in $scope.brands) {
                    var selected = '';

                    if ($scope.selectedUser && $scope.selectedUser.filters)
                    for (var f in $scope.selectedUser.filters) {
                        if (String($scope.selectedUser.filters[f].name).toLowerCase() == 'idbrand' && $scope.selectedUser.filters[f].value == $scope.brands[i]._id) {
                            selected = ' selected';
                            break;
                        }
                    }

                    $("#"+elementID).append('<option value="'+$scope.brands[i]._id+'"'+selected+'>'+$scope.brands[i].brand+'</option>');
                }
                break;
            case 'userUnit':
                for (var i in $scope.units) {
                    var selected = '';

                    if ($scope.selectedUser && $scope.selectedUser.filters)
                    for (var f in $scope.selectedUser.filters) {
                        if (String($scope.selectedUser.filters[f].name).toLowerCase() == 'idunit' && $scope.selectedUser.filters[f].value == $scope.units[i].unit) {
                            selected = ' selected';
                            break;
                        }
                    }

                    $("#"+elementID).append('<option value="'+$scope.units[i].unit+'"'+selected+'>'+$scope.units[i].unit+'</option>');
                }
                break;
            case 'userDepartment':
                for (var i in $scope.departments) {
                    var selected = '';

                    if ($scope.selectedUser && $scope.selectedUser.filters)
                    for (var f in $scope.selectedUser.filters) {
                        if (String($scope.selectedUser.filters[f].name).toLowerCase() == 'iddepartment' && $scope.selectedUser.filters[f].value == $scope.departments[i]._id) {
                            selected = ' selected';
                            break;
                        }
                    }

                    $("#"+elementID).append('<option value="'+$scope.departments[i]._id+'"'+selected+'>'+$scope.departments[i].department+'</option>');
                }
                break;
        }

        $("#"+elementID).chosen({placeholder_text: $scope.getTranslation('Select Some')});
    };

    $scope.initDropzone = function() {
        $('#dropzone').dropzone({
            url: "/api/custom/Employees/upload",
            maxFilesize: 2,
            paramName: "file",
            maxThumbnailFilesize: 2,
            thumbnailWidth: 150,
            thumbnailHeight: 150,
            dictDefaultMessage: "Drop files or click here to upload",
            //previewTemplate: $('#dropzone-item').html(),
            init: function() {
                this.on("addedfile", function(file) {
                    $(file.previewElement).hide();
                    //$('#file-list').prepend($(file.previewElement));
                });
            },
            success: function(file, res) {
                //$(file.previewElement).children('a').children('.dz-loading').hide();
                $(file.previewElement).hide();

                $scope.showUpload = false;

                $('#employee-profile-img').removeClass('ng-hide');
                $('.dropzone-upload').addClass('ng-hide');

                $('#employee-profile-img').attr('src', res.file.url);
            }
        });
    };
});

app.config(function($stateProvider) {

    $stateProvider.state('employees',{
        url:'/employees',
        templateUrl: '/partial/custom/Employees/index',
        controller: 'EmployeesCtrl'
    })
    .state('employeesView',{
        url:'/employees/:id',
        templateUrl: '/partial/custom/Employees/index',
        controller: 'EmployeesCtrl'
    })
    .state('my-employee-profile',{
        url:'/my-employee-profile',
        templateUrl: '/partial/custom/Employees/myProfile',
        controller: 'EmployeesCtrl'
    })

});

