const { HttpError } = require('../helpers')

const validateBody = schema => {
    const func = (req,res,next) => {
        const { error } = schema.validate(req.body);
        if(error) {

            const fieldName = error.details[0].context.key;
        
            next(HttpError(400, `missing required ${fieldName}, ${error.message}`))

        }
        next();
    }

    return func;
}

module.exports = validateBody;