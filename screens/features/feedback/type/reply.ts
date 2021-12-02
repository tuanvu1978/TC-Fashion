import { User } from 'features/auth/type/user';

export interface Reply {
    _id: string;
    content: string;
    createdAt: string;
    createdBy: string;
    creator: User;
    feedbackId: string;
    
}
