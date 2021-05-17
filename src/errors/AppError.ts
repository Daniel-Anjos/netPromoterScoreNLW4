export class AppError {
    public readonly message: string;
    public readonly statusCode: number;

    //Sempre que há response de erro o statusCode é 400, desta forma ele foi fixado
    constructor(message: string, statusCode: number = 400){
        this.message = message;
        this.statusCode = statusCode;
    }
}