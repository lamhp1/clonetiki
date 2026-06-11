const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const cookieParser = require('cookie-parser');
const multer = require("./multer");

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const mongoUri = process.env.MONGO_DB
const dbStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

app.use(cors(
  {
    origin: 'https://lamshop.vercel.app', // Dia chi cua frontend
    // origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phep gui cookie va thong tin xac thuc
  }
))
app.use(bodyParser.json({ limit: '15mb' }))
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade'); // Cau hinh lai chinh sach
  next();
});
// app.use(multer);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'LamShop API is running',
  })
})

app.get('/health', (req, res) => {
  const readyState = mongoose.connection.readyState

  res.status(readyState === 1 ? 200 : 503).json({
    status: readyState === 1 ? 'OK' : 'ERROR',
    dbState: dbStates[readyState] || 'unknown',
    hasMongoUri: Boolean(mongoUri),
    uptime: process.uptime(),
  })
})

routes(app)

if (!mongoUri) {
  console.error('MONGO_DB environment variable is missing')
} else {
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log('connect DB successfully')
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message)
    })
}

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
