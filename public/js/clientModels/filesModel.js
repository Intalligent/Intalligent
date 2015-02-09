app.service('filesModel' , function ($http, $q) {
    this.data = null;

    this.getFiles = function(format) {
        var d = $q.defer();
        //showLoader();

        var params = {};

        if (format) params['format'] = format;

        $http({method: 'GET', url: '/api/files/get-files', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    this.setDropzone = function(onNewFiles, format) {
        $('#dropzone').dropzone({
            url: "/api/files/upload",
            maxFilesize: 2,
            paramName: "file",
            maxThumbnailFilesize: 2,
            thumbnailWidth: 150,
            thumbnailHeight: 150,
            dictDefaultMessage: "Drop files or click here to upload",
            acceptedFiles: (format) ? "image/"+format : "image/*",
            previewTemplate: $('#dropzone-item').html(),
            init: function() {
                this.on("addedfile", function(file) {
                    if (format) {
                         if (file.type == 'image/'+format) {
                             $('#file-list').prepend($(file.previewElement));
                         }
                        else {
                             $(file.previewElement).remove();
                             noty({text: 'Invalid file format',  timeout: 2000, type: 'error'});
                         }
                    }
                    else {
                        $('#file-list').prepend($(file.previewElement));
                    }
                });
            },
            success: function(file, res) {
                $(file.previewElement).children('a').children('.dz-loading').hide();

                if(res.result == 0){
                    $(file.previewElement).children('a').children('.label-danger').show();
                }
                else {
                    $(file.previewElement).children('a').children('.label-success').show();

                    $(file.previewElement).children('a').children('.dz-image').attr('src', res.file.url);
                }

                onNewFiles();
            }
        });
    };

    return this;
});
