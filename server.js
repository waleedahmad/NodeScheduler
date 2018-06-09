const fs = require('fs'),
    https = require('https'),
    express = require('express'),
    Session = require('express-session'),
    FileStore = require('session-file-store')(Session),
    fileUpload = require('express-fileupload'),
    bodyParse = require('body-parser'),
    passport = require('./auth/passport'),
    mongoose = require('mongoose'),
    FB = require('fb'),
    config = require('config'),
    middleware = require('connect-ensure-login'),
    scheduler = require('./cron/scheduler'),
    options = {
        key: fs.readFileSync(__dirname + '/certs/selfsigned.key'),
        cert: fs.readFileSync(__dirname + '/certs/selfsigned.crt'),
    },
    port = 8888;

FB.options({
    appId: config.get('appId'),
    appSecret: config.get('appSecret')
});

const app = express();
mongoose.connect('mongodb://127.0.0.1/nodeFB');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/src', express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));

app.use(fileUpload());

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json());
app.use(Session({
    store: new FileStore(),
    secret: config.get('sessionSecret'),
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/scheduler'));
app.use('/login', require('./routes/login'));

app.get('/',
    function (req, res) {
        res.render('app', {user: req.user});
    });

app.get('/logout',
    middleware.ensureLoggedIn(),
    (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

app.get('*',
    middleware.ensureLoggedIn(),
    function (req, res) {
        res.render('app', {user: req.user});
    });

scheduler();

https.createServer(options, app).listen(port, function(){
    console.log("Express server listening on port " + port);
});

