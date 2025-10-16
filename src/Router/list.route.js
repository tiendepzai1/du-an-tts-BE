import express from "express";
import ListController from "../Controller/list.controller.js";
import { validateList } from "../middleware/list.middleware.js";

const router = express.Router();

// CRUD List
router.post("/", validateList, ListController.createList);
router.get("/", ListController.getAllLists);
router.get("/:id", ListController.getListById);
router.put("/:id", validateList, ListController.updateList);
router.delete("/:id", ListController.deleteList);

// Lấy List theo Broad
router.get("/broad/:broadId", ListController.getListsByBroadId);

export default router;
