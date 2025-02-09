const { z, string } = require("zod");

const zodCheck = async (data) => {
    const obj = {};
    if (data.email) obj.email = string().min(3).max(100).email();
    if (data.phone) obj.phone = z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits");
    if (data.full_name) obj.full_name = z.string().min(3).max(100);
    if (data.password) obj.password = z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100)
        .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "Password must contain at least one lowercase letter")
        .refine((val) => /[0-9]/.test(val), "Password must contain at least one number")
        .refine((val) => /[!@#$%^&*(),.?\":{}|<>]/.test(val), "Password must contain at least one special character");
    if (data.username) {
        obj.username = z.string()
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username must not exceed 30 characters")
            .regex(/^[a-z0-9._]+$/, "Username can only contain lowercase letters, numbers, underscores, and dots");
    }
    if (data.gender) {
        obj.gender = z.enum(["male", "female", "other"], {
            message: "Gender must be either 'male', 'female', or 'other'",
        });
    }

    const zodRes = z.object(obj);
    return zodRes.safeParse(data);
}

module.exports = {
    zodCheck
}