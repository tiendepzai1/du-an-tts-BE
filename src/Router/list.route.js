import express from "express";
import ListController from "../Controller/list.controller.js";
import { validateList } from "../middleware/list.middleware.js";

const router = express.Router();

router.post("/create", validateList, ListController.createList);
router.get("/list", ListController.getAllLists);
router.get("/list/:id", ListController.getListById);
router.put("/update/:id", validateList, ListController.updateList);
router.delete("/delete/:id", ListController.deleteList);

export default router;
