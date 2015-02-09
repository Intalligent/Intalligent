app.controller('AutoAppraisalStorageCtrl', function ($scope, AutoAppraisalStorageModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._AutoAppraisalStorageModel = AutoAppraisalStorageModel;
    $scope.subPage = '/partial/custom/AutoAppraisalStorage/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/AutoAppraisalStorage/list';
        $scope._AutoAppraisalStorage = null;
    }

    $scope.edit = function(id)
    {
       

        AutoAppraisalStorageModel.getAutoAppraisalStorage_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/AutoAppraisalStorage/form';


    }

    $scope.new = function()
    {
       

        $scope._AutoAppraisalStorage = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/AutoAppraisalStorage/form';


    }


    $scope.getAutoAppraisalStorage = function(page, search, fields) {
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

        if (fields) params.fields = fields;

        $scope.showLoader();

        $q.all([
            AutoAppraisalStorageModel.getAutoAppraisalStorage_documents(params)
        ]).then(function(data) {
            $scope.items = AutoAppraisalStorageModel.data.items;
            $scope.page = AutoAppraisalStorageModel.data.page;
            $scope.pages = AutoAppraisalStorageModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            AutoAppraisalStorageModel.addAutoAppraisalStorage($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            AutoAppraisalStorageModel.editAutoAppraisalStorage($scope, data);
        }
    };

    $scope.deleteAutoAppraisalStorage = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        AutoAppraisalStorageModel.deleteAutoAppraisalStorage($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('AutoAppraisalStorage',{
        url:'/auto_appraisal_storage',
        templateUrl: '/partial/custom/AutoAppraisalStorage/index',
        controller: 'AutoAppraisalStorageCtrl'
    })

});
