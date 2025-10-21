import express from "express";
import CardController from "../Controller/card.controller.js";
import cardMiddleware from "../middleware/card.middleware.js";

const router = express.Router();

router.post("/create", cardMiddleware.validateCreateCard, CardController.createCard);
router.get("/list", CardController.getAllCards);
router.get("/list/:id", CardController.getCardById);
router.put("/update/:id", CardController.updateCard);
router.delete("/delete/:id", CardController.deleteCard);

export default router;