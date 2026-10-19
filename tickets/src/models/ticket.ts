import mongoose from "mongoose";

type TTicket = {
    title: string;
    price: number;
    userId: string;
}

interface ITicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
    build(atr: TTicket): ITicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            const {_id, title, price} = ret;

            return {id: _id, title, price};
        }
    }
});

ticketSchema.statics.build = (atr: TTicket) => {
    return new Ticket(atr);
}

const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };