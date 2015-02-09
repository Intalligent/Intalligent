app.service('adminFilesModel' , function ($http, $q) {
    this.data = null;

    this.getFiles = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/files/find-all', params: params})
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

    this.getFile = function(id) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/files/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data.file;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    this.setDropzone = function() {
        $('#dropzone').dropzone({
            url: "/api/admin/files/upload",
            maxFilesize: 5,
            paramName: "file",
            maxThumbnailFilesize: 2,
            thumbnailWidth: 150,
            thumbnailHeight: 150,
            dictDefaultMessage: "Drop files or click here to upload",
            previewTemplate: $('#dropzone-item').html(),
            init: function() {
                this.on("addedfile", function(file) {
                    //console.log("Added file.");
                });
            },
            success: function(file, res) {
                if(res.result == 0){
                    $(file.previewElement).children('.label-danger').show();
                }
                else {
                    $(file.previewElement).children('.label-success').show();
                }
            }
        });
    };

    this.editFile = function(data) {
        data.id = data._id;

        $http({method: 'PUT', url: '/api/admin/files/update/'+data.id, params: data})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) window.location.hash = '/admin/files';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deleteFile = function(id) {
        $http({method: 'DELETE', url: '/api/admin/files/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    return this;
});
