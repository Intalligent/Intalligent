app.controller('CompetenciesCtrl', function ($scope, CompetenciesModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._CompetenciesModel = CompetenciesModel;
    $scope.subPage = '/partial/custom/Competencies/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/Competencies/list';
        $scope._Competencies = null;
    }

    $scope.edit = function(id)
    {
       

        CompetenciesModel.getCompetencies_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/Competencies/form';


    }

    $scope.new = function()
    {
       

        $scope._Competencies = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/Competencies/form';


    }


    $scope.getCompetencies = function(page, search, fields) {

      

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
            CompetenciesModel.getCompetencies_documents(params)
        ]).then(function(data) {
            $scope.items = CompetenciesModel.data.items;
            $scope.page = CompetenciesModel.data.page;
            $scope.pages = CompetenciesModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            CompetenciesModel.addCompetencies($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            CompetenciesModel.editCompetencies($scope, data);
        }
    };

    $scope.deleteCompetencies = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        CompetenciesModel.deleteCompetencies($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('Competencies',{
        url:'/competencies',
        templateUrl: '/partial/custom/Competencies/index',
        controller: 'CompetenciesCtrl'
    })

});
