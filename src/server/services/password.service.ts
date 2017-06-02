import * as bcrypt from 'bcrypt';
import {IUser} from '../models/user.model';
const SALT_ROUNDS = 12;

export function hashPassword<T>(user: T & IUser): Promise<T & IUser> {
    return new Promise((resolve) => {
        bcrypt.hash(user.password, SALT_ROUNDS)
            .then((hash) => {
                user.password = hash;
                resolve(user);
            });
    });
}

export type verifyPasswordCallback = (err: Error, isMatch?: boolean) => void;

export function verifyPassword(user: IUser, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err: Error, isMatch: boolean) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(isMatch);
            }
        });
    });
}
