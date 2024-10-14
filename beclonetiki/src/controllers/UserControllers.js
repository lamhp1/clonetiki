const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const { getMaxListeners } = require('../models/UserModel');


const createUser = async (req, res) => {
    try {
        const { name, email, password, passwordConfirm, phone } = req.body
        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const isEmail = filter.test(email)
        if(!name || !email || !password || !passwordConfirm || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'input is required'
            })
        } else if(!isEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'email is invalid'
            })
        } else if(password !== passwordConfirm) {
            return res.status(200).json({
                status: 'ERR',
                message: 'passwordConfirm is incorrect'
            })
        }
        
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const isEmail = filter.test(email)
        if(!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'input is required'
            })
        } else if(!isEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'email is invalid'
            })
        }
        const response = await UserService.loginUser(req.body);
        const { refreshToken, ...rest } = response
        res.cookie('refresh_token', refreshToken, {
            maxAge: 365*24*60*60,
            httpOnly: true,
        })
        return res.status(200).json(rest)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const updateUser = async (req, res) => {
    try {
        const idUser = req.params.id
        const data = req.body
        if(!idUser) {
            return res.status(404).json({
                status: 'error', 
                message: 'idUser is required'});
        }
        const response = await UserService.updateUser(idUser, data);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const updateAvatar = async (req, res) => {
    try {
        const idUser = req.params.id
        const avatar = req.file.path
        const result = req.file
        if(!idUser) {
            return res.status(404).json({
                status: 'error', 
                message: 'idUser is required'});
        }
        const response = await UserService.updateAvatar(idUser, avatar, result);
        return res.status(200).json(response)
    }
    catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteUser = async (req, res) => {
    try {
        const idUser = req.params.id
        if(!idUser) {
            return res.status(404).json({
                status: 'error', 
                message: 'idUser is required'});
        }
        const response = await UserService.deleteUser(idUser);
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteManyUser = async (req, res) => {
    try {
        const { ids } = req.body
        if(!Array.isArray(ids) || ids.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ids not is a array'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch(err) {
        return res.status(404).json({message: err});
    }
}

const allUsers = async (req, res) => {
    try {
        const response = await UserService.allUsers();
        return res.status(200).json(response)
    }
    catch (err) {
        return res.status(404).json({message: err});
    }
}

const detailUser = async (req, res) => {
    try {
        const idUser = req.params.id
        if(!idUser) {
            return res.status(404).json({message: 'User not found'});
        }
        const response = await UserService.detailUser(idUser)
        return res.status(200).json(response)
    }
    catch (err) {
        return res.status(404).json({message: err});
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if(!token) {
            return res.status(403).json({message:'Token missing'});
        }
        const response = await JwtService.refreshToken(token)
        return res.status(200).json(response)
    }
    catch(err) {
        return res.status(404).json({message: err});
    }
}

const signoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: 'OK',
            message: 'successfully'
        })
    } catch (err) {
        return res.status(404).json({message: err});
    }
}


module.exports = { createUser, loginUser, updateUser, updateAvatar, deleteUser, deleteManyUser, allUsers, detailUser, refreshToken, signoutUser };