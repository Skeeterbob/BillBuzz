// Authored by Bryan Hodgins
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

//load environment variables from .env
dotenv.config('../.env');

class AuthHandler {
    createToken (id) {
        let data = {
            userId : id,
        }
        return jwt.sign(data, process.env.JWT_SECRET_KEY);
    }

    validateToken (token, id) {
        return (jwt.verify(token, process.env.JWT_SECRET_KEY).userId == id);
    }
};

export {AuthHandler};