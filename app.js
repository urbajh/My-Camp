const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/my-camps', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) => {
    const camps = await Campground.find({})
    res.render('home', { camps })
})


app.listen(3000, () => {
    console.log('server on!!, port 3000')
})