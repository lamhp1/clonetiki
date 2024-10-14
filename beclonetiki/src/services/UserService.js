const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("./JwtService");
const cloudinary = require('cloudinary').v2



const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, passwordConfirm, phone } = newUser
        try {
            const checkUser = await User.findOne({ email: email });
            if(checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already in'
                })
            }
            // mã hóa password
            const hash = bcrypt.hashSync(password, 10);
            // tạo user
            const createdUser = await User.create({
                name,
                email, 
                password: hash,  
                phone
            })
            if(createdUser) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createdUser
                })

            }
        } catch(e) {
            reject(e);
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({ email: email });
            if(checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is not already'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if(!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password incorrect'
                })
            }
            //xac thuc jwt
            const accessToken = await generateAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refreshToken = await generateRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                    status: 'OK',
                    message: 'Success',
                    accessToken,
                    refreshToken
                })           
        } 
        catch(e) {
            reject(e);
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})

            if (!updatedUser) {
            resolve({
                status: 'error',
                message: 'user not found',
                })
            }
            resolve({
                status: 'OK',
                message: "User updated successfully",
                data: updatedUser
            })
        }
        catch (err) {
            reject(err)
        }

    })
}

const updateAvatar = (id, avatar, result) => {
    return new Promise(async (resolve, reject) => {
        try {

            const user = await User.findById(id);

            if (!user) {
                resolve({
                    status: 'error',
                    message: 'user not found',
                    })
                }

            // Xóa avatar cũ nếu tồn tại
            if (user.avatarPublicId) {
                await cloudinary.uploader.destroy(user.avatarPublicId);
            }

            const avatarPublicId = result.filename;

            // const user = await User.findById(id);
            const updatedUser = await User.findByIdAndUpdate(id, { avatar, avatarPublicId }, {new: true})

            resolve({
                status: 'OK',
                message: "Avatar updated successfully",
                data: updatedUser
            })
        }
        catch (err) {
            reject(err)
        }

    })
}

const deleteUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deleteUser = await User.findByIdAndDelete(idUser)

            if(!deleteUser) {
                resolve({
                    status: 'error',
                    message: 'user not found'
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

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deleteManyUser = await User.deleteMany({ _id: { $in: ids } })
            resolve({
                status: 'OK',
                message: `${deleteManyUser.deletedCount} users was delete`
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const allUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUsers = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUsers
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const detailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const findUser = await User.findById(id)
            if(!findUser) {
                resolve({
                    status: 'ERROR',
                    message: 'user not found'
                })}
            resolve({
                status: 'OK',
                message: 'success',
                data: findUser
            })
        }
        catch (err) {
            reject(err)
        }
    })
}


module.exports = { createUser, loginUser, updateUser, updateAvatar, deleteUser, deleteManyUser, allUsers, detailUser };
