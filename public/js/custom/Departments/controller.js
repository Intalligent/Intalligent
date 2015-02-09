app.controller('DepartmentsCtrl', function ($scope, DepartmentsModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._DepartmentsModel = DepartmentsModel;
    $scope.subPage = '/partial/custom/Departments/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/Departments/list';
        $scope._Departments = null;
    }

    $scope.edit = function(id)
    {
       

        DepartmentsModel.getDepartments_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/Departments/form';


    }

    $scope.new = function()
    {
       

        $scope._Departments = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/Departments/form';


    }


    $scope.getDepartments = function(page, search, fields) {

      

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
            DepartmentsModel.getDepartments_documents(params)
        ]).then(function(data) {
            $scope.items = DepartmentsModel.data.items;
            $scope.page = DepartmentsModel.data.page;
            $scope.pages = DepartmentsModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            DepartmentsModel.addDepartments($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            DepartmentsModel.editDepartments($scope, data);
        }
    };

    $scope.deleteDepartments = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        DepartmentsModel.deleteDepartments($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('Departments',{
        url:'/departments',
        templateUrl: '/partial/custom/Departments/index',
        controller: 'DepartmentsCtrl'
    })

});
