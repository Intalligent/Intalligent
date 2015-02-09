app.controller('AdminConfigurationsCtrl', function ($scope, adminConfigurationsModel, $q) {
    $scope.submenu = '/partial/private/adminSubmenu';

    $scope.adminConfigurationsModel = adminConfigurationsModel;

    $scope.getConfigurations = function() {
        $q.all([
            adminConfigurationsModel.getConfigurations()
        ]).then(function(data) {
            for (var i in data[0].configurations) {
                $('#'+data[0].configurations[i].name).val(data[0].configurations[i].value);

                if (data[0].configurations[i].value == 1)
                    $('#'+data[0].configurations[i].name).attr('checked', true);
            }
        });
    };

    $scope.saveConfigurations = function() {
        var configurations = [];

        $('.configuration-field').each(function(index) {
            if ($(this).hasClass('configuration-checkbox'))
                configurations.push({name: $(this).attr('id'), value: $(this).is(':checked') ? 1 : 0});
            else
                configurations.push({name: $(this).attr('id'), value: $(this).val()});
        });

        adminConfigurationsModel.saveConfigurations(configurations);
    };
});
