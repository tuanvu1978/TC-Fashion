import { Post } from 'features/post/type/post';
import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';

export const FEED = '/feed';

export function fetchFeed(data: any) {
    return ApiUtils.fetch<any, ResponseBase<Post[]>>(FEED, data);
}
