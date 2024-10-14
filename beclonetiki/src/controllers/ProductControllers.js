const ProductService = require('../services/ProductService');
const JwtService = require('../services/JwtService');

const createProductImage = async (req, res) => {
    try {
        const imageProduct = req.file.path;
        const imagePublicId = req.file.filename;
        // Lưu thông tin ảnh vào req để sử dụng trong createProduct
        return res.status(200).json({
            imageProduct,
            imagePublicId
        })


         // Chuyển sang middleware tiếp theo hoặc hàm xử lý yêu cầu tiếp theo
    } catch (err) {
        return res.status(404).json({ message: err });
    }
};

const createProduct = async (req, res) => {
    try {
        // console.log('body', req.body)
        const { name, type, price, countInStock, description,  imageData } = req.body

        // console.log('avatar', req.avatar)

        if(!name || !type || !price || !countInStock || !description || !imageData) {
            return res.status(200).json({
                status: 'error',
                message: 'input is required'
            })
        }

        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}


const updateProduct = async (req, res) => {
    try {
        const idProduct = req.params.id
        const data = req.body
        if(!idProduct) {
            return res.status(404).json({
                status: 'error', 
                message: 'idProduct is required'});
        }
        const response = await ProductService.updateProduct(idProduct, data);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}


const detailProduct = async (req, res) => {
    try {
        const idProduct = req.params.id
        if(!idProduct) {
            return res.status(404).json({message: 'User not found'});
        }
        const response = await ProductService.detailProduct(idProduct)
        return res.status(200).json(response)
    }
    catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const idProduct = req.params.id
        if(!idProduct) {
            return res.status(404).json({
                status: 'error', 
                message: 'idProduct is required'});
        }
        const response = await ProductService.deleteProduct(idProduct);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteManyProduct = async (req, res) => {
    try {
        // console.log(req.body)
        const { ids } = req.body
        if(!Array.isArray(ids) || ids.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ids not is a array'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch(err) {
        return res.status(404).json({message: err});
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { page, limit, sort, filter } = req.query
        const response = await ProductService.getAllProducts(Number(page) || 0, Number(limit), sort, filter);
        return res.status(200).json(response)
    }
    catch (err) {
        return res.status(404).json({message: err});
    }
}


const getAllTypeProducts = async(req, res) => {
    try {
        const response = await ProductService.getAllTypeProducts()
        return res.status(200).json(response)
    } catch(err) {
        return res.status(404).json({message: err});
    }
}

const rateProduct = async(req, res) => {
    try {
        const idProduct = req.params.id
        const { rate } = req.body
        if(!idProduct) {
            return res.status(404).json({
                status: 'error', 
                message: 'idProduct is required'});
        }
        const response = await ProductService.rateProduct(idProduct, rate);
        return res.status(200).json(response)
    } catch(err) {
        return res.status(404).json({message: err});
    }
}

module.exports = { createProductImage, createProduct, updateProduct, detailProduct, deleteProduct, deleteManyProduct, getAllProducts, getAllTypeProducts, rateProduct };