// middlewares/card.middleware.js
import List from "../Model/list.model.js";

const cardMiddleware = {
  validateCreateCard: async (req, res, next) => {
    try {
      const { cardName, ownerLists } = req.body;

      // 🧩 1. Kiểm tra tên card
      if (!cardName || cardName.trim() === "") {
        return res.status(400).json({ error: "Card name is required" });
      }

      // 🧩 2. Nếu có ownerLists, kiểm tra xem danh sách đó có hợp lệ không
      if (ownerLists && Array.isArray(ownerLists) && ownerLists.length > 0) {
        const existingLists = await List.find({ _id: { $in: ownerLists } });

        if (existingLists.length !== ownerLists.length) {
          return res
            .status(400)
            .json({ error: "Some ownerLists IDs are invalid" });
        }
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Validation failed: " + err.message });
    }
  },
};

export default cardMiddleware;
