app.controller('PositionAreasCtrl', function ($scope, PositionAreasModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._PositionAreasModel = PositionAreasModel;
    $scope.subPage = '/partial/custom/PositionAreas/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/PositionAreas/list';
        $scope._PositionAreas = null;
    }

    $scope.edit = function(id)
    {
       

        PositionAreasModel.getPositionAreas_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/PositionAreas/form';


    }

    $scope.new = function()
    {
       

        $scope._PositionAreas = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/PositionAreas/form';


    }


    $scope.getPositionAreas = function(page, search, fields) {

      

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
            PositionAreasModel.getPositionAreas_documents(params)
        ]).then(function(data) {
            $scope.items = PositionAreasModel.data.items;
            $scope.page = PositionAreasModel.data.page;
            $scope.pages = PositionAreasModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            PositionAreasModel.addPositionAreas($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            PositionAreasModel.editPositionAreas($scope, data);
        }
    };

    $scope.deletePositionAreas = function(id) {

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        PositionAreasModel.deletePositionAreas($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('PositionAreas',{
        url:'/position-areas',
        templateUrl: '/partial/custom/PositionAreas/index',
        controller: 'PositionAreasCtrl'
    })

});
