app.controller('AdminFilesCtrl', function ($scope, adminFilesModel, $stateParams, $q) {
    $scope.submenu = '/partial/private/adminSubmenu';
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.adminFilesModel = adminFilesModel;

    $scope.getFiles = function(page, search) {
        var params = {};

        params.page = (page) ? page : 1;

        if (search) params.search = search;

        $q.all([
            adminFilesModel.getFiles(params)
        ]).then(function(data) {
            $scope.page = adminFilesModel.data.page;
        });
    };

    $scope.getFile = function() {
        $q.all([
            adminFilesModel.getFile($stateParams.file_id)
        ]).then(function(data) {
            //adminFilesModel.data;
        });
    };

    $scope.clearData = function() {
        adminFilesModel.data = null;

        adminFilesModel.setDropzone();
    };

    $scope.editFile = function(data) {
        adminFilesModel.editFile(data);
    };

    $scope.deleteFile = function(id) {
        $scope.delete_id = id;
        $('#deleteModal').modal('show');
    };
    $scope.confirmDelete = function(id) {
        $('#deleteModal').modal('hide');
        adminFilesModel.deleteFile($scope.delete_id);
        $('#'+$scope.delete_id).remove();
    };

    $scope.bytesToSize = function(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
});
