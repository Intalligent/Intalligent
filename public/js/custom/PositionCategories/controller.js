app.controller('PositionCategoriesCtrl', function ($scope, PositionCategoriesModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._PositionCategoriesModel = PositionCategoriesModel;
    $scope.subPage = '/partial/custom/PositionCategories/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/PositionCategories/list';
        $scope._PositionCategories = null;
    }

    $scope.edit = function(id)
    {
       

        PositionCategoriesModel.getPositionCategories_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/PositionCategories/form';


    }

    $scope.new = function()
    {
       

        $scope._PositionCategories = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/PositionCategories/form';


    }


    $scope.getPositionCategories = function(page, search, fields) {

      

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
            PositionCategoriesModel.getPositionCategories_documents(params)
        ]).then(function(data) {
            $scope.items = PositionCategoriesModel.data.items;
            $scope.page = PositionCategoriesModel.data.page;
            $scope.pages = PositionCategoriesModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            PositionCategoriesModel.addPositionCategories($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            PositionCategoriesModel.editPositionCategories($scope, data);
        }
    };

    $scope.deletePositionCategories = function(id) {

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        PositionCategoriesModel.deletePositionCategories($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('PositionCategories',{
        url:'/position-categories',
        templateUrl: '/partial/custom/PositionCategories/index',
        controller: 'PositionCategoriesCtrl'
    })

});
