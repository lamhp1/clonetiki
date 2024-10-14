const OrderService = require('../services/OrderService');


const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, deliveryMethod, shippingPrice, totalPrice, user } = req.body
        // console.log(!!orderItems)

        if(!orderItems || !shippingAddress || !paymentMethod || !deliveryMethod || shippingPrice === undefined || !totalPrice || !user) {
            return res.status(200).json({
                status: 'error',
                message: 'input is required'
            })
        }

        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const getDetailOrder = async (req, res) => {
    try {
        const idUser = req.params.id
        if(!idUser) {
            return res.status(404).json({message: 'idUser not found'});
        }
        const response = await OrderService.getDetailOrder(idUser)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { _id: idOrder, orderItems } = req.body
        // console.log('idOrder', idOrder)
        // console.log('orderItems', orderItems)
        if(!idOrder || orderItems?.length === 0) {
            return res.status(404).json({message: 'id product is require'});
        }
        const response = await OrderService.deleteOrder(idOrder, orderItems)
        return res.status(200).json(response)

    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteManyOrder = async (req, res) => {
    try {
        const { ids } = req.body
        if(!Array.isArray(ids) || ids.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ids not is a array'
            })
        }
        const response = await OrderService.deleteManyOrder(ids)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const getAllOrders = async (req, res) => {
    try {
        const response = await OrderService.getAllOrders()
        return res.status(200).json(response)
    } catch(err) {
        return res.status(404).json({message: err});
    }
}

module.exports = { createOrder, getDetailOrder, deleteOrder, deleteManyOrder ,getAllOrders };