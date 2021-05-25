const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener',{
    useNewUrlParser:true, useUnifiedTopology:true, 
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.get('/', async (req,res)=>{
    const shortUrls =await ShortUrl.find()
    console.log("sas",shortUrls)
    res.render('index', {shortUrls:shortUrls})
})

app.post('/shortUrls', async (req,res)=>{
    console.log("da",req.body)
    await ShortUrl.create({
        full:req.body.fullUrl
    })

    res.redirect('/')
})

app.get('/:shortUrl',async (req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl==null) return res.send(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)