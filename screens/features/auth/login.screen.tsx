import { GlobalVariable } from 'constans/global-variable';
import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage, resetStack } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import {
    checkPhoneExist,
    saveUserInformation,
    userLogin
} from './auth.service';
import AuthButtonComponent from './components/auth-button.componen';
import InputAuthComponent from './components/input-auth.component';
import ForgotPasswordScreen from './forgot-password.screen';
import OtpScreen from './otp.screen';
import RegisterScreen from './register.screen';
import { ActivationStatus } from './type/user';

interface Props {}

interface State {
    loginDisable: boolean;
    phoneValid: boolean;
    willActiveAccount: boolean;
}

export default class LoginScreen extends React.Component<Props, State> {
    static start() {
        navigateToPage(ScreenName.LoginScreen);
    }

    private phone = '';

    private password = '';

    private passwordInputRef = React.createRef<InputAuthComponent>();

    constructor(props: Props) {
        super(props);
        this.state = {
            loginDisable: true,
            phoneValid: false,
            willActiveAccount: false
        };
    }

    private onForgotPasswordPressed = () => {
        ForgotPasswordScreen.start();
    };

    private onPhoneChange = (text: string) => {
        this.phone = text;
        this.setState({ phoneValid: false });
        this.checkEnableLoginButton();
    };

    private onPasswordChange = (text: string) => {
        this.password = text;
        this.checkEnableLoginButton();
    };

    private checkEnableLoginButton = () => {
        this.setState({
            loginDisable: this.phone.length === 0
        });
    };

    private onLogin = async () => {
        showLoading();
        const res: any = await userLogin({
            phone: this.phone,
            password: this.password
        });
        hideLoading();
        if (res.status === ApiStatus.SUCCESS) {
            saveUserInformation(
                res.token,
                res.expiresAt,
                res.refreshToken,
                res.user
            );
            resetStack(ScreenName.MainScreen);
        } else if (res.status === ApiStatus.USER_NOT_EXIST_OR_NOT_ACTIVATED) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('account_is_blocked')
            });
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('account_not_correct')
            });
        }
    };

    private onPhoneValidate = async () => {
        const res = await checkPhoneExist(this.phone);
        if (res.status !== ApiStatus.SUCCESS) return;
        if (res.data === ActivationStatus.NOT_EXIST) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_phone_not_exist')
            });
            return;
        }

        if (res.data === ActivationStatus.NOT_ACTIVATED) {
            this.setState({ willActiveAccount: true });
            return;
        }

        if (res.data === ActivationStatus.ACTIVATED) {
            this.setState({ phoneValid: true }, () => {
                this.passwordInputRef.current?.focus();
            });
        }
    };

    private onLoginPressed = () => {
        if (!this.phone.startsWith('0') || this.phone.length !== 10) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_phone_invalid')
            });
            return;
        }
        if (this.state.willActiveAccount) {
            OtpScreen.start({ phone: this.phone, type: 'activate' });
        } else if (this.state.phoneValid) {
            this.onLogin();
        } else {
            this.onPhoneValidate();
        }
    };

    private renderButtonLabel = () => {
        if (this.state.willActiveAccount) {
            return translate('cta_send_otp');
        }

        if (this.state.phoneValid) {
            return translate('cta_login');
        }
        return translate('cta_continue');
    };

    private renderRegisterButton() {
        if (!GlobalVariable.isTestMode) return null;
        return (
            <Text
                onPress={() => {
                    RegisterScreen.start();
                }}
                style={{
                    fontSize: 15,
                    padding: 10,
                    alignSelf: 'center',
                    marginTop: 20,
                    fontWeight: '600',
                    color: R.colors.primaryColor,
                    textDecorationLine: 'underline'
                }}
            >
                Đăng ký tài khoản mới
            </Text>
        );
    }

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_login')}
                />

                <ScrollView style={{ paddingHorizontal: 40, marginTop: 70 }}>
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

                    {this.state.phoneValid && (
                        <InputAuthComponent
                            ref={this.passwordInputRef}
                            onTextChange={this.onPasswordChange}
                            containerStyle={{ marginTop: 20 }}
                            secureTextEntry
                            label={translate('password')}
                        />
                    )}

                    {this.state.willActiveAccount && (
                        <Text style={{ marginTop: 50, textAlign: 'center' }}>
                            Tài khoản chưa được kích hoạt. Chúng tôi sẽ gửi bạn
                            mã xác nhận để kích hoạt
                        </Text>
                    )}

                    <AuthButtonComponent
                        disabled={this.state.loginDisable}
                        label={this.renderButtonLabel()}
                        onPress={this.onLoginPressed}
                    />

                    <Text
                        onPress={this.onForgotPasswordPressed}
                        style={{
                            fontSize: 15,
                            padding: 10,
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                    >
                        {translate('cta_forgot_password')}
                    </Text>

                    {/* {this.renderRegisterButton()} */}
                </ScrollView>
            </View>
        );
    }
}
