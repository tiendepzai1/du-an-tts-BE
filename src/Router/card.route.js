import express from "express";
import CardController from "../Controller/card.controller.js";
import cardMiddleware from "../middleware/card.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, cardMiddleware.validateCreateCard, CardController.createCard);
router.get("/list", CardController.getAllCards);
router.get("/:id", CardController.getCardById);
router.put("/:id", verifyToken, CardController.updateCard);
router.delete("/:id", verifyToken, CardController.deleteCard);

export default router;