const express = require('express')
const path = require('path')
require('dotenv').config()
require('./database/database')
const cookieParser = require('cookie-parser');
const routes = require('./routes/router')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());    
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',routes)


app.listen(process.env.PORT,()=>{
    
    console.log(`express listen on port ${process.env.PORT}`)
})