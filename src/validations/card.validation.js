import Joi from 'joi';
import { HttpStatusCode } from '*/utilities/constants';

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        boardId: Joi.string().required(),
        columnId: Joi.string().required(),
        title: Joi.string().required().min(1),
        cover: Joi.string().default('')
    })

    try {
        await condition.validateAsync(req.body, {
            abortEarly: false
        });

        next();
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: new Error(error).message
        })
    }
}

export const cardValidation = {
    createNew
}