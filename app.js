const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();
const app = express();
const pageRouter = require('./routes/page');

app.set('port', process.env.PORT || 8001);
/* numjucks 미들웨어 */
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('database connected!');
    })
    .catch((err) => {
        console.error(err);
    })

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

app.use('/', pageRouter);
/* 404 error */
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} router does not exist`);
    error.status = 404;
    next(error);
});

app.use((req, res, next) => {
    res.status(404).send('Not Found');
})

app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});


app.listen(app.get('port'), ()=>{
    console.log(`Server online on port ${app.get('port')}`);
});

