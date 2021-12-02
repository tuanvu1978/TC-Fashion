import { Media } from 'types/media';

export interface News {
    _id: string;
    image?: Media;
    title: string;
    description: string;
    content: string;
    createdAt: string;
}
