export const validateList = (req, res, next) => {
    const { listName, ownerBroad } = req.body;

    if (!listName || !ownerBroad) {
        return res.status(400).json({
            success: false,
            message: "listName and ownerBroad are required"
        });
    }

    // Validate listName is not empty
    if (listName.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "listName cannot be empty"
        });
    }

    next();
};
