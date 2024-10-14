const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("./JwtService");
const cloudinary = require('cloudinary').v2



const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, type, price, countInStock, description, disCount, imageData } = newProduct

        const {imageProduct, imagePublicId} = imageData

        try {
            const checkProduct = await Product.findOne({ name: name });
            if(checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The product is already in'
                })
            }
            // tạo user
            const createdProduct = await Product.create({
                name,
                type,  
                price,
                disCount,
                countInStock,  
                description,
                image: imageProduct,
                imagePublicId: imagePublicId
            })
            if(createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createdProduct
                })

            }
        } catch(e) {
            reject(e);
        }
    })
}


const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('data', data)
            const product = await Product.findById(id);
            if (!product) {
                resolve({
                    status: 'error',
                    message: 'user not found',
                    })
                }
            let dataUpdate = {}
            if(data.imageData) {
                const { imageData, ...rest } = data
                const {imageProduct: image, imagePublicId} = imageData
                dataUpdate = { ...rest, image, imagePublicId }
            } else {
                dataUpdate = data
            }

            // console.log('dataUpdate', dataUpdate)

            // Xóa image cũ nếu tồn tại
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, dataUpdate, {new: true})

            if (!updatedProduct) {
            resolve({
                status: 'error',
                message: 'product not found',
                })
            }
            // console.log(updatedProduct)
            resolve({
                status: 'OK',
                message: "Product updated successfully",
                data: updatedProduct
            })
        }
        catch (err) {
            reject(err)
        }

    })
}

const detailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const findProduct = await Product.findById(id)
            if(!findProduct) {
                resolve({
                    status: 'ERROR',
                    message: 'product not found'
                })}
            resolve({
                status: 'OK',
                message: 'success',
                data: findProduct
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deleteProduct = await Product.findByIdAndDelete(id)

            if(!deleteProduct) {
                resolve({
                    status: 'error',
                    message: 'product not found'
                })
            }
            resolve({
                status: 'OK',
                message: 'success'
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            const deleteManyProduct = await Product.deleteMany({ _id: { $in: ids } })

            resolve({
                status: 'OK',
                message: `${deleteManyProduct.deletedCount} users was delete`
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const getAllProducts = (page, limit, sort, filter) => {
    // console.log(filter)
    return new Promise(async (resolve, reject) => {
        try {
            const totalProducts = await Product.countDocuments()
            if(filter && filter[0] === 'type') {
                const allProductsFilter = await Product.find({
                    [filter[0]] : { $regex: filter[1], $options: 'i' }
                }).limit(limit).skip(page*limit)
                const totalFilterProducts = await Product.find({
                    [filter[0]] : { $regex: filter[1], $options: 'i' }
                }).countDocuments()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductsFilter,
                    totalProducts,
                    totalFilterProducts,
                    currentPage: page + 1,
                    totalPages: Math.ceil(totalProducts / limit)
                })
            }
            if(filter && filter[0] === 'rating') {
                const allProductsFilter = await Product.find({
                    [filter[0]] : { $in: [parseFloat(filter[1]), parseFloat(filter[1]) + 0.5] }
                }).limit(limit).skip(page*limit)
                const totalFilterProducts = await Product.find({
                    [filter[0]] : {  $in: [parseFloat(filter[1]), parseFloat(filter[1]) + 0.5] }
                }).countDocuments()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductsFilter,
                    totalProducts,
                    totalFilterProducts,
                    currentPage: page + 1,
                    totalPages: Math.ceil(totalProducts / limit)
                })
            }
            if(filter && filter[0] === 'price') {
                //truong hop > 10.000.000
                if(filter[2] !== '0') {
                    const allProductsFilter = await Product.find({
                        [filter[0]] : { $gte: filter[1], $lte: filter[2] }
                    }).limit(limit).skip(page*limit)
                    const totalFilterProducts = await Product.find({
                        [filter[0]] : {  $gte: filter[1], $lte: filter[2] }
                    }).countDocuments()
                    resolve({
                        status: 'OK',
                        message: 'Success',
                        data: allProductsFilter,
                        totalProducts,
                        totalFilterProducts,
                        currentPage: page + 1,
                        totalPages: Math.ceil(totalProducts / limit)
                    })
                } else {
                    const allProductsFilter = await Product.find({
                        [filter[0]] : { $gte: filter[1] }
                    }).limit(limit).skip(page*limit)
                    const totalFilterProducts = await Product.find({
                        [filter[0]] : {  $gte: filter[1] }
                    }).countDocuments()
                    resolve({
                        status: 'OK',
                        message: 'Success',
                        data: allProductsFilter,
                        totalProducts,
                        totalFilterProducts,
                        currentPage: page + 1,
                        totalPages: Math.ceil(totalProducts / limit)
                    })
                }          
            }

            if(sort) {
                const objectSort = {}
                objectSort[sort[0]] = Number(sort[1])
                const allProductsSort = await Product.find().limit(limit).skip(page*limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductsSort,
                    totalProducts,
                    currentPage: page + 1,
                    totalPages: Math.ceil(totalProducts / limit)
                })
            }         
            const allProducts = await Product.find().limit(limit).skip(page*limit)
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProducts,
                totalProducts,
                currentPage: page + 1,
                totalPages: Math.ceil(totalProducts / limit)
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const getAllTypeProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'get all type successfully',
                data: allType
            })
        } catch(err) {
            reject(err)
        }
    })
}

const rateProduct = (idProduct, rate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(idProduct);
            if (!product) {
                resolve({
                    status: 'error',
                    message: 'product not found',
                    })
                }

            if (product) {
                const newRating = (product.rating * product.rateCount + rate) / (product.rateCount + 1);
                const newRatingRound = Math.round(newRating * 2) / 2;
                const updatedProduct = await Product.findByIdAndUpdate(idProduct, {
                    rating: newRatingRound,
                    $inc: {
                        rateCount: +1
                    }
                }, { new: true });
                if (!updatedProduct) {
                    resolve({
                        status: 'error',
                        message: 'update failed',
                        })
                }
                resolve({
                    status: 'OK',
                    message: "Product updated successfully",
                    data: updatedProduct
                })
            }
        }
        catch (err) {
            reject(err)
        }

    })
}


module.exports = { createProduct, updateProduct, detailProduct, deleteProduct, deleteManyProduct, getAllProducts, getAllTypeProducts, rateProduct };