import { BoardsModel } from "../models/boards.model";
import { cloneDeep } from "lodash";

const createNew = async (data) => {
    try {
        const createdBoard = await BoardsModel.createNew(data);
        const newBoard = await BoardsModel.findById(createdBoard.insertedId.toString());

        return newBoard;
    } catch (error) {
        throw new Error(error);
    }
}

const getFullBoard = async (id) => {
    try {
        const board = await BoardsModel.getFullBoard(id);

        // Nếu client truyền id board ko đúng thì sẽ throw error
        if (!board || !board.columns) {
            throw new Error('Board not found');
        }

        const transformBoard = cloneDeep(board);
        // Filter deleted columns
        transformBoard.columns = transformBoard.columns.filter((column) => {
            return !column._destroy;
        })

        // Add card to each column
        transformBoard.columns.forEach(column => {
            column.cards = transformBoard.cards.filter((col) => {
                return col.columnId.toString() === column._id.toString();
            })
        });

        // Sort cols by ColumnOrder, sort Cards by CardOrder -> will pass to CLIENT sort

        // remove cards data from boards
        delete transformBoard.cards;

        return transformBoard;
    } catch (error) {
        throw new Error(error);
    }
}

export const boardService = {
    createNew,
    getFullBoard
}