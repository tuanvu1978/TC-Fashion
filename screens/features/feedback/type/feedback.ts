import { User } from 'features/auth/type/user';
import { Case } from './case';
import { Reply } from './reply';

export interface Feedback {
    _id: string;
    title: string;
    content: string;
    createdBy: string;
    creator: User;
    type: FeedbackType;
    createdAt: string;
    status: FeedbackStatus;
    case?: Case;
    caseName: string;
    replies: Reply[];
}

export enum FeedbackStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED'
}

export enum FeedbackType {
    QUESTION = 'QUESTION',
    FEEDBACK = 'FEEDBACK',
    SUGGESTION = 'SUGGESTION',
    REPORT = 'REPORT'
}

export const transformFeedbackTypeLabel = (type?: FeedbackType) => {
    switch (type) {
        case FeedbackType.QUESTION:
            return 'Thắc mắc';
        case FeedbackType.FEEDBACK:
            return 'Phản ánh';
        case FeedbackType.SUGGESTION:
            return 'Góp ý';
        case FeedbackType.REPORT:
            return 'Tố cáo';
        default:
            return '';
    }
};

export const transformStatusLabel = (status?: FeedbackStatus) => {
    switch (status) {
        case FeedbackStatus.ACTIVE:
            return 'Hoạt động';
        case FeedbackStatus.CLOSED:
            return 'Kết thúc';

        default:
            return '';
    }
};

export interface CreateFeedbackInput {
    _id?: string;
    title: string;
    content: string;
    type: FeedbackType;
    caseId: string;
    caseName: string;
}
