import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';

export const SURVEY = '/survey';
export const MARK_AS_TAKEN = '/survey/markAsTaken';

export const fetchSurveys = (afterId?: string) => {
    return ApiUtils.fetch<any, ResponseBase<any>>(SURVEY, {
        limit: 20,
        afterId
    });
};

export function fetchSurveyDetail<T>(_id: string) {
    return ApiUtils.fetch<any, ResponseBase<T>>(`${SURVEY}/${_id}`);
}

export function markSurveyAsTaken(surveyId?: string) {
    return ApiUtils.post<any, ResponseBase<any>>(MARK_AS_TAKEN, { surveyId });
}
