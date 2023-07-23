class ApiError extends Error{
    public statusCode:number;

    constructor(message:string, statusCode:number) {
        super(message);
        this.statusCode = statusCode;
    }
    static Unauthorized(){
        return new ApiError("User is unauthorized", 401);
    }

    static BadRequest(message:string){
        return new ApiError(message,400)
    }

}

export default ApiError;