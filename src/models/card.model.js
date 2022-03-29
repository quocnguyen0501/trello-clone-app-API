import Joi from 'joi'
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/mongdb';


const cardCollectionName = 'cards'

const cardCollectionSchema = Joi.object({
    boardId: Joi.string().required(), //also ObjectId when create new
    columnId: Joi.string().required(),
    title: Joi.string().required().min(1),
    cover: Joi.string().default(''),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
});

const validateSchema = async (data) => {
    let options = {
        // Gia su chung ta co 2 truong trong schema loi neu:
        // true -> tra ve loi dau tien
        // false -> tra ve tat ca
        abortEarly: false
    }
    return await cardCollectionSchema.validateAsync(data, options);
}

const createNew = async (data) => {
    try {
        const validatedValue = await validateSchema(data);
        const insertValue = {
            ...validatedValue,
            boardId: ObjectId(validatedValue.boardId),
            columnId: ObjectId(validatedValue.columnId)
        }
        const result = await getDatabase().collection(cardCollectionName).insertOne(insertValue);

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const findById = async (id) => {
    try {
        const result = await getDatabase().collection(cardCollectionName).findOne({ _id: ObjectId(id) });

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const cardModel = {
    cardCollectionName,
    createNew,
    findById
}