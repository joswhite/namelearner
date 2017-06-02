import {IModelResPromise, IRepository, Repository} from '../repository';
import {IUser} from '../../models/user.model';
import UserModel from '../schema/user.schema';

export interface IUserRepository extends IRepository<IUser> {

}

export class UserRepository extends Repository<IUser> implements IUserRepository {
    constructor() {
        super(UserModel);
    }

    create(record: IUser): IModelResPromise<IUser> {
        return null;
    }
}