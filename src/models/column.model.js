import Joi from 'joi'
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/mongdb';

const columnCollectionName = 'columns'

const columnCollectionSchema = Joi.object({
    boardId: Joi.string().required(),
    title: Joi.string().required().min(1).max(50).trim(),
    cardOrder: Joi.array().items(Joi.string()).default([]),
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
    return await columnCollectionSchema.validateAsync(data, options);
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data);
        const result = await getDatabase().collection(columnCollectionName).insertOne(value);

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const findById = async (id) => {
    try {
        const result = await getDatabase().collection(columnCollectionName).findOne({ _id: ObjectId(id) });

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const update = async (id, data) => {
    try {
        const result = await getDatabase().collection(columnCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        );

        return result.value;
    } catch (error) {
        throw new Error(error);
    }
}

export const columnsModel = {
    createNew,
    findById,
    update
}