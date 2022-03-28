import Joi from 'joi'


const cardCollectionName = 'cards'

const cardCollectionSchema = {
    boardId: Joi.string().required(),
    columnId: Joi.string().required(),
    title: Joi.string().required().min(1),
    cover: Joi.string().default(''),
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
    return await cardCollectionSchema.validateAsync(data, options);
}

const createNew = async(data) => {
    try {
        const value = await validateSchema(data);
        const result = await getDatabase().collection(cardCollectionName).insertOne(value);

        return result;
    } catch (error) {
        console.log(error);
    }
}

export const ColumnsModel = {
    createNew
}