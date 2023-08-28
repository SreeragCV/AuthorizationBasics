const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const path = require('path');
const bcrypt = require('bcrypt');

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
    res.redirect('/');
})

app.get('/secrets', (req, res) => {
    res.send('THIS IS SECRET!!!')
})

app.listen(3000, () => {
    console.log('APP LISTENING FROM PORT 3000');
})