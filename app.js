const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin-routes');
const categoryRoutes = require('./routes/category-routes');
const HttpError = require('./models/http-error');
const fs = require('fs');
const path = require('path');
const cartRoutes = require('./routes/cart-routes');
var port = process.env.PORT || 9000;
const productRoutes = require('./routes/product-routes');
const userRoutes = require('./routes/user-routes');
const managerRoutes = require('./routes/manager-routes');
const wishlistRoutes = require('./routes/wishlist-routes');
const cors = require('cors');
const orderRoutes = require('./routes/order-routes');
const app = express();

app.use(bodyParser.json()); //body parser middleware must be declare here, before request reach the routes (ex:placesRoutes,userRoutes), because middleware always parse top to bottom, thats why they have a next().

app.use('/uploads/images', express.static(path.join('uploads', 'images'))); //just returns the requseted file(image).

app.use(cors());

app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/wishlist', wishlistRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/manager', managerRoutes);

app.use((req, res, next) => {
    const error = new HttpError('page not found!', 404);
    throw error;
});

app.use((error, req, res, next) => {
    //this middleware will execute, if any of above middleware throws an error. all the errors will output by this middleware.
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            //delete the uploaded file(image), if middlewares throws any error while processing the requeset.
            console.log(err);
        });
    }

    if (res.headerSent) {
        //when headers already sent, we can't output a error. because response already sent. so just return next
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!!' });
});

mongoose
    .connect(
        'mongodb+srv://crhunter:Pass4mongodb@cluster0-g3mcz.mongodb.net/clothing-store?retryWrites=true&w=majority'
    )
    .then(() => {
        app.listen(port);
        console.log('server & db are up and running!!!');
    })
    .catch((err) => {
        console.log(err);
    });
