import { GlobalVariable } from 'constans/global-variable';
import {
    Gender,
    Position,
    transformGenderLabel,
    transformPositionLabel,
    UpdateProfileInput,
    User
} from 'features/auth/type/user';
import { uploadImage } from 'features/media/media.service';
import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { goBack, navigateToPage } from 'routing/service-navigation';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName } from 'types/event-bus-type';
import { AsyncStorageUtils, StorageKey } from 'utils/AsyncStorageUtils';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { DimensionUtils } from 'utils/DimensionUtils';
import AvatarComponent from './components/avatar.component';
import DatePickerPopup from './components/date-picker.popup';
import GenderPopup from './components/gender.popup';
import PositionPopup from './components/position.popup';
import ProfileDropdownComponent from './components/profile-dropdown.component';
import ProfileInputComponent from './components/profile-input.component';
import ProfileStateComponent from './components/profile-state.component';
import { fetchUser, updateProfile } from './profile.service';

interface Props {}

interface State {
    editMode: boolean;
    userOriginal?: User;
    userUpdate?: UpdateProfileInput;
    genderPopupVisible: boolean;
    positionPopupVisible: boolean;
    datePopupVisible: boolean;
}

export default class ProfileScreen extends React.Component<Props, State> {
    static start() {
        navigateToPage(ScreenName.ProfileScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            editMode: false,
            userOriginal: GlobalVariable.user,
            userUpdate: undefined,
            genderPopupVisible: false,
            positionPopupVisible: false,
            datePopupVisible: false
        };
    }

    async componentDidMount() {
        const res = await fetchUser(GlobalVariable.user?._id);

        if (res.status === ApiStatus.SUCCESS) {
            if (res.data) {
                GlobalVariable.user = res.data;
                this.setState({
                    userOriginal: res.data,
                    userUpdate: {
                        name: res.data?.name,
                        gender: res.data?.gender,
                        dob: res.data?.dob,
                        email: res.data?.email,
                        avatarId: res.data?.avatarId,
                        avatar: res.data?.avatar,
                        position: this.state.userOriginal?.position
                    }
                });
            }
        }
    }

    private onChangeAvatar = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            forceJpg: true,
            maxFiles: 10,
            compressImageMaxWidth: 720,
            compressImageMaxHeight: 720,
            compressImageQuality: 0.8
        }).then(async (image) => {
            showLoading();
            const res = await uploadImage({
                _id: `${Date.now().toString()}_${image.filename}`,
                localUrl: Platform.OS === 'ios' ? image.sourceURL : image.path,
                width: image.width,
                height: image.height
            });
            hideLoading();
            if (res.status === ApiStatus.SUCCESS) {
                this.setState({
                    userUpdate: {
                        ...this.state.userUpdate,
                        avatar: res.data,
                        avatarId: res.data?._id
                    }
                });
            }
        });
    };

    private onToggleEditMode = () => {
        this.setState({ editMode: !this.state.editMode });
    };

    private onBackPressed = () => {
        if (this.state.editMode) {
            this.setState({
                editMode: false,
                userUpdate: {
                    name: this.state.userOriginal?.name,
                    gender: this.state.userOriginal?.gender,
                    dob: this.state.userOriginal?.dob,
                    email: this.state.userOriginal?.email,
                    avatarId: this.state.userOriginal?.avatarId,
                    avatar: this.state.userOriginal?.avatar,
                    position: this.state.userOriginal?.position
                }
            });
        } else {
            goBack();
        }
    };

    private onNameChange = (text: string) => {
        this.setState({ userUpdate: { ...this.state.userUpdate, name: text } });
    };

    private onEmailChange = (text: string) => {
        this.setState({
            userUpdate: { ...this.state.userUpdate, email: text }
        });
    };

    private onGenderPopupClose = () => {
        this.setState({ genderPopupVisible: false });
    };

    private onPositionPopupClose = () => {
        this.setState({ positionPopupVisible: false });
    };

    private onDatePopupClose = () => {
        this.setState({ datePopupVisible: false });
    };

    private onDateChange = (date: Date) => {
        this.setState({
            userUpdate: { ...this.state.userUpdate, dob: date.toISOString() },
            datePopupVisible: false
        });
    };

    private onGenderPressed = () => {
        if (!this.state.editMode) return;
        this.setState({ genderPopupVisible: true });
    };

    private onPositionPressed = () => {
        if (!this.state.editMode) return;
        this.setState({ positionPopupVisible: true });
    };

    private onDatePressed = () => {
        if (!this.state.editMode) return;
        this.setState({ datePopupVisible: true });
    };

    private onGenderChange = (gender: Gender) => () => {
        this.setState({
            userUpdate: { ...this.state.userUpdate, gender },
            genderPopupVisible: false
        });
    };

    private onPositionChange = (position: Position) => () => {
        this.setState({
            userUpdate: { ...this.state.userUpdate, position },
            positionPopupVisible: false
        });
    };

    private submitUpdate = async () => {
        const res: any = await updateProfile(this.state.userUpdate);

        if (res.status === ApiStatus.SUCCESS) {
            AsyncStorageUtils.saveObject(StorageKey.USER_KEY, res.user);
            GlobalVariable.user = res.user;

            this.setState({
                userOriginal: GlobalVariable.user,
                editMode: false
            });

            EventBus.getInstance().post({
                type: EventBusName.UPDATE_PROFILE_EVENT
            });
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: 'Cập nhật thông tin tài khoản thành công!'
            });
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: 'Cập nhật thông tin tài khoản thất bại!'
            });
        }
    };

    private renderMenuRight = () => {
        if (this.state.editMode) return undefined;

        return (
            <TouchableOpacity onPress={this.onToggleEditMode}>
                <Image
                    style={{ width: 24, height: 24 }}
                    source={R.images.ic_edit}
                />
            </TouchableOpacity>
        );
    };

    public render(): React.ReactNode {
        const { editMode } = this.state;

        let {
            name,
            gender,
            dob,
            email,
            avatarId,
            avatar,
            position
        }: any = this.state.userOriginal;
        const {
            phone,
            code,
            department,
            profileRequest
        }: any = this.state.userOriginal;

        if (editMode) {
            name = this.state.userUpdate?.name;
            gender = this.state.userUpdate?.gender;
            dob = this.state.userUpdate?.dob;
            email = this.state.userUpdate?.email;
            avatar = this.state.userUpdate?.avatar;
            avatarId = this.state.userUpdate?.avatarId;
            position = this.state.userUpdate?.position;
        }

        return (
            <View
                style={{
                    backgroundColor: 'white',
                    flex: 1
                }}
            >
                <HeaderComponent
                    onPress={this.onBackPressed}
                    showBackButton
                    title={translate('title_profile_information')}
                    renderRight={this.renderMenuRight()}
                />

                <ScrollView
                    style={{
                        paddingHorizontal: 15,
                        paddingTop: 15
                    }}
                >
                    <AvatarComponent
                        avatar={avatar}
                        onChangeAvatar={this.onChangeAvatar}
                        editable={editMode}
                    />

                    <ProfileStateComponent profileRequest={profileRequest} />
                    <ProfileInputComponent
                        onChangeText={this.onNameChange}
                        value={name}
                        disable
                        editable={editMode}
                        containerStyle={{ marginBottom: 20, marginTop: 35 }}
                        label={translate('label_name')}
                    />
                    <ProfileInputComponent
                        value={phone}
                        editable={editMode}
                        disable
                        containerStyle={{ marginBottom: 20 }}
                        label={translate('label_phone')}
                    />

                    <ProfileDropdownComponent
                        editable={editMode}
                        onPress={this.onGenderPressed}
                        containerStyle={{ marginBottom: 20 }}
                        value={transformGenderLabel(gender)}
                        label={translate('label_gender')}
                    />

                    <ProfileDropdownComponent
                        editable={editMode}
                        onPress={this.onDatePressed}
                        containerStyle={{ marginBottom: 20 }}
                        value={DateTimeUtils.formatDate(dob)}
                        imageRight={R.images.ic_date}
                        label={translate('label_date_birth')}
                    />

                    <ProfileInputComponent
                        value={email}
                        editable={editMode}
                        onChangeText={this.onEmailChange}
                        containerStyle={{ marginBottom: 20 }}
                        label={translate('label_email')}
                    />

                    <ProfileInputComponent
                        value={code}
                        editable={editMode}
                        disable
                        containerStyle={{ marginBottom: 20 }}
                        label={translate('label_employee_code')}
                    />

                    <ProfileDropdownComponent
                        editable={editMode}
                        disable
                        onPress={this.onPositionPressed}
                        containerStyle={{ marginBottom: 20 }}
                        value={transformPositionLabel(position)}
                        label={translate('label_role')}
                    />

                    <ProfileDropdownComponent
                        editable={editMode}
                        disable
                        containerStyle={{ marginBottom: 20 }}
                        value={department?.name}
                        label={translate('label_faculty')}
                    />

                    {this.state.editMode && (
                        <TouchableOpacity
                            onPress={this.submitUpdate}
                            style={styles.buttonWrapper}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 15
                                }}
                            >
                                {translate('cta_send_update_request')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                <GenderPopup
                    onGenderChange={this.onGenderChange}
                    isVisible={this.state.genderPopupVisible}
                    onClosePopup={this.onGenderPopupClose}
                />

                <PositionPopup
                    onPositionChange={this.onPositionChange}
                    isVisible={this.state.positionPopupVisible}
                    onClosePopup={this.onPositionPopupClose}
                />

                <DatePickerPopup
                    onDateChange={this.onDateChange}
                    isVisible={this.state.datePopupVisible}
                    onClosePopup={this.onDatePopupClose}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonWrapper: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        borderRadius: 5,
        marginBottom: DimensionUtils.getBottomSpace() + 10,
        backgroundColor: R.colors.primaryColor
    }
});
