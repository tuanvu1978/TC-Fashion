import { translate } from 'res/languages';
import { Media } from 'types/media';

export enum ActivationStatus {
    NOT_EXIST = 'NOT_EXIST',
    ACTIVATED = 'ACTIVATED',
    NOT_ACTIVATED = 'NOT_ACTIVATED'
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export enum Role {
    CEO = 'CEO',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    CMS = 'CMS'
}

export enum UserStatus {
    LOCKED = 'LOCKED'
}
export interface User {
    _id: string;
    code: string;
    name: string;
    phone: string;
    departmentId: string;
    dob: string;
    position: Position;
    email: string;
    gender: Gender;
    employeeId?: string;
    profileRequest?: {
        haveOne: boolean;
    };
    password?: string;
    role: Role;
    department: Department;
    avatar?: Media;
    avatarId?: string;
    status: UserStatus;
}

export interface Department {
    code: string;
    name: string;
}

export enum Position {
    MANAGER = 'MANAGER',
    OFFICER = 'OFFICER',
    WORKER = 'WORKER',
    ADMIN = 'ADMIN',
    SURVEY = 'SURVEY',
    ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export interface UpdateProfileInput {
    name?: string;
    email?: string;
    dob?: string;
    position?: Position;
    gender?: Gender;
    avatarId?: string;
    avatar?: Media;
}

export const transformGenderLabel = (gender?: Gender) => {
    switch (gender) {
        case Gender.MALE:
            return translate('gender_male');

        case Gender.FEMALE:
            return translate('gender_female');

        default:
            return '';
    }
};

export const transformPositionLabel = (position: Position) => {
    switch (position) {
        case Position.MANAGER:
            return translate('position_manager');

        case Position.OFFICER:
            return translate('position_officer');

        case Position.WORKER:
            return translate('position_worker');

        default:
            return '';
    }
};

export const transformRoleLabel = (role?: Role) => {
    switch (role) {
        case Role.CEO:
            return translate('role_ceo');

        case Role.ADMIN:
            return translate('role_admin');

        case Role.STAFF:
            return translate('role_staff');
        default:
            return '';
    }
};
