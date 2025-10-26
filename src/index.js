import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
import UserRouter from './Router/user.router.js';

import cors from "cors";
import routerBroad from './Router/broad.route.js';
import routerList from "./Router/list.route.js"
import cardRoutes from "./Router/card.route.js";
import routerComment from "./Router/comment.router.js"


const app = express();





app.use(
  cors()
);


// kết nối cơ sở dữ liệu
mongoose.connect(`mongodb+srv://ngaule29_db_user:levantien123@cluster0.b5g0a6x.mongodb.net/db_base333?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format. Please check your request body.'
    });
  }
  next(err);
});

app.get('/', (request, response) => {
  return response.send("Hello tien")
})

app.use('/user', UserRouter);
app.use('/broad', routerBroad);
app.use('/list', routerList);
app.use("/card", cardRoutes);
app.use("/comment",routerComment)


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
