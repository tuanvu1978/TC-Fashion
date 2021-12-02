import { GlobalVariable } from 'constans/global-variable';
import { clearUser } from 'features/auth/auth.service';
import ChangePasswordScreen from 'features/auth/change-password.screen';
import { Role } from 'features/auth/type/user';
import MyFeedScreen from 'features/feed/my-feed.screen';
import FeedbackAssignedScreen from 'features/feedback/feedback-assigned.screen';
import ProfileScreen from 'features/profile/profile.screen';
import HeaderComponent from 'libraries/header/header.component';
import PopupComponent from 'libraries/popup/popup.component';
import * as React from 'react';
import { View } from 'react-native';
import { translate } from 'res/languages';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage, resetStack } from 'routing/service-navigation';
import EventBus from 'services/EventBus';
import { EventBusName } from 'types/event-bus-type';
import FirebaseUtils from 'utils/firebase.utils';
import ProfileComponent from './components/profile.component';
import SettingItemComponent from './components/setting-item.component';
import IntroductionScreen from './introduction.screen';

interface Props {}

interface State {
    isVisible: boolean;
}

export default class SettingScreen extends React.Component<Props, State> {
    static start() {
        navigateToPage(ScreenName.SettingScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            isVisible: false
        };
    }

    private onProfilePressed = () => {
        ProfileScreen.start();
    };

    private onShowFeedbackPressed = () => {
        FeedbackAssignedScreen.start();
    };

    private onClosePopup = () => {
        this.setState({ isVisible: false });
    };

    private onLogoutPressed = () => {
        this.setState({ isVisible: true });
    };

    private onMyPostPressed = () => {
        MyFeedScreen.start();
    };

    private onChangePasswordPressed = () => {
        ChangePasswordScreen.start();
    };

    private onIntroductionPressed = () => {
        IntroductionScreen.start();
    };

    private onLogout = () => {
        FirebaseUtils.getInstance().unSubcribeNotification();
        clearUser();
        this.onClosePopup();

        resetStack(ScreenName.LoginScreen);

        EventBus.getInstance().post({
            type: EventBusName.LOGOUT_EVENT
        });
    };

    public render(): React.ReactNode {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_settings')}
                />
                <ProfileComponent />

                <SettingItemComponent
                    onPress={this.onProfilePressed}
                    label={translate('label_profile_information')}
                />

                {GlobalVariable.user?.role !== Role.CEO && (
                    <SettingItemComponent
                        onPress={this.onShowFeedbackPressed}
                        label={translate('label_feedback_response')}
                    />
                )}

                {GlobalVariable.user?.role !== Role.STAFF && (
                    <SettingItemComponent
                        onPress={this.onMyPostPressed}
                        label={translate('label_private_news')}
                    />
                )}

                <SettingItemComponent
                    onPress={this.onChangePasswordPressed}
                    label={translate('label_change_password')}
                />

                <SettingItemComponent
                    onPress={this.onIntroductionPressed}
                    label={translate('label_introduction')}
                />

                <SettingItemComponent
                    onPress={this.onLogoutPressed}
                    label={translate('label_logout')}
                />

                <PopupComponent
                    ctaTextRight="Đăng xuất"
                    ctaLeftCallback={this.onClosePopup}
                    ctaRightCallback={this.onLogout}
                    isVisible={this.state.isVisible}
                    onClosePopup={this.onClosePopup}
                    message="Xác nhận đăng xuất"
                />
            </View>
        );
    }
}
