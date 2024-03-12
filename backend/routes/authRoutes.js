const router = require('express').Router()
const { register } = require('../controllers/authController')
const {login} = require('../controllers/authController.js')
const {body} = require('express-validator')
router.route('/login').post([
    
    body("email").notEmpty().withMessage("This field is required"),
    body("password").notEmpty().withMessage("This field is required")],login)

router.post('/register',


[
    body("name").notEmpty().withMessage("This field is required"),
    body("username").notEmpty().withMessage("This field is required"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
    body("phone").notEmpty().withMessage("This field is required"),
    body("password").isLength({ min: 8 }).withMessage("Password should be atleast 8 characters"),

],register)




module.exports = router