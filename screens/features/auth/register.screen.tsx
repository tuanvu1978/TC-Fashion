import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import { ScrollView, Text, View, Image, Platform } from 'react-native';
import { translate } from 'res/languages';
// @ts-ignore
import KeyboardSpacer from 'react-native-keyboard-spacer';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage, resetStack } from 'routing/service-navigation';
import AuthButtonComponent from './components/auth-button.componen';
import InputAuthComponent from './components/input-auth.component';
import { register, saveUserInformation } from './auth.service';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import { ApiStatus } from 'types/base.type';

interface Props {}

interface State {}

export default class RegisterScreen extends React.Component<Props, State> {
    private name = '';

    private phone = '';

    private password = '';

    static start() {
        navigateToPage(ScreenName.RegisterScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private onNameChange = (text: string) => {
        this.name = text;
    };

    private onPhoneChange = (text: string) => {
        this.phone = text;
    };

    private onPasswordChange = (text: string) => {
        this.password = text;
    };

    private onRegisterPressed = async () => {
        if (!this.name || !this.phone || !this.password) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: 'Vui lòng nhập đủ thông tin đăng ký'
            });
            return;
        }
        showLoading();
        const res: any = await register();
        hideLoading();
        if (res.status === ApiStatus.SUCCESS) {
            saveUserInformation(
                res.token,
                res.expiresAt,
                res.refreshToken,
                res.user
            );
            resetStack(ScreenName.MainScreen);
        }
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent showBackButton title="Đăng ký" />

                <ScrollView style={{ paddingHorizontal: 40, marginTop: 70 }}>
                    <Image
                        source={R.images.ic_logo}
                        style={{ width: 100, height: 80, alignSelf: 'center' }}
                    />

                    <InputAuthComponent
                        onTextChange={this.onNameChange}
                        containerStyle={{ marginTop: 80 }}
                        label="Họ và tên"
                    />

                    <InputAuthComponent
                        onTextChange={this.onPhoneChange}
                        keyboardType="phone-pad"
                        containerStyle={{ marginTop: 25 }}
                        label="Số điện thoại"
                    />

                    <InputAuthComponent
                        onTextChange={this.onPasswordChange}
                        secureTextEntry
                        containerStyle={{ marginTop: 25 }}
                        label="Mật khẩu"
                    />

                    <AuthButtonComponent
                        disabled={false}
                        label="Đăng ký"
                        onPress={this.onRegisterPressed}
                    />
                </ScrollView>

                {Platform.OS === 'ios' && <KeyboardSpacer />}
            </View>
        );
    }
}
