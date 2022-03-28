import Joi, { string } from 'joi'

const columnCollectionName = 'columns'

const columnCollectionSchema = {
    boardId: Joi.string().required(),
    title: Joi.string.required().min(1).max(50),
    cardOrder: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
}

const validateSchema = async (data) => {
    let options = {
        // Gia su chung ta co 2 truong trong schema loi neu: 
        // true -> tra ve loi dau tien
        // false -> tra ve tat ca
        abortEarly: false
    }
    return await columnCollectionSchema.validateAsync(data, options);
}

const createNew = async(data) => {
    try {
        const value = await validateSchema(data);
        const result = await getDatabase().collection(columnCollectionName).insertOne(value);

        return result;
    } catch (error) {
        console.log(error);
    }
}

export const ColumnsModel = {
    createNew
}