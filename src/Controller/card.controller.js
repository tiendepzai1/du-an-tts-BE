// controllers/card.controller.js
import CardService from "../services/card.service.js";

const CardController = {
  // 🟢 Tạo mới Card
  createCard: async (req, res) => {
    try {
      const card = await CardService.createCard(req.body);
      res.status(201).json({
        message: "Tạo card thành công",
        data: card,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🔵 Lấy tất cả Card
  getAllCards: async (req, res) => {
    try {
      const cards = await CardService.getAllCards();
      res.status(200).json({
        count: cards.length,
        data: cards,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🟣 Lấy card theo ID
  getCardById: async (req, res) => {
    try {
      const card = await CardService.getCardById(req.params.id);
      if (!card)
        return res.status(404).json({ message: "Không tìm thấy card" });
      res.status(200).json(card);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🟠 Cập nhật card
  updateCard: async (req, res) => {
    try {
      const updatedCard = await CardService.updateCard(req.params.id, req.body);
      if (!updatedCard)
        return res.status(404).json({ message: "Không tìm thấy card" });

      res.status(200).json({
        message: "Cập nhật card thành công",
        data: updatedCard,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🔴 Xóa card
  deleteCard: async (req, res) => {
    try {
      const deletedCard = await CardService.deleteCard(req.params.id);
      if (!deletedCard)
        return res.status(404).json({ message: "Không tìm thấy card" });

      res.status(200).json({ message: "Đã xóa card thành công" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default CardController;
