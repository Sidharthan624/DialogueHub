const userController = require('../controllers/userController')
const router = require('express').Router()
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/set-avatar/:userId',userController.setAvatar)
router.get('/all-users/:id',userController.getAllUsers)
module.exports = router