export interface IResponse<T> {
    ErrorCode: number;
    ErrorDescription: string;
    Data: T;
}