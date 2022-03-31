import Joi from "joi";
import { cloneDeep } from "lodash";
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
                    //Tìm bản ghi của board khớp với id va _destroy: false
                    _id: ObjectId(id),
                    _destroy: false
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

/**
 *
 * @param {ObjectId} id : Id of Board
 * @param {Object} data { columnOrder }
 * @returns result.value
 */
const update = async (id, data) => {
    try {
        /**
         * get full board (columnOrder have an column have state destroy: true)
         */
        const allBoard = await findById(id);
        // the data server receive have a type of boardId is string but the DB store ObjectId -> set again boardId
        const updateData = cloneDeep(data);

        const tempBoard = cloneDeep(allBoard);
        let columnOrderTemp = tempBoard.columnOrder;

        // slice mising element because data receive don't have column have state destroy :true
        const cloneColumnOrderTemp = cloneDeep(columnOrderTemp);
        columnOrderTemp = cloneColumnOrderTemp.slice(updateData.columnOrder.length, cloneColumnOrderTemp.length);

        let cloneUpdateDataColumnOrder = cloneDeep(updateData.columnOrder);
        // merge a new columnOrder and array column have state of _destroy:true
        const finalNewColumnOrder = cloneUpdateDataColumnOrder.concat(columnOrderTemp);

        const finalUpdateData = {
            ...updateData,
            columnOrder: finalNewColumnOrder
        }

        const result = await getDatabase().collection(boardCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: finalUpdateData },
            { returnDocument: 'after' }
        );

        return result.value;
    } catch (error) {
        throw new Error(error);
    }
}

export const BoardsModel = {
    createNew,
    findById,
    getFullBoard,
    pushColumnOrder,
    update
}