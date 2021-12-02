import { Media } from 'types/media';

export interface Announcement {
    _id: string;
    attachFiles?: File[];
    avatar?: Media;
    title: string;
    description: string;
    content: string;
    lastAnnounceAt: string;
    type: 'POLICY' | 'NEW';
}

export interface File {
    _id: string;
    url: string;
}
