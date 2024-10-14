const Order = require('../models/OrderProduct')
const Product = require("../models/ProductModel");
const sendOrderConfirmation = require('./MailerService');


const createOrder = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, shippingAddress, paymentMethod,deliveryMethod, shippingPrice, totalPrice, isPaid, paidAt, user, email } = newProduct
        try {
            const promise = orderItems?.map( async (orderItem) => {
                const checkOrder = await Product.findOneAndUpdate(
                    {
                        _id: orderItem?.product,
                        countInStock: {$gte: orderItem?.amount}
                    },
                    {
                        $inc: {
                            countInStock: -orderItem?.amount,
                            selled: +orderItem?.amount
                        }
                    },
                    {new: true}
                )
                // console.log('checkOrder', checkOrder)
                if(checkOrder) {
                    return {
                        status: 'OK',
                        message: 'success',
                        checkOrder
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: orderItem?.product
                    }
                }
            })
            const result = await Promise.all(promise)
            if(result && result.some(item => item.message === 'ERR')) {
                // console.log('err', )
                resolve({
                    status: 'OK',
                    message: 'ERR',
                    data: result
                })
            } else {
                // console.log('success')
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress,
                    paymentMethod,
                    deliveryMethod,
                    shippingPrice,
                    totalPrice,
                    isPaid,
                    paidAt,
                    user
                })
                // console.log('createdOrder', createdOrder)
                if(createdOrder) {
                    await sendOrderConfirmation(email, createdOrder)
                    resolve ({
                        status: 'OK',
                        message: 'success',
                        data: result
                    })
                }
            }
        } catch(e) {
            reject(e);
        }
    })
}

const getDetailOrder =  (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listOrder = await Order.find({
                user: idUser
            })
            if(!listOrder) {
                resolve({
                    status: 'OK',
                    message: 'ERR',
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: listOrder
            })
        } catch(e) {
            reject(e)
        }
    })
}

const deleteOrder =  (idOrder, orderItems) => {
    return new Promise(async (resolve, reject) => {
        try { 
            // console.log('orderItems', orderItems)
            const orderDelete = await Order.findByIdAndDelete(idOrder)
            if(orderDelete) {
                const promise = orderItems?.map(async (orderItem) => {
                    const incAmount = await Product.findByIdAndUpdate(orderItem?.product, {
                        $inc: {
                            countInStock: +orderItem?.amount,
                            selled: -orderItem?.amount
                        }
                    },
                    {new: true}
                    )
                    // console.log('incAmount', incAmount)
                    if(incAmount) {
                        return {
                            status: 'success',
                            data: incAmount
                        }
                    } else {
                        return {
                            status: 'ERR',
                            data: orderItem?.product
                        }
                    }
                }   
            )
                const result = await Promise.all(promise)
                if(result && result?.every(item => item?.status === 'success')) {
                    resolve({
                        status: 'OK',
                        message: 'success',
                        data: result
                    })
                } else {
                    resolve({
                        status: 'OK',
                        message: 'ERR',
                        data: result
                    })
                }
                }
            resolve({
                status: 'OK',
                message: 'idOrder dont match',
            })
            }
        catch(e) {
            reject(e)
        }
        })}

const deleteManyOrder = (ids) => {
    return new Promise(async (resolve, reject) => {
        try { 
            const deleteMany = await Order.deleteMany({ _id: { $in: ids } })
            if(!deleteMany) {
                resolve({
                    status: 'OK',
                    message: 'ERR'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: deleteMany
            })
        } catch(e) {
            reject(e)
        }
})
}

const getAllOrders = () => {
    return new Promise(async (resolve, reject) => {
        try { 
            const getAll = await Order.find()
            if(!getAll) {
                resolve({
                    status: 'OK',
                    message: 'ERR'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: getAll
            })
        } catch(e) {
            reject(e)
        }
})}

module.exports = { createOrder, getDetailOrder, deleteOrder,deleteManyOrder, getAllOrders };
