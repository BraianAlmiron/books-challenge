const express = require('express');
const mainRouter = require('./routes/main');
const methodOverride = require('method-override');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cookieCheck = require('./middlewares/cookieCheck')
const localsUserCheck = require('./middlewares/localsUserCheck');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: "booksChallenge",
  resave :false,
  saveUninitialized : true
})
);
app.use(cookieParser());
app.use(cookieCheck);
app.use(localsUserCheck);



app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
