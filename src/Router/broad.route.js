import express from 'express'
import { BroadCreate, DeleteBroad, ListBroad, UpdateBroad , GetByIdBroad} from '../Controller/broad.controller.js';


const router =  express.Router();

router.post("/create",BroadCreate);
router.get("/list",ListBroad);
router.get("/detail/:id",GetByIdBroad);
router.delete("/delete/:id",DeleteBroad)
router.put("/update/:id",UpdateBroad)

export default router;
