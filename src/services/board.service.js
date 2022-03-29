import { BoardsModel } from "../models/boards.model";

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

        // Add card to each column
        board.columns.forEach(column => {
            column.cards = board.cards.filter((col) => {
                return col.columnId.toString() === column._id.toString();
            })
        });

        // Sort cols by ColumnOrder, sort Cards by CardOrder -> will pass to CLIENT sort

        // remove cards data from boards
        delete board.cards;

        return board;
    } catch (error) {
        throw new Error(error);
    }
}

export const boardService = {
    createNew,
    getFullBoard
}