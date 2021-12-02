import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';
import { CreateFeedbackInput, Feedback } from './type/feedback';

export const FEEDBACK_CASES = '/feedback/case';
export const FEEDBACK = '/feedback';
export const FEEDBACK_CLOSE = '/feedback/close';
export const FEEDBACK_REPLY = '/feedback/reply';
export const FEEDBACK_ASSIGNEDS = '/feedback/list-assigned';

export function fetchFeedbackCases() {
    return ApiUtils.fetch<any, ResponseBase<any>>(FEEDBACK_CASES, {
        limit: 1000
    });
}

export function createFeedback(data: CreateFeedbackInput) {
    return ApiUtils.post<any, ResponseBase<Feedback>>(FEEDBACK, data);
}

export function fetchFeedbacks(afterId?: string) {
    return ApiUtils.fetch<any, ResponseBase<Feedback[]>>(FEEDBACK, {
        limit: 20,
        afterId
    });
}

export function fetchFeedbackDetail(id: string) {
    return ApiUtils.fetch<any, ResponseBase<Feedback>>(`${FEEDBACK}/${id}`);
}

export function closeFeedback(feedbackId: string) {
    return ApiUtils.post<any, ResponseBase<Feedback>>(FEEDBACK_CLOSE, {
        feedbackId
    });
}

export function removeFeedback(feedbackId: string) {
    return ApiUtils.remove<any, ResponseBase<any>>(`${FEEDBACK}/${feedbackId}`);
}

export function updateFeedback(data: CreateFeedbackInput) {
    return ApiUtils.put<any, ResponseBase<any>>(
        `${FEEDBACK}/${data._id}`,
        data
    );
}

export function fetchFeedbackListAssigned(afterId?: string) {
    return ApiUtils.fetch<any, ResponseBase<Feedback[]>>(FEEDBACK_ASSIGNEDS, {
        limit: 20,
        afterId
    });
}

export function sendCommentFeedback(data: {
    feedbackId: string;
    content: string;
}) {
    return ApiUtils.post<any, ResponseBase<any>>(FEEDBACK_REPLY, data);
}
