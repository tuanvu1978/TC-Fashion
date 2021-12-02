import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';
import { Comment, CommentListInput, CreateCommentInput } from './type/comment';

export const COMMENT = '/comment';

export function sendComment(data: CreateCommentInput) {
    return ApiUtils.post<any, ResponseBase<Comment>>(COMMENT, data);
}

export function fetchCommentList(params: CommentListInput) {
    return ApiUtils.fetch<any, ResponseBase<Comment[]>>(COMMENT, params);
}
