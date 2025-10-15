import CardService from "../services/card.service.js";

const CardController = {
    createCard: async (req, res) => {
        try {
            const card = await CardService.createCard(req.body);
            res.status(201).json(card);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllCards: async (req, res) => {
        try {
            const cards = await CardService.getAllCards();
            res.status(200).json(cards);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getCardById: async (req, res) => {
        try {
            const card = await CardService.getCardById(req.params.id);
            if (!card) return res.status(404).json({ message: "Card not found" });
            res.status(200).json(card);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateCard: async (req, res) => {
        try {
            const updatedCard = await CardService.updateCard(req.params.id, req.body);
            res.status(200).json(updatedCard);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteCard: async (req, res) => {
        try {
            await CardService.deleteCard(req.params.id);
            res.status(200).json({ message: "xóa tk" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default CardController;
