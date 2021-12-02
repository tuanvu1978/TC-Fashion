import { User } from 'features/auth/type/user';

export interface Comment {
    _id: string;
    commentCount: number;
    content: string;
    comments: Comment[];
    createdAt: string;
    createdBy: string;
    creator: User;
    parentId: string;
    parentType: CommentType;
}

export enum CommentType {
    POST = 'POST',
    COMMENT = 'COMMENT'
}

export interface CreateCommentInput {
    content: string;
    parentType: CommentType;
    parentId?: string;
}

export interface CommentListInput {
    limit?: number;
    afterId?: string;
    parentType: CommentType;
    parentId: string;
    commentReplyLimit?: number;
}
