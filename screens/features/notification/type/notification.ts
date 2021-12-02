import { Feedback } from 'features/feedback/type/feedback';

export interface Notification {
    _id: string;
    createdAt: string;
    type: string;
    variables: string;
    forPostId?: string;
    forAnnouncementId?: string;
    forFeedbackId?: string;
    read: boolean;
    fromUserId: string;
    toUserId: string;
    tab: 'FEED' | 'FEEDBACK' | 'ANNOUNCEMENT';
}

export enum NotificationType {
    COMMENT_ON_POST = 'COMMENT_ON_POST',
    REPLY_A_FEEDBACK = 'REPLY_A_FEEDBACK',
    NEW_FEEDBACK = 'NEW_FEEDBACK',
    REPLY_A_COMMENT = 'REPLY_A_COMMENT',
    NEW_ANNOUNCEMENT = 'NEW_ANNOUNCEMENT',
    REMIND_TO_REPLY_FEEDBACK = 'REMIND_TO_REPLY_FEEDBACK'
}

export interface FetchNotificationInput {
    limit: number;
    after?: string;
    tab: 'FEED' | 'FEEDBACK' | 'ANNOUNCEMENT';
}
