
export const asyncMiddleware = (handler) => {
    return async (req, res, next) => {
        try {
            await handler();
        } catch (ex) {
            next();
        }
    }
}