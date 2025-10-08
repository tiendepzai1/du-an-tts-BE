import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
import UserRouter from './Router/user.router.js';
import cors from "cors";


const app = express();

const allowedOrigins = [
  "https://du-an-tts.vercel.app", // domain frontend thật
  "http://localhost:5173",        // nếu bạn test local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 🔥 cho phép cookie/token
  })
);

// kết nối cơ sở dữ liệu
mongoose.connect(`mongodb+srv://ngaule29_db_user:levantien123@cluster0.b5g0a6x.mongodb.net/db_base333?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (request, response) => {
  return response.send("Hello tien")
})

app.use('/user', UserRouter);


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
