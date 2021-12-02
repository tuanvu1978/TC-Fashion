import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import { checkPhoneExist } from './auth.service';
import AuthButtonComponent from './components/auth-button.componen';
import InputAuthComponent from './components/input-auth.component';
import OtpScreen from './otp.screen';
import { ActivationStatus } from './type/user';

interface Props {}

interface State {
    buttonDisable: boolean;
}

export default class ForgotPasswordScreen extends React.Component<
    Props,
    State
> {
    private phone = '';

    static start() {
        navigateToPage(ScreenName.ForgotPasswordScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            buttonDisable: true
        };
    }

    private onPhoneChange = (text: string) => {
        this.phone = text;
        this.checkEnableLoginButton();
    };

    private checkEnableLoginButton = () => {
        this.setState({
            buttonDisable: this.phone.length === 0
        });
    };

    private onPhoneValidate = async () => {
        showLoading();
        const res = await checkPhoneExist(this.phone);
        hideLoading();
        if (res.status !== ApiStatus.SUCCESS) return;
        if (res.data === ActivationStatus.NOT_EXIST) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_phone_not_exist')
            });
            return;
        }

        if (res.data === ActivationStatus.ACTIVATED) {
            OtpScreen.start({ phone: this.phone, type: 'forgot' });
        }
    };

    private onContinuePressed = () => {
        if (!this.phone.startsWith('0') || this.phone.length !== 10) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_phone_invalid')
            });
            return;
        }
        this.onPhoneValidate();
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_forgot_password')}
                />

                <View style={{ paddingHorizontal: 40, marginTop: 70 }}>
                    <Image
                        source={R.images.ic_logo}
                        style={{ width: 100, height: 80, alignSelf: 'center' }}
                    />

                    <InputAuthComponent
                        onTextChange={this.onPhoneChange}
                        keyboardType="phone-pad"
                        containerStyle={{ marginTop: 80 }}
                        label={translate('phone')}
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

const styles = StyleSheet.create({
    buttonWrapper: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        borderRadius: 5,
        backgroundColor: R.colors.primaryColor
    }
});
