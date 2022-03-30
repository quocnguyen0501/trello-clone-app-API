import { HttpStatusCode } from '*/utilities/constants'
import { columnService } from '../services/column.service'

const createNew = async (req, res) => {
    try {
        const result = await columnService.createNew(req.body);
        res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await columnService.update(id, req.body);

        res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const columnController = {
    createNew,
    update
}