const router = require('express').Router()
let User = require('../models/user.model')
let UserSession = require('../models/userSession.model')

router.route('/signup').post((req, res) => {
    const { body } = req
    let {
        username,
        password
    } = body

    if (!username) {
        return res.send({
            success: false,
            message: 'Error: username cannot be blank.'
        })
    }

    if (!password) {
        return res.send({
            success: false,
            message: 'Error: password cannot be blank.'
        })
    }

    username = username.toLowerCase()

    //Find users with the same username
    User.find({
        username: username
    })
        .then(previusUsers => {
            if (previusUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exists.'
                })
            }
            //Save new user
            const newUser = new User()
            newUser.username = username
            newUser.password = newUser.generateHash(password)
            newUser.save()
                .then(() => res.json('User added!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/signin').post((req, res) => {
    const { body } = req
    let {
        username,
        password
    } = body

    if (!username) {
        return res.send({
            success: false,
            message: 'Error: username cannot be blank.'
        })
    }

    if (!password) {
        return res.send({
            success: false,
            message: 'Error: password cannot be blank.'
        })
    }

    username = username.toLowerCase()

    User.find({
        username: username
    })
        .then((users) => {
            //invalid credentials
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid username.'
                })
            }

            const user = users[0]
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid password.'
                })
            }

            //valid credentials
            UserSession.find({
                userId: user._id,
                isDeleted: false
            })
                .then((sessions) => {
                    if (sessions.length > 1) {
                        return res.send({
                            success: false,
                            message: 'Error: Invalid Session.'
                        })
                    } else if (sessions.length == 1) {
                        return res.send({
                            success: true,
                            message: 'Valid sign in.',
                            token: sessions[0]._id
                        })
                    } else {
                        const userSession = new UserSession()
                        userSession.userId = user._id
                        userSession.save()
                            .then((doc) => {
                                return res.send({
                                    success: true,
                                    message: 'Valid sign in.',
                                    token: doc._id
                                })
                            })
                            .catch(err => res.status(400).json('Error: ' + err))
                    }
                })
                .catch(err => res.status(400).json('Error: ' + err))

        })
        .catch(err => res.status(400).json('Error: ' + err))

})

router.route('/verify').get((req, res) => {
    const { query } = req
    const { token } = query

    UserSession.find({
        _id: token,
        isDeleted: false
    })
        .then((sessions) => {
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Token.'
                })
            }

            return res.send({
                success: true,
                message: 'Token is good.'
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/logout').get((req, res) => {
    const { query } = req
    const { token } = query

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
            $set: {
                isDeleted: true
            },
        })
        .then(() => {
            return res.send({
                success: true,
                message: 'Session closed.'
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router