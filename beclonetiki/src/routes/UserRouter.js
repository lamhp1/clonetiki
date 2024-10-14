const express = require('express')
const router = express.Router()
const useController = require('../controllers/UserControllers')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')
const { uploadAvatar } = require('../controllers/uploadControllers')

router.post('/sign-up', useController.createUser)
router.post('/sign-in', useController.loginUser)
router.post('/sign-out', useController.signoutUser)
router.put('/update-user/:id', authUserMiddleware ,useController.updateUser)
router.put('/update-avatar/:id', authUserMiddleware ,uploadAvatar.single('avatar') ,useController.updateAvatar)
router.delete('/delete-user/:id', authMiddleware, useController.deleteUser)
router.post('/delete-many', authMiddleware, useController.deleteManyUser)
router.get('/getAll', useController.allUsers)
router.get('/detail-user/:id', authUserMiddleware, useController.detailUser)
router.post('/refresh-token', useController.refreshToken)


module.exports = router