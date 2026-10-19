import express, {Request, Response} from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@pint_mushy/common";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/api/users/signin",[
    body("email")
        .isEmail()
        .withMessage("Email must be valid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password")],
    validateRequest,
    async (req:Request, res:Response) => {
        const {email, password} = req.body;

        const exitsingUser = await User.findOne({email});
        if(!exitsingUser){
            throw new BadRequestError("Invalid credentials provided");
        };

        const passMatch = await Password.compareHash(exitsingUser.password, password);
        
        if(!passMatch){
            throw new BadRequestError("Invalid credentials provided");
        };

        const userJwt = jwt.sign({
            id: exitsingUser.id,
            email: exitsingUser.email
        }, process.env.JWT_KEY! );

        req.session = {jwt: userJwt};

        res.status(200).send(exitsingUser);
    }
);

export {router as signInRouter};