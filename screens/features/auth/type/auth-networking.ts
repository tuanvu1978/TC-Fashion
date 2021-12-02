export interface UserLoginInput {
    phone: string;
    password: string;
}

export interface ActivateAccountInput {
    phone: string;
    password: string;
}

export interface ChangePasswordInput {
    password: string;
    newPassword: string;
    passwordConfirmed: string;
}
