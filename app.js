const express = require('express');
const methodOverride = require('method-override');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/my-camps', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

app.engine('ejs',ejsMate )
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res)=>{
    try{
        const camps = await Campground.find({});
        res.render('campgrounds/index', { camps });
    }catch(e){
        res.render('campgrounds/index', {camps});
        console.log(e);
    }
})
app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', async (req, res)=>{
    const {campground} = req.body;
    const newCamp = await new Campground(campground);
    newCamp.save()
    console.log('campground',campground);
    console.log('req.body',req.body);
    res.redirect('/campgrounds');
})
app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', {camp});
})

app.get('/campgrounds/edit/:id', async(req, res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', {camp})
})

app.put('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    const {campground} = req.body;
    const camp = await Campground.findByIdAndUpdate(id,campground, {new:true});
    console.log(camp);
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('server on!!, port 3000')
})