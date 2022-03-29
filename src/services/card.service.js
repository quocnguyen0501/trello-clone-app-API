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

export const cardService = {
    createNew
}