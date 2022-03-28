import { boardService } from "../services/board.service"
import {HttpStatusCode} from "*/utilities/constants"

const createNew = async (req, res) => {
    /**
     * req.body:
        Chứa các cặp key-value của dữ liệu được đệ trình trong phần body của Request.
        Theo mặc định, nó là undefined, và được sinh khi bạn sử dụng một Middleware để parse phần body của request (ví dụ body-parser)
     */
    try {
        const result = await boardService.createNew(req.body);
        console.log(result);
        res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const boardController = {
    createNew
}