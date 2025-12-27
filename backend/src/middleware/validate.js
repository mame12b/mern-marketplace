import { errorResponse } from "../middleware/error.middleware.js";

export const validate = schema => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return errorResponse(res, 400, error.details[0].message);
    }
    next();
};