const express =require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const adminRoutes=require("./routes/admin-routes");
const HttpError=require("./models/http-error");

const app=express();


app.use(bodyParser.json()); //body parser middleware must be declare here, before request reach the routes (ex:placesRoutes,userRoutes), because middleware always parse top to bottom, thats why they have a next().

app.use((req, res, next) => {//this custom middleware use to solve the error when connecting the react. without these settings browser will throw bunch of errors. Postman can still work without this middleware.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});


app.use("/api/admin", adminRoutes);

app.use((req, res, next) => {
  const error = new HttpError("page not found!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  //this middleware will execute, if any of above middleware throws an error. all the errors will output by this middleware.
  if (res.headerSent) {//when headers already sent, we can't output a error. because response already sent. so just return next
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!!" });
});


mongoose
  .connect('mongodb+srv://crhunter:Pass4mongodb@cluster0-g3mcz.mongodb.net/clothing-store?retryWrites=true&w=majority')
  .then(()=>{
    app.listen(9000);
    console.log('server & db are up and running!!!');
  })
  .catch((err) => {
    console.log(err);
  });
  