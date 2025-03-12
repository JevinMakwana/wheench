import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config";

interface AuthRequest extends Request {
    userId?: string;
}

const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(400).json({
                message: "Authorization header missing or invalid",
            });
            return; // Ensure function exits
        }

        const token = authHeader.split(" ")[1];
        const decodedData = jwt.verify(token, JWT_USER_SECRET) as { id: string };

        if (decodedData) {
            req.userId = decodedData.id;
            next(); // ✅ Ensure next() is called
        } else {
            res.status(401).json({
                statusText: "fail",
                message: "Unauthorized",
            });
            return; // Ensure function exits
        }
    } catch (error) {
        console.error("Error in userMiddleware:", error);
        res.status(500).json({ message: "Invalid token", error });
        return; // Ensure function exits
    }
};

export { userMiddleware, AuthRequest };


// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { JWT_USER_SECRET } from "../config";

// interface AuthRequest extends Request {
//     userId?: string;
// }

// const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(400).json({
//                 message: "Authorization header missing or invalid",
//             });
//         }

//         const token = authHeader.split(" ")[1];
//         const decodedData = jwt.verify(token, JWT_USER_SECRET) as { id: string };

//         if (decodedData) {
//             req.userId = decodedData.id;
//             next();
//         } else {
//             return res.status(401).json({
//                 statusText: "fail",
//                 message: "Unauthorized"
//             });
//         }
//     } catch (error) {
//         console.error("Error in userMiddleware:", error);
//         return res.status(500).json({ message: "Invalid token", error });
//     }
// };

// export { userMiddleware, AuthRequest };