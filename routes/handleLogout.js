const handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send({
                status: 400,
                message: "Logout unsuccessful",
                error: err
            })
        }
    });

    return res.send({
        status: 200,
        message: "Logout successful"
    })
}

module.exports = handleLogout;