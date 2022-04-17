import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

const books = [
    {
        id: 1, name: 'abc'
    },
    {
        id: 2, name: 'def'
    }
];

let refreshTokens = [];

function auth(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];

    if (!token) {
        res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log(err, data);
        if (err) res.sendStatus(403);
        next();
    });
};

app.post('/refreshToken', (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) res.sendStatus(401); // Unauthorized
    if (!refreshTokens.includes(refreshToken)) res.sendStatus(403); // Forbidden
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) res.sendStatus(403);
        const accessToken = jwt.sign({
            username: data.username
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30s'
        });

        res.json({ accessToken });
    });

});

app.post('/login', (req, res) => {
    const data = req.body;
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
    });

    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json( {accessToken, refreshTokens });
});

app.post('/logout', (req, res) => {
    const refreshToken= req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(200);
})

app.get('/books', auth, (req, res) => {
    res.json({
        success: true,
        data: books
    });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}!`));
