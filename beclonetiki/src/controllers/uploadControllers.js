const multer = require('multer')
const cloudinary = require('../configs/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storageAvatar = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'avatars',
      format: async (req, file) => 'webp',
       // Lưu file dưới định dạng webp
      public_id: (req, file) => file.originalname.split('.')[0], // Đặt tên file theo tên gốc (không có đuôi file)
      transformation: [
        { width: 500, height: 500, crop: 'limit', quality: 'auto' }, // Giới hạn kích thước và chất lượng ảnh
      ]
    },
  });

const uploadAvatar = multer({
    storage: storageAvatar
})

const storageImageProduct = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'image-product',
    format: async (req, file) => 'webp',
     // Lưu file dưới định dạng webp
    public_id: (req, file) => file.originalname.split('.')[0], // Đặt tên file theo tên gốc (không có đuôi file)
    transformation: [
      { width: 500, height: 500, crop: 'limit', quality: 'auto' }, // Giới hạn kích thước và chất lượng ảnh
    ]
  },
});

const uploadImageProduct = multer({
  storage: storageImageProduct
})

module.exports = { uploadAvatar, uploadImageProduct }