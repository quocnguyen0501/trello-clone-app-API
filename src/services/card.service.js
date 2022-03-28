import { cardModel } from "../models/card.model"

const createNew = async (data) => {
    try {
        const createdCard = await cardModel.createNew(data);
        const newCard = await cardModel.findById(createdCard.insertedId.toString());

        return newCard;
    } catch (error) {
        throw new Error(error)
    }
}

export const cardService = {
    createNew
}