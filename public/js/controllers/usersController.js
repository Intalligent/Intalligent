app.controller('usersCtrl', function ($scope, usersModel, $stateParams, $q, $filter) {
    $scope.usersModel = usersModel;

    $scope.getProfile = function() {
        loadLanguages(getProfile);
    };

    function getProfile() {
        $scope.orightml = '';
        $scope.htmlcontent = $scope.orightml;
        $scope.disabled = false;

        $q.all([
            usersModel.getProfile()
        ]).then(function(data) {
            //usersModel.data.language = $filter('getByValue')($scope.languages, usersModel.data.language);
        });
    };

    $scope.clearData = function() {
        usersModel.data = null;
    };

    $scope.editProfile = function(data) {
        if ($('#profile-form').valid())
            usersModel.editProfile(data);
    };

    function loadLanguages(callLater) {
        $q.all([
            usersModel.loadLanguages()
        ]).then(function(data) {
            $scope.languages = data[0].items;

            if (typeof callLater != 'undefined')
                callLater();
        });
    }
});
