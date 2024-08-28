const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const register = async (req, res) => {

    try {
        const { email, password, username } = req.body
        
    const usernameCheck = await User.findOne({username})
    if(usernameCheck) {
        return res.json({ msg: 'Username already taken', status: false})

    }
    const emailCheck = await User.findOne({email})
    if(emailCheck) {
        return res.json({ msg:'Already registered email', status: false})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    
    
    const user = await User.create({email,username,password:hashedPassword})
    delete user.password
    
    
    return res.json({status: true, user})
    } catch (error) {
        console.error(error.message);
        
    }

}
const login = async (req, res) => {

    try {
        const { password, username } = req.body
        
    const user = await User.findOne({username})
    if(!user) {
        return res.json({ msg: 'Incorrect Username or Password', status: false})

    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
        return res.json({ msg:'Incorrect Username or Password', status: false})
    }
    
    delete user.password
    
    
    return res.json({status: true, user})
    } catch (error) {
        console.error(error.message);
        
    }

}
const setAvatar = async (req, res) => {
    
    try {
        const id = req.params.userId
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(id, {
            isAvatarSet: true,
            avatarImage
        })
        await userData.save()
        
        res.json({isSet:userData.isAvatarSet, image: userData.avatarImage})

    } catch (error) {
        console.error(error)
        
    }
}
const getAllUsers = async (req, res) => {
   
    
    try {
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])
        
        
        
        return res.json(users)
        

    } catch (error) {
        console.error(error)
    }
}
module.exports = {
    register,
    login,
    setAvatar,
    getAllUsers
}