app.controller('ExporterCtrl', function ($scope, ExporterModel, $stateParams, $q, $filter, $window) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._ExporterModel = ExporterModel;
    $scope.subPage = '/partial/custom/Exporter/upload';
    $scope.mode = 'none';
    $scope.modeField = 'none';


    $scope.edit = function(id)
    {
       

        ExporterModel.getExporter_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/Exporter/form';


    }

    $scope.new = function()
    {
       

        $scope._Exporter = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/Exporter/form';


    }


    $scope.getExporter = function(page, search, fields) {

      

        var params = {};


        params.page = (page) ? page : 1;

        if (search) params.search = search;

        if (fields) params.fields = fields;

        $q.all([
            ExporterModel.getExporter_documents(params)
        ]).then(function(data) {
            $scope.items = ExporterModel.data.items;
            $scope.page = ExporterModel.data.page;
            $scope.pages = ExporterModel.data.pages;
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            ExporterModel.addExporter($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            ExporterModel.editExporter($scope, data);
        }
    };

    $scope.deleteExporter = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        ExporterModel.deleteExporter($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    /*$stateProvider.state('Exporter',{
        url:'/exporter',
        templateUrl: '/partial/custom/Exporter/index',
        controller: 'ExporterCtrl'
    })*/

});
