const jwt = require('jsonwebtoken');

const authMiddleware = {
	verifyToken: (req, res, next) => {
		const token = req.headers.token;
        // const refreshToken = req.cookies.refreshToken;
		if (token) {
			const accessToken = token.split(' ')[1];
			jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
				if (err) {
					res.status(403).json('Token is not valid!');
				}

				req.user = user;
				next();
			});
		} else {
			res.status(401).json("You're not authenticated!");
		}
	},

	verifyTokenAndAdmin: (req, res, next) => {
		authMiddleware.verifyToken(req, res, () => {
			if (req.user.admin) {
				next();
			} else {
				res.status(403).json("You're not allowed to do that!");
			}
		});
	},

	verifyTokenAndUserAuthorization: (req, res, next) => {
		authMiddleware.verifyToken(req, res, () => {
			if (req.user.id === req.params.id || req.user.isAdmin) {
				next();
			} else {
				res.status(403).json("You're not allowed to do that!");
			}
		});
	},
};

module.exports = authMiddleware;