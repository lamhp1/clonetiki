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

app.use(cors(
  {
    origin: 'https://lamshop.vercel.app', // Địa chỉ của frontend
    // origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
  }
))
app.use(bodyParser.json({ limit: '15mb' }))
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade'); // Cấu hình lại chính sách
  next();
});
// app.use(multer);

routes(app)

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
  // console.log('connect DB successfully');
})
.catch(err => {
  // console.log(err);
})

app.listen(port, () => {
    // console.log(`Example app listening on port ${port}`)
  })