app.controller('LoaderCtrl', function ($scope, LoaderModel, $stateParams, $q, $filter, $window) {
    
    $scope.deleteModal = '/partial/private/deleteModal';
    $scope.page = null;
    $scope.pages = null;
    $scope.search = null;
    $scope._LoaderModel = LoaderModel;
    $scope.subPage = '/partial/custom/Loader/upload';
    $scope.mode = 'none';
    $scope.modeField = 'none';

    $scope.fields = [
        {field: 'username', name: $scope.getTranslation('Username'), required: true},
        {field: 'name', name: $scope.getTranslation('Name'), required: false},
        {field: 'surname1', name: $scope.getTranslation('Surname'), required: false},
        {field: 'surname2', name: $scope.getTranslation('Second Surname'), required: false},
        {field: 'email', name: $scope.getTranslation('Email'), required: true},
        {field: 'unit', name: $scope.getTranslation('Unit'), required: false},
        {field: 'sex', name: $scope.getTranslation('Sex'), required: false},
        {field: 'positionCode', name: $scope.getTranslation('Position Code'), required: false}
    ];

    $scope.initDropzone = function() {
        $scope.source = $stateParams.source;

        LoaderModel.setDropzone($scope);
    };

    $scope.fileLoaded = function(id, data) {
        $scope.loadId = id;

        $('#dropzone').hide();
        //$scope.subPage= '/partial/custom/Loader/form';
        $scope.rows = [];

        var table = $('<table class="table"></table>');
        var tableBody = $('<tbody></tbody>');

        for (var i in data) {
            var row = String(data[i]).split(';');

            $scope.rows.push(row);
        }

        for (var i in $scope.rows) {
            var thisRow = $('<tr class="table-row"></tr>');

            for (var j in $scope.rows[i]) {
                var thisColumn = $('<td></td>');
                var thisSelect = $('<select class="import-field"></select>');

                thisSelect.append('<option value="">'+$scope.getTranslation('Select Field')+'</option>');

                for (var f in $scope.fields) {
                    var thisOption = $('<option value="'+$scope.fields[f].field+'" class="option-'+$scope.fields[f].field+'">'+$scope.fields[f].name+'</option>');

                    thisSelect.append(thisOption);
                }

                thisColumn.append(thisSelect);
                thisRow.append(thisColumn);
            }

            tableBody.append(thisRow);
            break;
        }

        for (var i in $scope.rows) {
            var thisRow = $('<tr class="table-row"></tr>');

            for (var j in $scope.rows[i]) {
                var thisColumn = $('<td>'+$scope.rows[i][j]+'</td>');

                thisRow.append(thisColumn);
            }

            tableBody.append(thisRow);
        }

        table.append(tableBody);

        $('.panel-body').append(table);

        $('.panel-primary').append('<button id="save-import" class="btn btn-primary pull-right">'+$scope.getTranslation("Import")+'</button>');

        $('.import-field').change(function() {
            updateSelects();
        });
        $('#save-import').click(function() {
            var username = false, email = false;
            $('.import-field').each(function(index) {
                if ($(this).val() == 'username') username = true;
                if ($(this).val() == 'email') email = true;
            });
            if (username && email) {
                var fields = [];

                $('.import-field').each(function(index) {
                    fields[index] = $(this).val();
                });

                $q.all([
                        LoaderModel.startImport($scope.loadId, fields)
                    ]).then(function(data) {
                        $window.location.href="/home/#/settings";
                    });
            }
            else {
                noty({text: $scope.getTranslation('Username and email are required.'),  timeout: 4000, type: 'error'});
            }
        });

        $scope.hideLoader();
    };

    function updateSelects() {
        $('.import-field').each(function(index) {
            $(this).children().each(function(index) {
                $(this).show();
            });
        });
        $('.import-field').each(function(index) {
            if ($(this).val() != '') {
                var value = $(this).val();
                $('.import-field').each(function(index) {
                    $(this).children('.option-'+value).hide();
                });
            }
        });
    }
});

app.config(function($stateProvider) {

    $stateProvider.state('Loader',{
        url:'/loader/:source',
        templateUrl: '/partial/custom/Loader/index',
        controller: 'LoaderCtrl'
    })

});
