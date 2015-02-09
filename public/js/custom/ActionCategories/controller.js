app.controller('ActionCategoriesCtrl', function ($scope, ActionCategoriesModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._ActionCategoriesModel = ActionCategoriesModel;
    $scope.subPage = '/partial/custom/ActionCategories/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/ActionCategories/list';
        $scope._ActionCategories = null;
    }

    $scope.edit = function(id)
    {


        ActionCategoriesModel.getActionCategories_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/ActionCategories/form';


    }

    $scope.new = function()
    {
       

        $scope._ActionCategories = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/ActionCategories/form';


    }


    $scope.getActionCategories = function(page, search, fields) {



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
            ActionCategoriesModel.getActionCategories_documents(params)
        ]).then(function(data) {
            $scope.items = ActionCategoriesModel.data.items;
            $scope.page = ActionCategoriesModel.data.page;
            $scope.pages = ActionCategoriesModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            ActionCategoriesModel.addActionCategories($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            ActionCategoriesModel.editActionCategories($scope, data);
        }
    };

    $scope.deleteActionCategories = function(id) {

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        ActionCategoriesModel.deleteActionCategories($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('ActionCategories',{
        url:'/action-categories',
        templateUrl: '/partial/custom/ActionCategories/index',
        controller: 'ActionCategoriesCtrl'
    })

});
