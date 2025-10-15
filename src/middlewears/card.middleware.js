const cardMiddleware = {
    validateCreateCard: (req, res, next) => {
        const { cardName } = req.body;
        if (!cardName || cardName.trim() === "") {
            return res.status(400).json({ error: "Card name is required" });
        }
        next();
    }
};

export default cardMiddleware;
