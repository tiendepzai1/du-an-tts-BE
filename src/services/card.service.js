import Card from "../Model/card.model.js";

const CardService = {
    createCard: async (cardData) => {
        const card = new Card(cardData);
        return await card.save();
    },

    getAllCards: async () => {
        return await Card.find().populate("ownerList").populate("memberUser");
    },

    getCardById: async (id) => {
        return await Card.findById(id).populate("ownerList").populate("memberUser");
    },

    updateCard: async (id, updatedData) => {
        return await Card.findByIdAndUpdate(id, updatedData, { new: true });
    },

    deleteCard: async (id) => {
        return await Card.findByIdAndDelete(id);
    }
};

export default CardService;
