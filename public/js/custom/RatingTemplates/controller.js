app.controller('RatingTemplatesCtrl', function ($scope, RatingTemplatesModel, $q, $sce, $filter) {
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope.RatingTemplatesModel = RatingTemplatesModel;
    $scope.data = null;

    $scope.ratingsList = '/partial/custom/RatingTemplates/ratingsList';

    $scope.getRatingTemplates = function(page, search) {
        $scope.selectedRatingTemplate = null;
        $scope.subPage = '/partial/custom/RatingTemplates/list';

        if (!$scope.data || page || search){
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

            $scope.showLoader();

            $q.all([
                RatingTemplatesModel.getRatingTemplates(params)
            ]).then(function(data) {
                $scope.page = RatingTemplatesModel.data.page;
                $scope.pages = RatingTemplatesModel.data.pages;
                $scope.data = RatingTemplatesModel.data;

                    $scope.hideLoader();
            });
        }

    };

    $scope.addRatingTemplate = function() {
        $scope.selectedRatingTemplate = {};

        $scope.mode = 'insert';
        $scope.subPage = '/partial/custom/RatingTemplates/form';
    };

    $scope.editRatingTemplate = function(id) {
        $q.all([
            RatingTemplatesModel.getRatingTemplate(id)
        ]).then(function(data) {
            $scope.selectedRatingTemplate = RatingTemplatesModel.data;

            $scope.mode = 'update';
            $scope.subPage = '/partial/custom/RatingTemplates/form';
        });
    };

    $scope.editSelectedRatingTemplate = function(ratingTemplate) {
        $scope.selectedRatingTemplate = ratingTemplate;
        $scope.mode = 'update';
        $scope.subPage = '/partial/custom/RatingTemplates/form';
    };

    $scope.saveRatingTemplate = function(data) {
        if ($scope.mode == 'insert') {
            $q.all([
                RatingTemplatesModel.addRatingTemplate(data)
            ]).then(function(data) {
                $scope.data.items.push(data[0].item);

                $scope.getRatingTemplates();
            });
        }
        else {
            $q.all([
                RatingTemplatesModel.editRatingTemplate(data)
            ]).then(function(data) {
                for (var i in $scope.data.items) {
                    if ($scope.data.items[i]._id == $scope.selectedRatingTemplate._id) {
                        $scope.data.items[i] = $scope.selectedRatingTemplate;
                        break;
                    }
                }

                $scope.getRatingTemplates();
            });
        }
    };

    $scope.deleteRatingTemplate = function(id) {
        $scope.delete_id = id;
        $scope.delete_mode = 'ratingTemplate';
        $('#deleteModal').modal('show');
    };
    $scope.confirmDelete = function(id) {
        $('#deleteModal').modal('hide');
        if ($scope.delete_mode == 'ratingTemplate') {
            RatingTemplatesModel.deleteRatingTemplate($scope.delete_id);

            $('#'+$scope.delete_id).remove();
        }
        else {
            if ($scope.delete_mode == 'rating') {
                var index = $scope.selectedRatingTemplate.ratings.indexOf($scope.delete_item);

                if (index > -1) $scope.selectedRatingTemplate.ratings.splice(index, 1);

                $scope.editSelectedRatingTemplate($scope.selectedRatingTemplate);
            }

            RatingTemplatesModel.editRatingTemplate($scope.selectedRatingTemplate)
        }
    };
    $scope.deleteRatingTemplateItem = function(mode, item) {
        $scope.delete_mode = mode;
        $scope.delete_item = item;
        $('#deleteModal').modal('show');
    };

    function saveRatingTemplate(callLater) {
        $q.all([
            RatingTemplatesModel.editRatingTemplate($scope.selectedRatingTemplate)
        ]).then(function(data) {
            if (typeof callLater != 'undefined')
                callLater();
        });
    }

    $scope.sortableOptions = {
        update: function(e, ui) {
            saveRatingTemplate();
        },
        handle: ".sortable-handle"
    };

    $scope.setTooltips = function() {
        $('[data-rel=tooltip]').tooltip();
    };

    /* Ratings */

    $scope.getRatings = function() {
        $scope.selectedRating = null;

        if (!$scope.selectedRatingTemplate.ratings) $scope.selectedRatingTemplate.ratings = [];
    };

    $scope.addRating = function() {
        $scope.selectedRating = {};

        $scope.subPage = '/partial/custom/RatingTemplates/ratingsForm';
        $scope.mode = 'insert';
    };

    $scope.editRating = function(rating) {
        $scope.subPage = '/partial/custom/RatingTemplates/ratingsForm';
        $scope.mode = 'update';
        $scope.selectedRating = rating;
    };

    $scope.saveRating = function(data) {
        if ($scope.mode == 'insert') {
            $scope.selectedRatingTemplate.ratings.push(data);
        }

        saveRatingTemplate($scope.editSelectedRatingTemplate($scope.selectedRatingTemplate));
    };

});

app.config(function($stateProvider) {

    $stateProvider.state('ratingTemplates',{
        url:'/rating-templates',
        templateUrl: '/partial/custom/RatingTemplates/index',
        controller: 'RatingTemplatesCtrl'
    })

});

