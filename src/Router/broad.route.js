import express from 'express'
import { BroadCreate, DeleteBroad, ListBroad, UpdateBroad } from '../Controller/broad.controller.js';


const router =  express.Router();

router.post("/create",BroadCreate);
router.get("/list",ListBroad);
router.get("/list/:id",ListBroad);
router.delete("/delete/:id",DeleteBroad)
router.put("/update",UpdateBroad)

export default router;
