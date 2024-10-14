const express = require('express');
const router = express.Router()
const OrderControllers = require('../controllers/OrderControllers.js')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')




router.post('/create-order/:id',authUserMiddleware ,OrderControllers.createOrder)
router.get('/get-detail-order/:id', authUserMiddleware ,OrderControllers.getDetailOrder)
router.post('/delete-order/:id', authUserMiddleware ,OrderControllers.deleteOrder)
router.post('/delete-many-order', authMiddleware, OrderControllers.deleteManyOrder)
router.get('/get-all-orders',authMiddleware, OrderControllers.getAllOrders )







module.exports = router