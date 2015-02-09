app.controller('UnitsCtrl', function ($scope, UnitsModel, BrandsModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._UnitsModel = UnitsModel;
    $scope.subPage = '/partial/custom/Units/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/Units/list';
        $scope._Units = null;
    }

    $scope.edit = function(id)
    {
       

        UnitsModel.getUnits_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/Units/form';


    }

    $scope.new = function()
    {
       

        $scope._Units = null;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/Units/form';


    }


    $scope.getUnits = function(page, search, fields) {

      

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
            UnitsModel.getUnits_documents(params)
        ]).then(function(data) {
            $scope.items = UnitsModel.data.items;
            $scope.page = UnitsModel.data.page;
            $scope.pages = UnitsModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            UnitsModel.addUnits($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            UnitsModel.editUnits($scope, data);
        }
    };

    $scope.deleteUnits = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        UnitsModel.deleteUnits($scope, $scope.delete_id);
    };

    loadBrands();
    function loadBrands(callLater) {
        $q.all([
                BrandsModel.getBrands_documents()
            ]).then(function(data) {
                $scope.brands = data[0].items;

                if (typeof callLater != 'undefined')
                    callLater();
            });
    }

});

app.config(function($stateProvider) {

    $stateProvider.state('Units',{
        url:'/units',
        templateUrl: '/partial/custom/Units/index',
        controller: 'UnitsCtrl'
    })

});
