const express = require('express');
const router = express.Router()
const ProductController = require('../controllers/ProductControllers')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')
const { uploadImageProduct }= require('../controllers/uploadControllers')



router.post('/create-product',authMiddleware ,ProductController.createProduct)
router.post('/create-product-image',authMiddleware, uploadImageProduct.single('imageProduct'), ProductController.createProductImage)
router.put('/update-product/:id', authMiddleware,ProductController.updateProduct)
router.get('/get-details/:id', ProductController.detailProduct)
router.delete('/delete-product/:id', authMiddleware,ProductController.deleteProduct)
router.post('/delete-many', authMiddleware, ProductController.deleteManyProduct)
router.get('/getAll-products', ProductController.getAllProducts)
router.get('/getAll-type-products', ProductController.getAllTypeProducts)
router.put('/rate-product/:id', ProductController.rateProduct)




module.exports = router
