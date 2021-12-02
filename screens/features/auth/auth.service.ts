import { GlobalVariable } from 'constans/global-variable';
import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';
import { AsyncStorageUtils, StorageKey } from '../../utils/AsyncStorageUtils';
import {
    ActivateAccountInput,
    ChangePasswordInput,
    UserLoginInput
} from './type/auth-networking';
import { User } from './type/user';

export const LOGIN = '/user/login';
export const REGISTER = '/user/register';
export const CHECK_PHONE_EXIST = '/user/checkPhoneExist';
export const USER_ACTIVATE = '/user/activate';
export const FORGOT_PASSWORD = '/user/forgot-password';
export const CHANGE_PASSWORD = '/user/change-password';
export const REFRESH_TOKEN = '/user/refresh-token';
export const SUBSCRIBE_NOTIFICATION = '/user/subscribe-firebase-messaging';
export const UNSUBSCRIBE_NOTIFICATION = '/user/subscribe-firebase-messaging';

export function userLogin(body: UserLoginInput) {
    return ApiUtils.post<any, ResponseBase<any>>(LOGIN, body);
}

export function register() {
    return ApiUtils.post(REGISTER);
}

export function checkPhoneExist(phone: string) {
    return ApiUtils.fetch<any, ResponseBase<any>>(
        `${CHECK_PHONE_EXIST}/${phone}`
    );
}

export function activeUser(body: ActivateAccountInput) {
    return ApiUtils.post<any, ResponseBase<any>>(USER_ACTIVATE, body);
}

export function forgotPassword(body: ActivateAccountInput) {
    return ApiUtils.put<any, ResponseBase<any>>(FORGOT_PASSWORD, body);
}

export function changePassword(body: ChangePasswordInput) {
    return ApiUtils.post<any, ResponseBase<any>>(CHANGE_PASSWORD, body);
}

export function refreshTokenApp() {
    return ApiUtils.post<any, ResponseBase<any>>(REFRESH_TOKEN);
}

export function subscribeNotification(token: string) {
    return ApiUtils.post(SUBSCRIBE_NOTIFICATION, { token });
}

export function unsubscribeNotification(token: string) {
    return ApiUtils.post(UNSUBSCRIBE_NOTIFICATION, { token });
}

export const saveUserInformation = (
    token: string,
    expiresAt: string,
    refreshToken: string,
    user: User
) => {
    AsyncStorageUtils.saveObject(StorageKey.TOKEN_KEY, {
        token,
        expiresAt,
        refreshToken
    });

    delete user.password;
    AsyncStorageUtils.saveObject(StorageKey.USER_KEY, user);
    GlobalVariable.token = token;
    GlobalVariable.user = user;
};

export const clearUser = () => {
    AsyncStorageUtils.clear();
    GlobalVariable.token = undefined;
    GlobalVariable.user = undefined;
};
