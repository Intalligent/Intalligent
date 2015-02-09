//var Notifications = require('../models/notifications');
var Notifications = connection.model('Notifications');

/* NOTIFICATIONS */
exports.notificationsGetDropdown = function(req,res){
    Notifications.getDropdown(req.user.id, function(result){
        res.send(201, result);
    });
};

exports.notificationsGetNotifications = function(req,res){
    req.query.user_id = req.user.id;

    Notifications.getNotifications(req.query, function(result){
        res.send(201, result);
    });
};

exports.notificationsMarkAsViewed = function(req,res){
    Notifications.markAsViewed(req.user.id);
};

exports.notificationsSendNotification = function(req,res){
    req.body.sender_id = req.user.id;

    Notifications.sendNotification(req.body, function(result){
        res.send(201, result);
    });
};

exports.notificationsAcceptNotification = function(req,res){
    console.log(req.body);

    Notifications.acceptNotification(req.user.id, req.body, function(result){
        res.send(201, result);
    });
};