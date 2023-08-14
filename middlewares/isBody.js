const { HttpError } = require('../helpers')

const isBody = () => {
    const func = (req,res,next) => {
        if (Object.keys(req.body).length === 0) {
            next(HttpError(400, "missing fields"));
        }
        next();
    }

    return func;
}

module.exports = isBody;