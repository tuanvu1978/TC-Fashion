import { Media } from 'types/media';

export interface Survey {
    _id: string;
    title: string;
    description: string;
    content: string;
    image?: Media;
    surveyUrl: string;
    createdAt: string;
}
