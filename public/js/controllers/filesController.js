app.controller('filesCtrl', function ($scope, filesModel, $stateParams, $q, $rootScope) {
    var form, gallery, currentTargetElement;

    $scope.filesModel = filesModel;

    $rootScope.openGallery = function(targetElement, format) {
        currentTargetElement = targetElement;

        $scope.extensionMSG = false;

        $q.all([
                filesModel.getFiles(format)
            ]).then(function(data) {
                var files = data[0].files;

                form = $('#'+targetElement).closest("form");

                $.ajax({
                    url: "/modules/files/views/gallery.html",
                    dataType: 'html',
                    success: function(html) {
                        gallery = $(html);

                        var filesList = gallery.children('#file-list');

                        for (var i in files) {
                            var fileLi = $('<li></li>');
                            var fileLink = $('<a class="hand-cursor file-selection"></a>');
                            var fileImg = $('<img class="dz-image" alt="'+files[i].description+'" src="'+files[i].url+'"></img>');

                            fileLink.append(fileImg);
                            fileLi.append(fileLink);
                            filesList.append(fileLi);
                        }

                        form.hide();

                        form.after(gallery);

                        onNewFiles();

                        $('#close-gallery-btn').click(function() {
                            closeGallery();
                        });

                        if (format) {
                            $('#extensionMSG').html($scope.getTranslation('Only the following extensions are allowed: ')+' '+String(format).toUpperCase());
                        }

                        filesModel.setDropzone(onNewFiles, format);
                    }
                });
            });
    }

    function closeGallery() {
        gallery.remove();

        form.show();
    }

    function onNewFiles() {
        $('.file-selection').click(function() {
            closeGallery();

            if (currentTargetElement == 'wysiwyg-editor')
                tinyMCE.activeEditor.execCommand('mceInsertContent', false, '<img src="'+$(this).children('.dz-image').attr('src')+'" style="width: 150px; height: 150px;"></img>');
            else {
                $('#'+currentTargetElement).val($(this).children('.dz-image').attr('src'));
                $('#'+currentTargetElement).trigger('input');
            }
        });
    }
});

var init = function () {
    $('body').append('<div class="hidden" id="files-controller" ng-controller="filesCtrl"></div>');
};

init();
