const express = require("express")
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv").config();


const mainRoutes = require("./routes/mainRoutes");

const sequelize = require("./database/dbConnect");


let csrf = require("csurf");
let hpp = require("hpp");
let helmet = require("helmet");
let xss = require("xss-clean");
let cors = require("cors");
let compression = require("compression");

sequelize.sync({  })
.then(() => {
    let app = express();
    app.use(morgan('dev'));
    app.set('trust proxy', 1);
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));
    app.use(xss());
    app.use(cors());
    // app.use(csrf());
    app.use(hpp());
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(compression());
    
    const hbs = require("express-handlebars");
    
    let PORT = process.env.PORT || 3000;
    
    app.use(express.static(path.join(__dirname, "public")));
    
    app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'main-layout', layoutsDir: __dirname + '/views/layouts/' }));
    app.set('view engine', 'hbs');
    app.set('views', './views');

    // app.use((req, res, next) => {
    //     res.locals.csrfToken = req.csrfToken();
    //     next();
    // });
    app.use(mainRoutes);
    
    app.all('*', function(req, res, next) {
        res.status(404).render('errors/404');
    });
    
    app.listen(PORT, (err) => {
        if(err) console.log("Error Occured: ", err);
        console.log("Server is running on port: http://localhost:"+ PORT);
    });
})
.catch(err => {
    console.error(err);
    throw new Error(err);
});