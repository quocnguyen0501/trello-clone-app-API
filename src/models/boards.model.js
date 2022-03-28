import Joi from "joi";
import { getDatabase } from "../config/mongdb";

// Define boards colections
const boardCollectionName = 'boards';

const boardCollectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(20),
    columnOrder: Joi.array().items(Joi.string()).default([]),
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
    return await boardCollectionSchema.validateAsync(data, options);
}

const createNew = async(data) => {
    try {
        const value = await validateSchema(data);
        const result = await getDatabase().collection(boardCollectionName).insertOne(value);

        return result;
    } catch (error) {
        console.log(error);
    }
}

export const BoardsModel = {
    createNew
}