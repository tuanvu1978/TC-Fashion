import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';
import { CreatePostInput, Post } from './type/post';

export const FEED = '/feed';

export function createPost(data: CreatePostInput) {
    return ApiUtils.post<any, ResponseBase<Post>>(FEED, data);
}

export function updatePost(data: CreatePostInput) {
    return ApiUtils.put<any, ResponseBase<Post>>(`${FEED}/${data._id}`, data);
}

export function fetchPostDetail(id: string) {
    return ApiUtils.fetch<any, ResponseBase<Post>>(`${FEED}/${id}`);
}

export function deletePost(id: string) {
    return ApiUtils.remove<any, ResponseBase<any>>(`${FEED}/${id}`);
}
