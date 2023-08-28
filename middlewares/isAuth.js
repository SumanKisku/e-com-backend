const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        return res.status(401).send({
            status: 401,
            message: "Invalid session, please login!",
        })
    }
}

module.exports = isAuth;