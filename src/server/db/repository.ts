import * as mongoose from 'mongoose';

// Explanation: Create a record on an IModel, receive a IModelRes/IModelResPromise (res = Response)
export type IModelRes<TRecord> = mongoose.Document & TRecord;
export type IModel<TRecord> = mongoose.Model<IModelRes<TRecord>>
export type IModelResPromise<TRecord> = Promise<IModelRes<TRecord>>;

export interface IRepository<TRecord> {
    create(record: TRecord): IModelResPromise<TRecord>;
    destroy(id: string): IModelResPromise<TRecord>;
    get(id: string): IModelResPromise<TRecord>;
    list(): IModelResPromise<TRecord[]>;
}

export const NO_DATA_ERROR = "No data returned from database.";

export abstract class Repository<TRecord> implements IRepository<TRecord> {
    protected model: IModel<TRecord>;

    constructor(model: IModel<TRecord>) {
        this.model = null;
    }

    create(record: TRecord): IModelResPromise<TRecord> {
        return new Promise<IModelRes<TRecord>>(function(resolve, reject) {
            this.model.create(record).then(
                this.rejectPromiseOnNoData(resolve, reject)
            );
        });
    }

    destroy(id: string): IModelResPromise<TRecord> {
        return new Promise<IModelRes<TRecord>>(function(resolve, reject) {
            this.model.remove(id).then(
                this.rejectPromiseOnNoData(resolve, reject)
            );
        });
    }

    get(id: string): IModelResPromise<TRecord> {
        return new Promise<IModelRes<TRecord>>(function(resolve, reject) {
            this.model.findById(id).then(
                this.rejectPromiseOnNoData(resolve, reject)
            );
        });
    }

    list(): IModelResPromise<TRecord[]> {
        return new Promise<IModelRes<TRecord[]>>(function(resolve, reject) {
            this.model.find({}).then(
                this.rejectPromiseOnNoData(resolve, reject)
            );
        });
    }

    rejectPromiseOnNoData<T>(resolve: (T) => void, reject: (Error) => void): (data: T) => void {
        return (data) => {
            if (!data) {
                reject(new Error(NO_DATA_ERROR));
            }
            else {
                resolve(data);
            }
        };
    }

    update(id: string, record: TRecord): IModelResPromise<TRecord> {
        return new Promise<IModelRes<TRecord>>(function(resolve, reject) {
            this.model.findByIdAndUpdate(id, record, {new: true}).then(
                this.rejectPromiseOnNoData(resolve, reject)
            );
        });
    }
}