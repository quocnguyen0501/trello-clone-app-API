import { BoardsModel } from "../models/boards.model";
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
        const result = columnsModel.update(id, updateData);

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const columnService = {
    createNew,
    update
}