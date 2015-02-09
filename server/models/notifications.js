var mongoose = require('mongoose');

var notificationsSchema = new mongoose.Schema({
    user_id: String,
    sender_id: String,
    type: Number,
    text: String,
    viewed: Boolean,
    accepted: Boolean,
    accept_url: String,
    created: { type: Date, default: Date.now }
}, { collection: config.app.collectionsPrefix+'notifications' })

// other virtual / static methods added to schema

notificationsSchema.statics.getDropdown = function(user_id, done){
    var Notifications = this;

    this.find({"user_id": user_id},{}, {limit: 5, sort: {created: -1}}, function(err, notifications){
        if(err) throw err;

        Notifications.count({"user_id": user_id, "viewed": false}, function (err, unviewed) {
            //done({result: 1, page: page, pages: Math.ceil(count/perPage), roles: roles});
            done({result: 1, notifications: notifications, unviewed: unviewed});
        });
    });
}

notificationsSchema.statics.getNotifications = function(data, done){
    var Notifications = this, perPage = 5, page = (data.page) ? page : 1;

    this.find({"user_id": data.user_id},{}, {skip: (page-1)*perPage, limit: perPage, sort: {created: -1}}, function(err, notifications){
        if(err) throw err;

        Notifications.count({"user_id": data.user_id, "viewed": false}, function (err, unviewed) {
            //done({result: 1, page: page, pages: Math.ceil(count/perPage), roles: roles});
            done({result: 1, notifications: notifications, unviewed: unviewed});
        });
    });
}

notificationsSchema.statics.markAsViewed = function(user_id){
    this.update({
        "user_id": user_id
    }, {
        $set: {
            "viewed" : true
        }
    }, {
        multi: true
    }, function (err) {
        if(err) throw err;
    });
}

notificationsSchema.statics.sendNotification = function(data, done){
    if (!data.user_id || !data.type || !data.text) {
        done({result: 0, msg: "'user_id', 'type' and 'text' is required."});
        return;
    }
    var notification = {
        user_id : data.user_id,
        sender_id : data.sender_id,
        type : data.type,
        text : data.text,
        viewed : false
    };
    if (data.accept_url) {
        notification.accepted = false;
        notification.accept_url = data.accept_url;
    }

    this.create(notification, function(err, notification){
        if(err) throw err;

        if (data.communication_id) {
            var Users = require('../models/users');

            Users.getUserEmail(data.user_id, function(result){
                var postData = {
                    id: data.communication_id,
                    email: result
                };
                sendCommunication(postData);
            });
        }

        if (typeof done != 'undefined') done({result: 1, msg: "Notification created", notification: notification.toObject()});
    });
}

notificationsSchema.statics.acceptNotification = function(user_id, data, done){
    var Notifications = this;
    if (!data.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    this.findOne({"_id" : data.id},{},function(err, notification){
        if (!notification.accept_url || notification.accepted || notification.user_id != user_id) {
            done({result: 0, msg: "This notification can not be accepted."});
        }
        else {
            Notifications.update({
                "_id" : data.id
            }, {
                $set: {
                    "accepted" : true
                }
            }, function (err) {
                if(err) throw err;

                var http = require('http');

                http.get(notification.accept_url, function(res) {
                    done({result: 1, msg: "Notification accepted."});
                }).on('error', function(e) {
                    done({result: 0, msg: "Error loading notification url."});
                });
            });
        }
    });
}

// admin methods


var Notifications = connection.model('Notifications', notificationsSchema);
module.exports = Notifications;