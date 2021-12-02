import { Media } from 'types/media';

export interface Introduction {
    _id: string;
    name: string;
    phone: string;
    url?: string;
    logoId: string;
    logo: Media;
    email: string;
    description: string;
}
