/**
 * Module dependencies
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs  = require('fs'),
    mongoose = require('mongoose'),
    passport = require("passport"),
    moment = require('moment'),
    RedisStore 	= require('connect-redis')(express)  //npm install connect-redis --- to store variable sessions

global.moment = moment;

var env = process.env.NODE_ENV || 'development';
// Application Params
process.argv.forEach(function(val, index, array) {
    if (index == 2) env = val;
});

var app = module.exports = express();

/**
 * Configuration
 */
var config = require('./server/config/config')[env];
global.config = config;

require('./server/config/mongoose')(mongoose);
require('./server/config/passport')(passport);

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.cookieSession({key:"myKey",secret:"mySecret"}));
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(express.session({
    store: new RedisStore({
        maxAge: 24 * 60 * 60 * 1000
    })
}));

/* GLOBAL FUNCTIONS */
function restrict(req, res, next) {
    if(req.isAuthenticated()){
        //console.log(req.user);
        console.log("Session OK!");
        next();
    }else{
        req.session.error = 'Access denied!';
        console.log("Access denied!");
        res.redirect(301,'/');
        res.send();
    }
}
global.restrict = restrict;

function restrictRole(roles) {
    return function(req, res, next) {
        if (typeof roles == 'string') roles = [roles];
        console.log(typeof roles);
        // Do whatever you want with myArgument.
        if(req.isAuthenticated()){
            console.log("Session OK!");

            for (var i in roles) {
                if (req.user.roles.indexOf(roles[i]) > -1){
                    console.log("Role OK!");
                    next();
                    return;
                }
            }
        }
        req.session.error = 'Access denied!';
        console.log("Access denied!");
        res.redirect(301,'/');
        res.send();
    };
}
global.restrictRole = restrictRole;

function saveToLog(req, text, type) {
    //var Logs = require('./models/logs');
    var Logs = connection.model('Logs');

    Logs.saveToLog(req, {text: text, type: type});
};
global.saveToLog = saveToLog;

function getNextSequence(name) {
    var Counters = connection.model('Counters');
    var ret = Counters.findAndModify(
        {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
        }
    );

    return ret.seq;
}
global.getNextSequence = getNextSequence;

function sendNotification(req, user_id, text, type, communication_id, accept_url) {
    //var Notifications = require('./models/notifications');
    var Notifications = connection.model('Notifications');

    var data = {user_id: user_id, sender_id: req.user.id, text: text, type: type, communication_id: communication_id, accept_url: accept_url};

    Notifications.sendNotification(data);
};
global.sendNotification = sendNotification;

function sendCommunication(data) {
    var Communications = connection.model('Communications');

    Communications.sendEmail(data, function(result){
        console.log(result);
    });
};
global.sendCommunication = sendCommunication;

function generateUserFilter(req, filters) {
    if (typeof filters == 'string') filters = [filters];

    var userFilters = {};

    if (req.user.filters) {
        for (var i in filters) {
            for (var j in req.user.filters) {
                if (String(req.user.filters[j].name).toLowerCase() == String(filters[i]).toLowerCase()) {
                    if(!userFilters.hasOwnProperty(filters[i]))
                        userFilters[filters[i]] = [];

                    userFilters[filters[i]].push(req.user.filters[j].value);
                }
            }
        }
    }

    return userFilters;
};
global.generateUserFilter = generateUserFilter;

function generateUserFilterValue(req, filter) {
    var userFilterValue = [];

    if (req.user.filters) {
        for (var i in req.user.filters) {
            if (String(req.user.filters[i].name).toLowerCase() == String(filter).toLowerCase()) {
                userFilterValue.push(req.user.filters[i].value);
            }
        }
    }

    return userFilterValue;
};
global.generateUserFilterValue = generateUserFilterValue;

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
    // TODO
};

//console.log(app.settings.env);
console.log(env);

require('./server/config/routes')(app, passport);

var routes_dir = __dirname + '/server/routes';
fs.readdirSync(routes_dir).forEach(function (file) {
    if(file[0] === '.') return;
        require(routes_dir+'/'+ file)(app);
});

//Custom routes
var routes_dir = __dirname + '/server/custom';
fs.readdirSync(routes_dir).forEach(function (file) {
    if(file[0] === '.') return;
    require(routes_dir+'/'+ file+'/routes.js')(app);
});

//TODO: ")]}',\n"       json injection
//TODO: Grunt.js.  creacion de templates en tiempo real
//TODO: Node js ....open id

// redirect all others to the index (HTML5 history)
///app.get('*', server.index);

/**
 * Start Server
 */

/*
 express.vhost('your-vhost-name', app);

 http.createServer(app).listen(app.get('port'), function () {
 console.log('Express server listening on port ' + app.get('port'));
 });

 */

var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || config.port;

http.createServer(app).listen(port, ipaddr);
//http.createServer(app).listen(port, "0.0.0.0");
console.log("Server running at http://" + ipaddr + ":" + port + "/");

/*
 //Configuratio several domains in the same node server

 Or alternatively you could use connect.vhost (which is available as express.vhost in express).

 Then, create several sites in their own directory and export the express app, eg. /path/to/m/index.js:

 var app = express()
 // whatever configuration code
 exports.app = app
 // THere is no need for .listen()
 And then handle all requests with the following app:

 express()
 .use(express.vhost('m.mysite.com', require('/path/to/m').app))
 .use(express.vhost('sync.mysite.com', require('/path/to/sync').app))
 .listen(80)
 Note that /path/to/m and /path/to/sync can be absolute paths (as written above) or relative paths.

 */
