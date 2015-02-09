app.controller('AppraisalStorageCtrl', function ($scope, AppraisalStorageModel, EmployeesModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._AppraisalStorageModel = AppraisalStorageModel;
    $scope.subPage = '/partial/custom/AppraisalStorage/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/AppraisalStorage/list';
        $scope._AppraisalStorage = null;
    }

    $scope.edit = function(id)
    {
       

        AppraisalStorageModel.getAppraisalStorage_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/AppraisalStorage/form';


    }

    $scope.new = function()
    {
       

        $scope._AppraisalStorage = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/AppraisalStorage/form';


    }


    $scope.getAppraisalStorage = function(page, search, fields) {
        var params = {};

        $scope.mode = 'appraisalStorageList';

        $scope.subPage = '/partial/custom/AppraisalStorage/list';

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

        if (fields) params.fields = fields;

        $scope.showLoader();


        $q.all([
            AppraisalStorageModel.getAppraisalStorage_documents(params)
        ]).then(function(data) {
            $scope.items = AppraisalStorageModel.data.items;
            $scope.page = AppraisalStorageModel.data.page;
            $scope.pages = AppraisalStorageModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.getEmployeeAppraisalStorage = function(page, search, fields) {
        var params = {};

        $scope.mode = 'appraisalStorageList';

        $scope.subPage = '/partial/custom/AppraisalStorage/employeeList';

        params.page = (page) ? page : 1;

        if (search) params.search = search;

        if (fields) params.fields = fields;

        $scope.showLoader();

        params.type = $stateParams.target;
        params.employee = $stateParams.value;
        params.status = 2;

        $q.all([
                EmployeesModel.getEmployee($stateParams.value)
            ]).then(function(data) {
                $scope.selectedEmployee = EmployeesModel.data;

                $q.all([
                        AppraisalStorageModel.getAppraisalStorage_documents(params)
                    ]).then(function(data) {
                        $scope.items = AppraisalStorageModel.data.items;
                        $scope.page = AppraisalStorageModel.data.page;
                        $scope.pages = AppraisalStorageModel.data.pages;

                        $scope.hideLoader();
                    });
            });
    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            AppraisalStorageModel.addAppraisalStorage($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            AppraisalStorageModel.editAppraisalStorage($scope, data);
        }
    };

    $scope.deleteAppraisalStorage = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        AppraisalStorageModel.deleteAppraisalStorage($scope, $scope.delete_id);
    };

    $scope.evaluateReadOnly = function(id) {
        $q.all([
                AppraisalStorageModel.getAppraisalStorage_document($scope, id)
            ]).then(function(data) {
                $scope.selectedAppraisalStorage = data[0].item;

                $scope.subPage = '/partial/custom/Evaluations/evaluateReadOnly';
            });
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('AppraisalStorage',{
        url:'/appraisal_storage',
        templateUrl: '/partial/custom/AppraisalStorage/index',
        controller: 'AppraisalStorageCtrl'
    })
    .state('AppraisalStorageEmployee',{
        url:'/appraisal-storage/:target/:value',
        templateUrl: '/partial/custom/AppraisalStorage/employeeIndex',
        controller: 'AppraisalStorageCtrl'
    })

});
