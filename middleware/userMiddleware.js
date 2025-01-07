const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

const userMiddlware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                message: "Authorization header missing or invalid",
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedData = jwt.verify(token, JWT_USER_SECRET);
        if (decodedData) {
            req.userId = decodedData.id;
            next();
        } else {
            res.status(403).json({
                message: "Incorrect credentials."
            })
        }

    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

module.exports = {
    userMiddlware
}