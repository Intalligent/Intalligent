app.controller('ProfessionalGroupsCtrl', function ($scope, ProfessionalGroupsModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._ProfessionalGroupsModel = ProfessionalGroupsModel;
    $scope.subPage = '/partial/custom/ProfessionalGroups/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/ProfessionalGroups/list';
        $scope._ProfessionalGroups = null;
    }

    $scope.edit = function(id)
    {
       

        ProfessionalGroupsModel.getProfessionalGroups_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/ProfessionalGroups/form';


    }

    $scope.new = function()
    {
       

        $scope._ProfessionalGroups = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/ProfessionalGroups/form';


    }


    $scope.getProfessionalGroups = function(page, search, fields) {

      

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
            ProfessionalGroupsModel.getProfessionalGroups_documents(params)
        ]).then(function(data) {
            $scope.items = ProfessionalGroupsModel.data.items;
            $scope.page = ProfessionalGroupsModel.data.page;
            $scope.pages = ProfessionalGroupsModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            ProfessionalGroupsModel.addProfessionalGroups($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            ProfessionalGroupsModel.editProfessionalGroups($scope, data);
        }
    };

    $scope.deleteProfessionalGroups = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        ProfessionalGroupsModel.deleteProfessionalGroups($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('ProfessionalGroups',{
        url:'/proffesional-groups',
        templateUrl: '/partial/custom/ProfessionalGroups/index',
        controller: 'ProfessionalGroupsCtrl'
    })

});
