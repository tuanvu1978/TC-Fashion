import HeaderComponent from 'libraries/header/header.component';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage, resetStack } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import {
    activeUser,
    forgotPassword,
    saveUserInformation
} from './auth.service';
import AuthButtonComponent from './components/auth-button.componen';
import InputAuthComponent from './components/input-auth.component';

interface Props {
    route: any;
}

interface State {
    buttonDisable: boolean;
}

export default class PasswordSetupScreen extends React.Component<Props, State> {
    static start(data: { phone: string; type: 'activate' | 'forgot' }) {
        navigateToPage(ScreenName.PasswordSetupScreen, data);
    }

    private password = '';

    private confirmationPassword = '';

    constructor(props: Props) {
        super(props);
        this.state = {
            buttonDisable: true
        };
    }

    private onPasswordChange = (text: string) => {
        this.password = text;
        this.checkEnableLoginButton();
    };

    private onConfirmationPasswordChange = (text: string) => {
        this.confirmationPassword = text;
        this.checkEnableLoginButton();
    };

    private checkEnableLoginButton = () => {
        this.setState({
            buttonDisable: !this.password || !this.confirmationPassword
        });
    };

    private onActiveAccountPressed = async () => {
        if (this.password.length < 6) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_password_length')
            });
            return;
        }

        if (this.password !== this.confirmationPassword) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_password_not_match')
            });
            return;
        }

        const phone = this.props.route?.params?.phone || '';
        const type = this.props.route?.params?.type || '';
        let res: any;
        const data = {
            phone,
            password: this.password
        };
        if (type === 'activate') {
            res = await activeUser(data);
            if (res.status === ApiStatus.SUCCESS) {
                saveUserInformation(
                    res.token,
                    res.expiresAt,
                    res.refreshToken,
                    res.user
                );
                resetStack(ScreenName.MainScreen);
            }
        } else {
            res = await forgotPassword(data);
            if (res.status === ApiStatus.SUCCESS) {
                ToastComponent.show({
                    type: ToastType.SUCCESS,
                    message: translate('msg_change_password_success')
                });
                navigateToPage(ScreenName.LoginScreen);
            } else {
                ToastComponent.show({
                    type: ToastType.ERROR,
                    message: translate('create_password_fail')
                });
            }
        }
    };

    public render(): React.ReactNode {
        return (
            <View style={styles.wrapper}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_password_setup')}
                />

                <View style={styles.contentWrapper}>
                    <Text style={styles.titleStyle}>
                        {translate('title_password_setup')}
                    </Text>
                    <Text style={styles.subtitleStyle}>
                        {translate('msg_password_setup')}
                    </Text>

                    <InputAuthComponent
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
                        onPress={this.onActiveAccountPressed}
                        label={translate('cta_update')}
                        disabled={this.state.buttonDisable}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    codeInputStyle: {
        borderWidth: 1.5,
        fontSize: 18,
        fontWeight: '600',
        color: '#111'
    },
    noReceive: {
        fontSize: 15,
        color: '#676870',
        textAlign: 'center',
        marginTop: 50
    },
    recent: {
        fontSize: 15,
        textAlign: 'center',
        marginVertical: 22
    },
    recentCode: {
        color: R.colors.primaryColor,
        textDecorationLine: 'underline'
    },
    subtitleStyle: {
        fontSize: 14,
        width: '60%',
        textAlign: 'center',
        marginVertical: 50,
        alignSelf: 'center'
    },
    titleStyle: {
        fontWeight: '600',
        fontSize: 24,
        color: '#111',
        marginTop: 80,
        alignSelf: 'center'
    },
    contentWrapper: {
        width: '100%',
        paddingHorizontal: 40
    },
    inputWrapper: { width: '100%', marginBottom: 50 },
    buttonWrapper: {
        width: '80%',
        zIndex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: R.colors.primaryColor
    },
    buttonStyle: { marginHorizontal: 20 },
    wrapper: { backgroundColor: 'white', flex: 1 },

    buttonLoginWrapper: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        borderRadius: 5,
        backgroundColor: R.colors.primaryColor
    }
});
