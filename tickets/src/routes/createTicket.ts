import { requireAuth, validateRequest } from "@pint_mushy/common";
import express, {Request, Response} from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post("/api/tickets",
    [
        body("title")
        .notEmpty()
        .withMessage("Ticket must be provided"),
        body("price")
        .isFloat({ gt: 0})
        .withMessage("price must be valid"),
    ],
    requireAuth,
    validateRequest,
    async (req:Request, res:Response) => {
        const { title, price } = req.body;
        
        const ticket = Ticket.build({
            title, 
            price,
            userId: req.currentUser?.id!
        });

        await ticket.save();

        res.status(201).send(ticket);
    }
)

export { router as createTicketsRouter } ; 