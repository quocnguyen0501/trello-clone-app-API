import { cardModel } from "../models/card.model"
import { columnsModel } from "../models/column.model";

const createNew = async (data) => {
    try {
        const createdCard = await cardModel.createNew(data);
        const newCard = await cardModel.findById(createdCard.insertedId.toString());

        /**
         * Convert ObjectId to String
         * @param {string} columnId
         * @param {string} cardId
        */
        const columnId = newCard.columnId.toString();
        const cardId = newCard._id.toString();

        await columnsModel.pushCardOrder(columnId, cardId);

        return newCard;
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updatedAt: Date.now()
        }

        if (updateData._id) {
            delete updateData._id;
        }

        const updatedCard = await cardModel.update(id, updateData);

        return updatedCard;
    } catch (error) {
        throw new Error(error);
    }
}

export const cardService = {
    createNew,
    update
}