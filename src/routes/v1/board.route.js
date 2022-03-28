import express from "express";
import { boardController } from "../../controllers/board.controller";
import { boardValidation } from "../../validations/board.validation";

const router = express.Router();

router.route('/')
    // .get((req, res) => {
    //     console.log('GET BOARD');
    // })
    .post(boardValidation.createNew, boardController.createNew)

export const boardRoutes = router;