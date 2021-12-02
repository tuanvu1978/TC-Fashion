import { UpdateProfileInput, User } from 'features/auth/type/user';
import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';

export const UPDATE_PROFILE = '/user/update-profile';
export const PROFILE = '/user/detailEmployee';

export function updateProfile(data?: UpdateProfileInput) {
    return ApiUtils.put<any, ResponseBase<boolean>>(UPDATE_PROFILE, data);
}

export function fetchUser(id?: string) {
    return ApiUtils.fetch<any, ResponseBase<User>>(`${PROFILE}/${id}`);
}
