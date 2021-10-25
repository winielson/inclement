const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Validation
        // Validate: check if header contains an authentication token
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).json({msg: "No authentication token, access denied."});
        }

        // Validate: check if jwt is verified
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if(!verified) {
            return res.status(401).json({msg: "Token verification failed, authorization denied."});
        }
        
        req.user = verified._id;

        next();       
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = auth;