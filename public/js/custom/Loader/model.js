app.service('LoaderModel' , function ($http, $q) {
    this.data = null;

    this.startImport = function(loadId, fields) {
        var d = $q.defer();
        $http.post('/api/custom/Loader/import/'+loadId, {id: loadId, fields: fields})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
        return d.promise;
    };

    this.setDropzone = function($scope) {
        $('#dropzone').dropzone({
            url: "/api/custom/Loader/upload",
            maxFilesize: 2,
            paramName: "file",
            maxThumbnailFilesize: 2,
            thumbnailWidth: 150,
            thumbnailHeight: 150,
            dictDefaultMessage: $scope.getTranslation("Drop files or click here to upload"),
            init: function() {
                this.on("addedfile", function(file) {
                    $scope.showLoader();
                });
            },
            success: function(file, res) {
                $scope.hideLoader();

                $(file.previewElement).find('.dz-success-mark').hide();
                $(file.previewElement).find('.dz-error-mark').hide();

                if(res.result == 0){
                    $(file.previewElement).children('.dz-error-mark').show();

                    noty({text: res.msg, timeout: 5000, type: 'error'});
                }
                else {
                    $(file.previewElement).children('.dz-success-mark').show();

                    $scope.fileLoaded(res.id, res.data);
                }
            }
        });
    };

    return this;
});
