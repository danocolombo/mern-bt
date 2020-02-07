const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email address').isEmail(),
        check(
            'password',
            'Please provide a password with 5 letters or more.'
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // get the values
        const { name, email, password } = req.body;
        try {
            // check if user (email) exists...
            let user = await User.findOne({ email });
            if (user) {
                // exists, return error
                return res.status(400).json({
                    errors: [{ msg: 'User already exists' }]
                });
            }
            //user is new, get avatar from email
            // s = size, r = rating, d = default value if now found
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            //now create a user
            user = new User({
                name,
                email,
                avatar,
                password
            });
            //encrypt password
            //get salt to use in encryption
            const salt = await bcrypt.genSalt(10);

            //hash passed in password with salt
            user.password = await bcrypt.hash(password, salt);

            //now save to database
            await user.save();

            //now get a jsonwebtoken
            //create payload to get token with
            //after registering user.id is returned from mongodb
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
