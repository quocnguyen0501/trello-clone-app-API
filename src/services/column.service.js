import { BoardsModel } from "../models/boards.model";
import { cardModel } from "../models/card.model";
import { columnsModel } from "../models/column.model"

const createNew = async (data) => {
    try {
        const createdColumn = await columnsModel.createNew(data);
        const newColumn = await columnsModel.findById(createdColumn.insertedId.toString());

        // update columnOrder Array in Board Collection

        /**
         * Convert ObjectId to String
         * @param {string} boardId
         * @param {string} columnId
        */
        const boardId = newColumn.boardId.toString();
        const newColumnId = newColumn._id.toString();

        await BoardsModel.pushColumnOrder(boardId, newColumnId);

        return newColumn;
    } catch (error) {
        throw new Error(error);
    }
}

const update = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updatedAt: Date.now()
        }
        // Data send from client have an _id and card but store in DB don't need to save with structure -> check if _id and cards[] exist -> delete
        if (updateData._id) {
            delete updateData._id;
        }

        if (updateData.cards) {
            delete updateData.cards;
        }

        const updatedColumn = await columnsModel.update(id, updateData);

        if (updatedColumn._destroy) {
            // Delete all card in this column
            /**
             * @param {array id of card for change state of method _destroy} updatedColumn.cardOrder
             */
            cardModel.deleteAllCardByColumn(updatedColumn.cardOrder)
        }

        return updatedColumn;
    } catch (error) {
        throw new Error(error);
    }
}

export const columnService = {
    createNew,
    update
}