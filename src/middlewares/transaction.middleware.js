const base64 = require("base-64");

// const PAYME_MERCHANT_KEY = "1@JygF48YF3BzGnsNxKZnC2h7e3uwJbj#?Tk";
const PAYME_MERCHANT_KEY = process.env.PAYME_MERCHANT_KEY
// "BAms2Tr?jA4eSWOCvprIeuWwEF2aZjpPWy4b";

exports.paymeCheckToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.json({
                error: {
                    code: -32504,
                    message: "Avtorizatsiya yaroqsiz"
                }
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.json({
                error: {
                    code: -32504,
                    message: "Token yo'q"
                }
            });
        }

        const decodedToken = base64.decode(token);
        if (!decodedToken.includes(PAYME_MERCHANT_KEY)) {
            return res.json({
                error: {
                    code: -32504,
                    message: "Avtorizatsiya yaroqsiz"
                }
            });
        }

        next();
    } catch (err) {
        console.error("Tokenni tekshirishda xato:", err);
        return res.status(500).json({
            error: {
                code: -32503,
                message: "Server xatosi"
            }
        });
    }
};
