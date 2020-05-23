const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');
const authentication = require('../middleware/authentication');

router.use(authentication);

router.get('/items', orderController.getOrders);

router.post('/', orderController.addOrder);

router.post('/rated', orderController.itemReviewed);

router.post('/complete', orderController.completeOrder);

module.exports = router;
