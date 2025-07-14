export const errorHandler = (err, req, res, next) => {
    res.setHeader('X-Powered-By', 'Express')
        .status(500)
        .send('Something failed.')
}