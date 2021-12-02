import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';

const SETTINGS = '/settings';

export function fetchIntroduction() {
    return ApiUtils.fetch<any, ResponseBase<any>>(SETTINGS);
}
