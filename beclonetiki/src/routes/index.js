const useRouter = require('./UserRouter')
const productRouter = require('./ProductRouter')
const orderRouter = require('./orderRouter')

const routes = (app) => {
    app.use('/api/user', useRouter)
    app.use('/api/product', productRouter)
    app.use('/api/order', orderRouter)
}

module.exports = routes