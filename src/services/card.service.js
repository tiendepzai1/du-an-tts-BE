// services/card.service.js
import Card from "../Model/card.model.js";
import List from "../Model/list.model.js";

const CardService = {
  createCard: async (cardData) => {
    const card = new Card(cardData);
    const savedCard = await card.save();

    // 🔁 Nếu có ownerLists, cập nhật ngược lại các List
 if (cardData.ownerLists && cardData.ownerLists.length > 0) {
  await List.updateMany(
    { _id: { $in: cardData.ownerLists } },
    { $addToSet: { ownerCard: savedCard._id } } // ✅ đúng với schema
  );
}


    return savedCard;
  },

  getAllCards: async () => {
    return await Card.find()
      .populate("ownerLists")
      .populate("memberUser");
  },

  getCardById: async (id) => {
    return await Card.findById(id)
      .populate("ownerLists")
      .populate("memberUser");
  },

  updateCard: async (id, updatedData) => {
    return await Card.findByIdAndUpdate(id, updatedData, { new: true });
  },

  deleteCard: async (id) => {
    const deletedCard = await Card.findByIdAndDelete(id);
    if (deletedCard) {
      // Xóa reference trong List
      await List.updateMany(
        { ownerCards: id },
        { $pull: { ownerCards: id } }
      );
    }
    return deletedCard;
  },
};

export default CardService;
