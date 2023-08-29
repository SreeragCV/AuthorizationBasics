const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/authdemo')
.then(() => {
    console.log('MONGO CONNECTION OPEN!!');
})
.catch( err => {
    console.log('MONGO ERROR!!');
    console.log(err);
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('THIS IS HOME PAGE!!!!')
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password)
    if(validPassword){
        req.session.user_id = user._id;
        res.redirect('/secrets');
    }
    else{
        res.send('/login')
    }
})

app.get('/secrets', (req, res) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }
    res.send('YOU ARE LOGGED IN NOW YOU CAN SEE THIS SECRET!!!')
})

app.listen(3000, () => {
    console.log('APP LISTENING FROM PORT 3000');
})