import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';

export const ANNOUNCEMENTS = '/announcement/my-announcements';
export const ANNOUNCEMENT = '/announcement';

export function fetchAnnouncements(type: 'POLICY' | 'NEW', after?: string) {
    return ApiUtils.fetch<any, ResponseBase<any>>(ANNOUNCEMENTS, {
        limit: 20,
        after,
        type
    });
}

export function detailAnnouncement<T>(id: string) {
    return ApiUtils.fetch<any, ResponseBase<T>>(`${ANNOUNCEMENT}/${id}`);
}
