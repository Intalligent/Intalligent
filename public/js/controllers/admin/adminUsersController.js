/**
 * Created with JetBrains WebStorm.
 * User: hermenegildoromero
 * Date: 27/10/13
 * Time: 19:42
 * To change this template use File | Settings | File Templates.
 */

app.controller('AdminUsersCtrl', function ($scope, adminUsersModel, $stateParams, $q, $filter, $window) {
    $scope.submenu = '/partial/private/adminSubmenu';
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.adminUsersModel = adminUsersModel;

    $scope.getUsers = function(page, search) {
        var params = {};

        params.page = (page) ? page : 1;

        if (search) params.search = search;

        $q.all([
            adminUsersModel.getUsers(params)
        ]).then(function(data) {
            $scope.page = adminUsersModel.data.page;
        });
    };

    $scope.getUser = function() {
        loadStatuses();
        loadLanguages(loadRoles(loadFilters(getUser)));
    };

    function getUser() {
        $q.all([
            adminUsersModel.getUser($stateParams.user_id)
        ]).then(function(data) {
            adminUsersModel.data.status = $filter('getByValue')($scope.statuses, adminUsersModel.data.status);
            adminUsersModel.data.language = $filter('getByValue')($scope.languages, adminUsersModel.data.language);

            for (var i in adminUsersModel.data.filters) {
                var $clone = $('#filter-row-template').children().clone();

                $clone.children('.filter-value').children('input').val(adminUsersModel.data.filters[i].value);

                $clone.children('.filter-name').children('select').val(adminUsersModel.data.filters[i].name);

                $('#filters-table').append($clone);
            }

            addListeners();
        });
    }

    $scope.clearData = function() {
        adminUsersModel.data = null;

        loadStatuses();
        loadLanguages();
        loadRoles();
        loadFilters();
    };

    $scope.addUser = function(data) {
        if ($('#users-form').valid()) {
            data.filters = getFilters();

            adminUsersModel.addUser(data);
        }
    };

    $scope.editUser = function(data) {
        if ($('#users-form').valid()) {
            data.filters = getFilters();

            adminUsersModel.editUser(data);
        }
    };

    function getFilters() {
        var filters = [];
        $('#filters-table').children().each(function() {
            if ($(this).children('.filter-value').children('input').val()) {
                var filterValue = $(this).children('.filter-value').children('input').val(), filterName = false;

                if ($(this).children('.filter-name').hasClass('list-filter') && $(this).children('.filter-name').children('select').val())
                    filterName = $(this).children('.filter-name').children('select').val();
                else if ($(this).children('.filter-name').children('input').val())
                    filterName = $(this).children('.filter-name').children('input').val();

                if (filterName) filters.push({name: filterName, value: filterValue});
            }
        });
        return filters;
    }

    $scope.deleteUser = function(id) {
        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };
    $scope.confirmDelete = function(id) {
        $('#deleteModal').modal('hide');
        adminUsersModel.deleteUser($scope.delete_id);
        $('#'+$scope.delete_id).remove();
    };

    $scope.setStatus = function(id, status) {
        var data = {id: id, status: status};

        adminUsersModel.setStatus(data);
    };

    $scope.changeUser = function(data) {
        adminUsersModel.changeUser($window, data.username)
    };

    function loadStatuses() {
        $scope.statuses = [
            {name: 'Active', value: 1},
            {name: 'Not Active', value: 0}
        ];
    }

    function loadLanguages(callLater) {
        $q.all([
            adminUsersModel.loadLanguages()
        ]).then(function(data) {
            $scope.languages = [];

            for (var i in data[0].items)
                $scope.languages.push({name: data[0].items[i].description, value: data[0].items[i].language});

            if (typeof callLater != 'undefined')
                callLater();
        });
    }

    function loadRoles(callLater) {
        $q.all([
            adminUsersModel.loadRoles()
        ]).then(function(data) {
            $scope.roles = data[0].items;

            if (typeof callLater != 'undefined')
                callLater();
        });
    }

    function loadFilters(callLater) {
        $q.all([
            adminUsersModel.loadFilters()
        ]).then(function(data) {
            $scope.filters = data[0].filters;

            if (typeof callLater != 'undefined')
                callLater();
        });
    }

    function addListeners() {
        $('.filter-delete').click(function() {
            $(this).parent().parent().remove();
        });
        $('.enter-manually-btn').click(function() {
            $(this).parent().removeClass('list-filter');
            $(this).parent().addClass('manually-filter');
            $(this).parent().children('.list-filter').hide();
            $(this).parent().children('.manually-filter').show();
        });
        $('.choose-from-list-btn').click(function() {
            $(this).parent().removeClass('manually-filter');
            $(this).parent().addClass('list-filter');
            $(this).parent().children('.manually-filter').hide();
            $(this).parent().children('.list-filter').show();
        });
    }
});

app.config(function($stateProvider) {

    $stateProvider.state('admin-users-change-user',{
        url:'/admin/users/change-user',
        templateUrl: '/view/admin/users/changeUser',
        controller: 'AdminUsersCtrl'
    })

});
