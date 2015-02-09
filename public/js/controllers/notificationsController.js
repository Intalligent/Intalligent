app.controller('notificationsCtrl', function ($scope, notificationsModel, $stateParams, $q, $rootScope) {
    var notificationDays = [];

    $scope.notificationsModel = notificationsModel;

    $scope.getNotificationsDropdown = function() {
        notificationsModel.getNotificationsDropdown();
    };

    $scope.getNotifications = function() {
        $q.all([
            notificationsModel.getNotifications()
        ]).then(function(data) {
            for (var i in data[0].notifications) {
                var date = new Date(data[0].notifications[i].created), text = data[0].notifications[i].text;
                var notificationDay = getDay(date), day = false;

                day = (notificationDays.indexOf(notificationDay) > -1);

                if (!day) {
                    var notificationsContainer = $('<div class="timeline-container timeline-style2"><span class="timeline-label"><b>'+notificationDay+'</b></span><div id="'+notificationDay.replace(" ","-")+'" class="timeline-items"></div></div>');

                    $('#timeline-container').append(notificationsContainer);

                    notificationDays.push(notificationDay);
                }

                var timelineItem = $('#timeline-item').clone();

                timelineItem.attr('id', '');

                timelineItem.children('.timeline-info').children('.timeline-date').html(getTime(date));
                timelineItem.children('.widget-box').children('.widget-body').children('.widget-main').html(text);

                $('#'+notificationDay.replace(" ","-")).append(timelineItem);

                timelineItem.show();
            }
        });
    };

    $scope.markAsViewed = function() {
        $('.notifications-counter').removeClass('badgeImportant');

        notificationsModel.markAsViewed();
    };

    $rootScope.sendNotification = function(userId, text, type, communicationId, acceptURL) {
        communicationId = (typeof communicationId == 'undefined') ? null : communicationId;
        acceptURL = (typeof acceptURL == 'undefined') ? null : acceptURL;

        $http.post('/api/notifications/send-notification', {user_id: userId, text: text, type: type, communication_id: communicationId, accept_url: acceptURL});

        return true;
    }

    function getTime(date) {
        return date.getHours()+":"+date.getMinutes();
    }

    function getDay(date) {
        var today = new Date();
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        if (date.getYear() == today.getYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate())
            return "Today";
        else if (date.getYear() == today.getYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()-1)
            return "Yesterday";
        else
            return months[date.getMonth()]+" "+date.getDate();
    }
});

app.config(function($stateProvider) {

    $stateProvider.state('notifications',{
        url:'/notifications',
        templateUrl : '/partial/private/notifications',
        controller : 'notificationsCtrl'
    })

});

var init = function () {
    $.ajax({
        url: "/modules/notifications/views/dropdown.html",
        success: function (data) { $('#navbar-right').prepend(data); },
        dataType: 'html'
    });
};

init();
