const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

//LOAD PASSPORT
require('./config/passport')(passport);

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Handlebars
app.engine(
    '.hbs', 
    exphbs.engine({
        // helpers: {
        //     formatDate,
        //     stripTags,
        //     truncate,
        //     editIcon,
        //     select
        // },
        defaultLayout: 'main',
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

// SESSIONS
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      //!Change: MongoStore syntax has changed
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
      })
    })
  )

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use('/', require('./routes/index'))
// app.use('/auth', require('./routes/auth'))
// app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 8500;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);