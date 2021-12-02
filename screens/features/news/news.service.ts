import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';

export const NEWS = '/news';

export function fetchNews<T>(params: { limit: number; afterId?: string }) {
    return ApiUtils.fetch<any, ResponseBase<T>>(NEWS, params);
}

export function fetchNewsDetail<T>(_id: string) {
    return ApiUtils.fetch<any, ResponseBase<T>>(`${NEWS}/${_id}`);
}
