export type LoginFormErrors = {
    email:string,
    password:string,
    server:string
};

export type RegisterFormErrors = LoginFormErrors & {username:string};

