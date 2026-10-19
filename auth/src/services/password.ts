import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password{
    static async toHash(password: string){
        const salt = randomBytes(8).toString("hex");
        const buff = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buff.toString("hex")}.${salt}`;
    }

    static async compareHash(storedPassword:string, suppliedPassword: string){
        const [hashedPass, salt] = storedPassword.split(".");

        const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return hashedPass === buff.toString("hex");
    }
}