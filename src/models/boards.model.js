import Joi from "joi";
import { ObjectId } from "mongodb";
import { getDatabase } from "../config/mongdb";
import { cardModel } from "./card.model";
import { columnsModel } from "./column.model";

// Define boards colections
const boardCollectionName = 'boards';

const boardCollectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(20).trim(),
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

const createNew = async (data) => {
    try {
        const value = await validateSchema(data);
        const result = await getDatabase().collection(boardCollectionName).insertOne(value);

        return result;
    } catch (error) {
        throw new Error(error)
    }
}
const findById = async (id) => {
    try {
        const result = await getDatabase().collection(boardCollectionName).findOne({ _id: ObjectId(id) });

        return result;
    } catch (error) {
        throw new Error(error)
    }
}

/**
 *
 * @param {string} boardId
 * @param {string} columnId
 */
const pushColumnOrder = async (boardId, columnId) => {
    try {
        const result = await getDatabase().collection(boardCollectionName).findOneAndUpdate(
            { _id: ObjectId(boardId) },
            { $push: { columnOrder: columnId } },
            { returnDocument: 'after' }
        );

        return result.value;
    } catch (error) {
        throw new Error(error);
    }
}

const getFullBoard = async (id) => {
    try {
        const result = await getDatabase().collection(boardCollectionName).aggregate([
            {
                $match: {
                    _id: ObjectId(id) //Tìm bản ghi của board khớp với id
                }
            },
            {
                $lookup: {
                    from: columnsModel.columnCollectionName, //collections name
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'columns' //add thêm field trong ouput data
                }
            },
            {
                $lookup: {
                    from: cardModel.cardCollectionName, //collections name
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'cards' //add thêm field trong ouput data
                }
            }
        ]).toArray();

        return result[0] || {};
    } catch (error) {
        throw new Error(error)
    }
}

export const BoardsModel = {
    createNew,
    findById,
    getFullBoard,
    pushColumnOrder
}