import jwt, { JwtPayload } from 'jsonwebtoken';

export const decodeJwt = (credential: string) => {
    try {
        return jwt.decode(credential, { complete: true })?.payload as JwtPayload
    } catch (error) {
        return null;
    }
};