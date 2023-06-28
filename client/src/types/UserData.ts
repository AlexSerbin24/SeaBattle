export type RegisterData = {
    email:string,
    username:string,
    password:string
}

export type LoginData = Omit<RegisterData,"username">

export type UserData = RegisterData & {trophies:number, accessToken:string}




