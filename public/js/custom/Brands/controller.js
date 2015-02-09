app.controller('BrandsCtrl', function ($scope, BrandsModel, $stateParams, $q, $filter) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._BrandsModel = BrandsModel;
    $scope.subPage = '/partial/custom/Brands/list';
    $scope.mode == 'none';
    $scope.modeField == 'none';




    $scope.cancel = function() {
        $scope.mode == 'none';
        $scope.subPage = '/partial/custom/Brands/list';
        $scope._Brands = null;
    }

    $scope.edit = function(id)
    {
       

        BrandsModel.getBrands_document($scope,id);
        $scope.mode = 'edit';
        $scope.subPage= '/partial/custom/Brands/form';


    }

    $scope.new = function()
    {
       

        $scope._Brands = {};
        $scope._Brands.showBrandLogo = false;
        $scope._Brands.loadBrandHomeFile = false;
        $scope._Brands.loadBrandCSS = false;
        $scope.mode = 'new';
        $scope.subPage= '/partial/custom/Brands/form';


    }


    $scope.getBrands = function(page, search, fields) {

      

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
            BrandsModel.getBrands_documents(params)
        ]).then(function(data) {
            $scope.items = BrandsModel.data.items;
            $scope.page = BrandsModel.data.page;
            $scope.pages = BrandsModel.data.pages;

                $scope.hideLoader();
        });


    };

    $scope.save = function(data) {
        if ($scope.mode == 'new') {
            BrandsModel.addBrands($scope, data)
        }
        else {
            $scope.edit_id = data._id;

            BrandsModel.editBrands($scope, data);
        }
    };

    $scope.deleteBrands = function(id) {

    

        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function(id) {

    

        $('#deleteModal').modal('hide');
        BrandsModel.deleteBrands($scope, $scope.delete_id);
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('Brands',{
        url:'/brands',
        templateUrl: '/partial/custom/Brands/index',
        controller: 'BrandsCtrl'
    })

});
