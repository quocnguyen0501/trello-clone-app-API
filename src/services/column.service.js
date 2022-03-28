import { columnsModel } from "../models/column.model"

const createNew = async (data) => {
    try {
        const createdColumn = await columnsModel.createNew(data);
        const newColumn = await columnsModel.findById(createdColumn.insertedId.toString());
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