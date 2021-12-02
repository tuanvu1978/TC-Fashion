import { ResponseBase } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';
import { FetchNotificationInput, Notification } from './type/notification';

const NOTIFICATIONS = '/notification/my-notifications';
const MARK_AS_READ = '/notification/mark-as-read';
const TOTAL_UNREAD = '/notification/total-unread';

export function fetchNotifications(params: FetchNotificationInput) {
    return ApiUtils.fetch<
        any,
        ResponseBase<Notification[]> & {
            total: { feed: number; feedback: number; announcement: number };
        }
    >(NOTIFICATIONS, params);
}

export function markAsRead(id: string) {
    return ApiUtils.post<any, ResponseBase<any>>(MARK_AS_READ, { ids: [id] });
}

export function fetchTotalUnread() {
    return ApiUtils.fetch<any, ResponseBase<any>>(TOTAL_UNREAD);
}
