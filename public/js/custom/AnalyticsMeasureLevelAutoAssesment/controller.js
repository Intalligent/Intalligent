app.controller('AnalyticsMeasureLevelAutoAssesmentCtrl', function ($scope, AnalyticsMeasureLevelAutoAssesmentModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._AnalyticsMeasureLevelAutoAssesmentModel = AnalyticsMeasureLevelAutoAssesmentModel;
    $scope.subPage = '/partial/custom/AnalyticsMeasureLevelAutoAssesment/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/AnalyticsMeasureLevelAutoAssesment/list';
        $scope._AnalyticsMeasureLevelAutoAssesment = null;
    }

    $scope.edit = function(id)
    {
       

        AnalyticsMeasureLevelAutoAssesmentModel.getAnalyticsMeasureLevelAutoAssesment_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/AnalyticsMeasureLevelAutoAssesment/form';


    }

    $scope.new = function()
    {
       

        $scope._AnalyticsMeasureLevelAutoAssesment = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/AnalyticsMeasureLevelAutoAssesment/form';


    }


    $scope.getAnalyticsMeasureLevelAutoAssesment = function(page, search, fields) {

      

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
            AnalyticsMeasureLevelAutoAssesmentModel.getAnalyticsMeasureLevelAutoAssesment_documents(params)
        ]).then(function(data) {
            $scope.page = AnalyticsMeasureLevelAutoAssesmentModel.data.page;
            $scope.pages = AnalyticsMeasureLevelAutoAssesmentModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            AnalyticsMeasureLevelAutoAssesmentModel.addAnalyticsMeasureLevelAutoAssesment($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            AnalyticsMeasureLevelAutoAssesmentModel.editAnalyticsMeasureLevelAutoAssesment($scope, data);
        }
    };

    $scope.deleteAnalyticsMeasureLevelAutoAssesment = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        AnalyticsMeasureLevelAutoAssesmentModel.deleteAnalyticsMeasureLevelAutoAssesment($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('AnalyticsMeasureLevelAutoAssesment',{
        url:'/appraisal_storage',
        templateUrl: '/partial/custom/AnalyticsMeasureLevelAutoAssesment/index',
        controller: 'AnalyticsMeasureLevelAutoAssesmentCtrl'
    })

});
