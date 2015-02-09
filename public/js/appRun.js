function appRun($http, $rootScope, $sce) {
    $rootScope.showLoader = function() {
        $('#loader-overlay').show();
    }
    $rootScope.hideLoader = function() {
        $('#loader-overlay').hide();
    }

    $rootScope.showLoader();

    $http.get('/api/init-data')
        .success(angular.bind(this, function (data) {
            //console.log(data);
            $rootScope.user = data.user;
            $rootScope.translations = data.translations;
            $rootScope.configurations = data.configurations;

            $rootScope.hideLoader();
            $('#top-menu').show();
        }))
        .error(angular.bind(this, function (data) {
            //console.log('Error loading init data.');
        }));

    $rootScope.restrictRole = function(roles) {
        if (typeof roles == 'string') roles = [roles];

        if ($rootScope.user != undefined && $rootScope.user.roles != undefined)
        for (var i in roles) {
            if ($rootScope.user.roles.indexOf(roles[i]) > -1){
                //console.log("Role OK!");
                return true;
            }
        }
        return false;
    }
    $rootScope.getTranslation = function(string) {
        if( Object.prototype.toString.call( $rootScope.translations ) != '[object Array]' )
            $rootScope.translations = [];

        for (var i in $rootScope.translations) {
            if ($rootScope.translations[i].base == string) {
                if ($rootScope.translations[i].hasOwnProperty('translation') && $rootScope.translations[i].translation != '')
                    return $rootScope.translations[i].translation;
                return string;
            }
        }

        $rootScope.translations.push({base: string});

        return string;
    }
    $rootScope.getConfiguration = function(name) {
        for (var i in $rootScope.configurations) {
            if ($rootScope.configurations[i].name == name) {
                return $rootScope.configurations[i].value;
            }
        }

        return false;
    }
    $rootScope.saveToLog = function(text, type) {
        $http.post('/api/save-to-log', {text: text, type: type});

        return true;
    }
    $rootScope.Number = function(string) {
        return Number(string);
    }
    $rootScope.toggleElement = function(elementId) {
        $('#'+elementId).toggle();
    }

    $rootScope.isValidEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}

