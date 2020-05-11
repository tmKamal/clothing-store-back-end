const express =require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app=express();





mongoose
  .connect('mongodb+srv://crhunter:Pass4mongodb@cluster0-g3mcz.mongodb.net/clothing-store?retryWrites=true&w=majority')
  .then(()=>{
    app.listen(9000);
    console.log('server & db are up and running!!!');
  })
  .catch((err) => {
    console.log(err);
  });
  