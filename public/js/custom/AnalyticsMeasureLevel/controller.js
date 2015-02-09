app.controller('AnalyticsMeasureLevelCtrl', function ($scope, AnalyticsMeasureLevelModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._AnalyticsMeasureLevelModel = AnalyticsMeasureLevelModel;
    $scope.subPage = '/partial/custom/AnalyticsMeasureLevel/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/AnalyticsMeasureLevel/list';
        $scope._AnalyticsMeasureLevel = null;
    }

    $scope.edit = function(id)
    {
       

        AnalyticsMeasureLevelModel.getAnalyticsMeasureLevel_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/AnalyticsMeasureLevel/form';


    }

    $scope.new = function()
    {
       

        $scope._AnalyticsMeasureLevel = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/AnalyticsMeasureLevel/form';


    }


    $scope.getAnalyticsMeasureLevel = function(page, search, fields) {

      

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
            AnalyticsMeasureLevelModel.getAnalyticsMeasureLevel_documents(params)
        ]).then(function(data) {
            $scope.page = AnalyticsMeasureLevelModel.data.page;
            $scope.pages = AnalyticsMeasureLevelModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            AnalyticsMeasureLevelModel.addAnalyticsMeasureLevel($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            AnalyticsMeasureLevelModel.editAnalyticsMeasureLevel($scope, data);
        }
    };

    $scope.deleteAnalyticsMeasureLevel = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        AnalyticsMeasureLevelModel.deleteAnalyticsMeasureLevel($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('AnalyticsMeasureLevel',{
        url:'/appraisal_storage',
        templateUrl: '/partial/custom/AnalyticsMeasureLevel/index',
        controller: 'AnalyticsMeasureLevelCtrl'
    })

});
