app.service('notificationsModel' , function ($http, $q) {
    this.data = null;

    this.getNotificationsDropdown = function() {
        loadNotificationsDropdown();
        setInterval(loadNotificationsDropdown, 60000);
    };

    function loadNotificationsDropdown() {
        $http({method: 'GET', url: '/api/notifications/get-dropdown'})
            .success(angular.bind(this, function (data) {
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data;

                $('.notifications-counter').html(data.unviewed);
                if (this.data.unviewed > 0) $('.notifications-counter').addClass('badgeImportant');
                else $('.notifications-counter').removeClass('badgeImportant');

                $('#notifications-dropdown').html('');

                for (var i in data.notifications) {
                    var notificationLength = 30, notificationButton = false;

                    if (data.notifications[i].hasOwnProperty('accepted') && !data.notifications[i].accepted) {
                        var notificationButton = '<a class="btn accept-notification" notification-id="'+data.notifications[i]._id+'">accept</a>';

                        notificationLength = 20;
                    }

                    var notificationText = (data.notifications[i].text.length > notificationLength) ? data.notifications[i].text.substr(0, notificationLength)+'...' : data.notifications[i].text;

                    var notification = '<a id="'+data.notifications[i]._id+'"><i class="btn btn-xs '+getNotificationIcon(data.notifications[i].type)+'"></i><span>'+notificationText+'</span></a>';

                    $('#notifications-dropdown').append(notification);

                    if (notificationButton) {
                        $('#'+data.notifications[i]._id).append(notificationButton);
                    }
                }

                $('.accept-notification').click(function() {
                    $http.post('/api/notifications/accept-notification', {id: $(this).attr('notification-id')})
                        .success(angular.bind(this, function (data) {
                            noty({text: 'Notification Accepted!!',  timeout: 2000, type: 'success'});

                            $(this).remove();
                        }))
                        .error(angular.bind(this, function (data) {
                            noty({text: 'Notification Error',  timeout: 2000, type: 'error'});
                        }));
                });
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));
    }

    function getNotificationIcon(type) {
        var notificationsIcons = [
            {icon: 'fa fa-info', value: 1},
            {icon: 'fa fa-warning', value: 2}
        ];

        return notificationsIcons[type-1].icon;
    }

    this.getNotifications = function() {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/notifications/get-notifications'})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.markAsViewed = function() {
        $http({method: 'POST', url: '/api/notifications/mark-as-viewed'});
    };

    return this;
});
