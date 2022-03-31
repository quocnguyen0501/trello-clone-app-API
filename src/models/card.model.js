import Joi from 'joi'
import { cloneDeep } from 'lodash';
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

const update = async (id, data) => {
    try {
        // the data server receive have a type of boardId is string but the DB store ObjectId -> set again boardId
        const updateData = cloneDeep(data);

        if (data.boardId) {
            updateData.boardId = ObjectId(data.boardId)
        }
        if (data.columnId) {
            updateData.columnId = ObjectId(data.columnId)
        }

        const result = await getDatabase().collection(cardCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result.value;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 *
 * @param {Array of string card id of column deleted} ids
 */
const deleteAllCardByColumn = async (ids) => {
    try {
        // Convert id type: string -> ObjectId
        const transformIds = ids.map((id) => {
            return ObjectId(id);
        });

        const result = await getDatabase().collection(cardCollectionName).updateMany(
            // Condition filter: Update item have id in ids array
            {
                _id: { $in: transformIds }
            },
            // Update value
            {
                $set: { _destroy: true }
            }
        );

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const cardModel = {
    cardCollectionName,
    createNew,
    findById,
    deleteAllCardByColumn,
    update
}