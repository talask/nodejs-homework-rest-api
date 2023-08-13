const { HttpError } = require('../helpers')

const isBody = () => {
    const func = (req,res,next) => {
        console.log(req.body)
        if (!req.body) {
            next(HttpError(400, "missing fields"));
          }
        next();
    }

    return func;
}

module.exports = isBody;