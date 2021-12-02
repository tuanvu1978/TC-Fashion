import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import { View } from 'react-native';
import { translate } from 'res/languages';
import * as ScreenName from 'routing/screen-name';
import { goBack, navigateToPage } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import { changePassword } from './auth.service';
import AuthButtonComponent from './components/auth-button.componen';
import InputAuthComponent from './components/input-auth.component';

interface Props {}

interface State {
    buttonDisable: boolean;
}

export default class ChangePasswordScreen extends React.Component<
    Props,
    State
> {
    oldPassword = '';

    newPassword = '';

    confirmationPassword = '';

    static start() {
        navigateToPage(ScreenName.ChangePasswordScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            buttonDisable: true
        };
    }

    private onOldPasswordChange = (text: string) => {
        this.oldPassword = text;
        this.toggleButtonState();
    };

    private onPasswordChange = (text: string) => {
        this.newPassword = text;
        this.toggleButtonState();
    };

    private onConfirmationPasswordChange = (text: string) => {
        this.confirmationPassword = text;
        this.toggleButtonState();
    };

    private toggleButtonState = () => {
        if (
            !this.oldPassword ||
            !this.newPassword ||
            !this.confirmationPassword
        ) {
            this.setState({ buttonDisable: true });
            return;
        }

        this.setState({ buttonDisable: false });
    };

    private onContinuePressed = async () => {
        if (this.newPassword !== this.confirmationPassword) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('password_not_match')
            });
            return;
        }

        if (this.newPassword.length < 6) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('password_invalid')
            });
        }
        showLoading();
        const res = await changePassword({
            password: this.oldPassword,
            newPassword: this.newPassword,
            passwordConfirmed: this.confirmationPassword
        });
        hideLoading();

        if (res.status === ApiStatus.SUCCESS) {
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('password_change_success')
            });
            goBack();
        } else if (
            res.status ===
            ApiStatus.NEW_PASSWORD_MUST_BE_DIFFERENT_WITH_CURRENT_PASSWORD
        ) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('password_different_old')
            });
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('change_password_fail')
            });
        }
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_change_password')}
                />

                <View style={{ paddingHorizontal: 30 }}>
                    <InputAuthComponent
                        containerStyle={{ marginTop: 80 }}
                        onTextChange={this.onOldPasswordChange}
                        secureTextEntry
                        label={translate('password')}
                    />

                    <InputAuthComponent
                        containerStyle={{ marginTop: 20 }}
                        onTextChange={this.onPasswordChange}
                        secureTextEntry
                        label={translate('password')}
                    />
                    <InputAuthComponent
                        onTextChange={this.onConfirmationPasswordChange}
                        secureTextEntry
                        containerStyle={{ marginTop: 20 }}
                        label={translate('label_confirmation_password')}
                    />

                    <AuthButtonComponent
                        onPress={this.onContinuePressed}
                        label={translate('cta_continue')}
                        disabled={this.state.buttonDisable}
                    />
                </View>
            </View>
        );
    }
}
