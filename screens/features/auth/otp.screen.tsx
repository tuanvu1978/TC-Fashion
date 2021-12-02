import auth from '@react-native-firebase/auth';
import HeaderComponent from 'libraries/header/header.component';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { DimensionUtils } from 'utils/DimensionUtils';
import ConfirmationCodeInputComponent from './components/confirmation-code-input.component';
import PasswordSetupScreen from './password-setup.screen';

interface Props {
    route: any;
}

interface State {
    continueDisable: boolean;
    secondResend: number;
}

const CODE_LENGTH = 6;
const TIMER = 60;

export default class OtpScreen extends React.Component<Props, State> {
    static start(data: { phone: string; type: 'activate' | 'forgot' }): void {
        navigateToPage(ScreenName.OtpScreen, data);
    }

    private code = '';

    private countDownTimer: any;

    private unsubscribe: any = null;

    private confirmation: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            continueDisable: true,
            secondResend: TIMER
        };
    }

    async componentDidMount(): Promise<void> {
        this.sendOtpCode();
        this.onCountDownResend();

        if (Platform.OS === 'android') {
            this.unsubscribe = auth().onAuthStateChanged((userRes: any) => {
                let phone = this.props.route?.params?.phone || '';
                if (!phone.startsWith('+84')) {
                    phone = phone.replace(/^0/, `+84`);
                }
                if (userRes && userRes.phoneNumber === phone) {
                    this.onOtpVerified();
                }
            });
        }
    }

    componentWillUnmount(): void {
        if (this.countDownTimer) clearInterval(this.countDownTimer);
        if (this.unsubscribe) this.unsubscribe();
    }

    protected onOtpVerified = (): void => {
        const phone = this.props.route?.params?.phone;
        const type = this.props.route?.params?.type;
        PasswordSetupScreen.start({ phone, type });
    };

    private onContinuePressed = () => {
        this.confirmCode(this.code);
        // this.onOtpVerified();
    };

    private confirmCode = async (code: string): Promise<void> => {
        try {
            this.confirmation
                .confirm(code)
                .then((res: any) => {
                    if (res) {
                        this.onOtpVerified();
                    } else {
                        this.confirmCodeError();
                    }
                })
                .catch((error: any) => {
                    console.log('error: ', error);
                    this.confirmCodeError();
                });
        } catch (error) {
            this.confirmCodeError();
        }
    };

    private confirmCodeError(): void {
        ToastComponent.show({
            type: ToastType.ERROR,
            message: translate('verification_code_invalid')
        });
    }

    private sendOtpCode = async (): Promise<void> => {
        let phone = this.props.route?.params?.phone || '';
        if (!phone.startsWith('+84')) {
            phone = phone.replace(/^0/, `+84`);
        }

        try {
            this.confirmation = await auth().signInWithPhoneNumber(phone);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    private onFullFillCode = (code: string): void => {
        this.code = code;
    };

    private onRecent = (): void => {
        this.setState({ secondResend: TIMER }, () => {
            this.sendOtpCode();
            this.onCountDownResend();
        });
    };

    private onCountDownResend = () => {
        this.countDownTimer = setInterval(() => {
            this.setState({ secondResend: this.state.secondResend - 1 }, () => {
                if (this.state.secondResend === 0) {
                    if (this.countDownTimer) clearInterval(this.countDownTimer);
                }
            });
        }, 1000);
    };

    private onCodeChange = (code: string): void => {
        if (code.length < CODE_LENGTH) {
            this.setState({ continueDisable: true });
        } else {
            this.setState({ continueDisable: false });
        }
    };

    public render(): React.ReactNode {
        const { secondResend } = this.state;
        const disabled = secondResend > 0;
        return (
            <View style={styles.wrapper}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_forgot_password')}
                />
                <View style={styles.contentWrapper}>
                    <Text style={styles.titleStyle}>
                        {translate('enter_code')}
                    </Text>
                    <Text style={styles.subtitleStyle}>
                        {translate('otp_msg')}
                    </Text>

                    <View style={styles.inputWrapper}>
                        <ConfirmationCodeInputComponent
                            codeLength={CODE_LENGTH}
                            activeColor={R.colors.primaryColor}
                            inactiveColor="#DDDDDD"
                            space={15}
                            autoFocus
                            codeInputStyle={styles.codeInputStyle}
                            size={45}
                            onFulfill={this.onFullFillCode}
                            onCodeChange={this.onCodeChange}
                        />
                    </View>

                    <Text style={styles.noReceive}>
                        {translate('havent_got_sms')}
                    </Text>

                    <TouchableOpacity
                        onPress={this.onRecent}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                styles.recent,
                                !disabled && styles.recentCode
                            ]}
                        >
                            {disabled
                                ? translate('receive_sms_in', {
                                      second: this.state.secondResend
                                  })
                                : translate('resend_sms')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={this.state.continueDisable}
                        onPress={this.onContinuePressed}
                        style={styles.buttonWrapper}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 15
                            }}
                        >
                            {translate('cta_continue')}
                        </Text>
                    </TouchableOpacity>
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
        marginVertical: 50
    },
    titleStyle: {
        fontWeight: '600',
        fontSize: 24,
        color: '#111',
        marginTop: 80
    },
    contentWrapper: {
        alignItems: 'center',
        width: '100%'
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
    btnBack: {
        marginTop: 20 + DimensionUtils.getStatusBarHeight(),
        marginRight: 20,
        alignSelf: 'flex-end',
        marginBottom: 64
    }
});
