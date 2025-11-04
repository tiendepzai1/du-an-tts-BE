import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
    // Access token - short lived (1 hour)
    const accessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET || "your-jwt-secret",
        { expiresIn: '1h' }
    );

    // Refresh token - long lived (7 days)
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret",
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const sanitizeUser = (user) => {
    const { password, refreshTokens, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
};

export const handleAuthError = (error) => {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
        return {
            status: 401,
            message: 'Token không hợp lệ'
        };
    }

    if (error.name === 'TokenExpiredError') {
        return {
            status: 401,
            message: 'Token đã hết hạn'
        };
    }

    return {
        status: 500,
        message: 'Lỗi xác thực',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
};