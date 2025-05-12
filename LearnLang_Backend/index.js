import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes.js'

const app = express();

app.use(cors(
    { origin: ['http://localhost:8091', '*'],
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true }
));
app.use(cookieParser());
app.use(express.json());
app.use(routes)

const port = process.env.PORT || 5000; // Set a default port if not provided
app.listen(port, () => {
    console.log('Server is running on ' + port);
});