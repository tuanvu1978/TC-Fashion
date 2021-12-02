import { User } from 'features/auth/type/user';
import { ImageSourcePropType } from 'react-native';
import { Media } from 'types/media';

export interface Post {
    _id: string;
    title: string;
    content: string;
    imageIds?: string[];
    images: Media[];
    createdBy: string;
    creator: User;
    createdAt: string;
    privacy: PrivacyType;
    commentCount: number;
}

export enum PrivacyType {
    PUBLIC = 'PUBLIC',
    DRAFT = 'DRAFT'
}

export interface Privacy {
    icon: ImageSourcePropType;
    name: string;
    type: PrivacyType;
}

export interface CreatePostInput {
    title: string;
    content: string;
    status: string;
    _id?: string;
    imageIds?: string[];
}
