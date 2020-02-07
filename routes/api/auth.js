const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
// @route   GET api/auth
// @desc    Test route
// @access  Private
//=========================================================
// NOTE: the second parameter of get 'auth' is actually
// invocation to wrap request with middleware auth check
// get will only execute if person is authenticated.
//=========================================================
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public (no authentication necessary)
router.post(
    '/',
    [
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // get the values passed in the body
        const { email, password } = req.body;
        try {
            // check if user (email) exists... and get user values from mongodb
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials' }] });
            }
            // usee bcrypt compare to check text password with encrypted password
            // password is from body (text), user.password is from database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            //now get a jsonwebtoken
            //create payload to get token with
            const payload = {
                user: {
                    id: user.id
                }
            };
            //when ready to deploy, change token expire to 3600
            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);
module.exports = router;
