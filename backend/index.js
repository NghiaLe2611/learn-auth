const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

dotenv.config();

const db = require('./config');
// Connect to db
db.connect();

const PORT = 8000;
const app = express();

const corsConfig = {
    origin: true,
    credentials: true,
  };
  
// app.use(cors(corsConfig));
// app.options('*', cors(corsConfig));

// app.use(cors());
app.use(cors(corsConfig));

app.use(cookieParser()); // Tạo & gắn cookie
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// Routes
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);

app.listen(PORT, () => console.log(`App is running on port ${PORT}!`));

// JWT