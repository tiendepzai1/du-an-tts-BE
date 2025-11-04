// Middleware xác thực yêu cầu cho board
export const validateBoard = (req, res, next) => {
    const { broadName, boardName } = req.body;

    // Kiểm tra tên board (hỗ trợ cả broadName cũ và boardName mới)
    const title = boardName ?? broadName;
    if (!title || !String(title).trim()) {
        return res.status(400).json({
            error: 'Tên board không được để trống'
        });
    }

    // Kiểm tra các trường khác nếu có
    const allowedFields = ['broadName', 'boardName', 'description', 'settings', 'labels', 'background'];
    const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: `Các trường không hợp lệ: ${invalidFields.join(', ')}`
        });
    }

    next();
};

export const validateMemberRole = (req, res, next) => {
    try {
        const { email, role } = req.body;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Email của thành viên là bắt buộc' });
        }
        if (role && !['admin', 'member', 'observer'].includes(role)) {
            return res.status(400).json({ error: 'Role không hợp lệ' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Lỗi xác thực quyền thành viên: ' + err.message });
    }
};

export const validateLabels = (req, res, next) => {
    try {
        const { labels } = req.body;
        if (!Array.isArray(labels)) return res.status(400).json({ error: 'Labels phải là một mảng' });
        for (const label of labels) {
            if (!label.name || !label.color) return res.status(400).json({ error: 'Mỗi label phải có name và color' });
            if (typeof label.name !== 'string' || typeof label.color !== 'string') return res.status(400).json({ error: 'Name và color của label phải là chuỗi' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Lỗi xác thực labels: ' + err.message });
    }
};