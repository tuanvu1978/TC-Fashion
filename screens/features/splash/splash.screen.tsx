import { GlobalVariable } from 'constans/global-variable';
import { fetchUser } from 'features/profile/profile.service';
import * as React from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import R from 'res/R';
import { LoginScreen, MainScreen } from 'routing/screen-name';
import { resetStack } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import ApiUtils from 'utils/ApiUtils';
import { AsyncStorageUtils, StorageKey } from 'utils/AsyncStorageUtils';

interface Props {}

interface State {}

export default class SplashScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        await this.initData();
        GlobalVariable.isTestMode = await this.isTestingVersion();
    }

    // eslint-disable-next-line consistent-return
    private isTestingVersion = async () => {
        if (Platform.OS === 'android') return false;
        const res: any = await ApiUtils.fetch('/settings/check-testing');
        if (res.status === ApiStatus.SUCCESS) {
            return res.data;
        }
        return false;
    };

    private async initData() {
        const tokenData: any = await AsyncStorageUtils.getObject(
            StorageKey.TOKEN_KEY
        );
        const user: any = await AsyncStorageUtils.getObject(
            StorageKey.USER_KEY
        );

        if (tokenData) {
            GlobalVariable.token = tokenData.token;
            GlobalVariable.user = user;

            if (GlobalVariable.user) {
                const res = await fetchUser(GlobalVariable.user?._id);

                if (res.data) {
                    GlobalVariable.user = res.data;
                    AsyncStorageUtils.saveObject(
                        StorageKey.USER_KEY,
                        GlobalVariable.user
                    );
                }
            }
            setTimeout(() => {
                resetStack(MainScreen);
            }, 1000);
        } else {
            setTimeout(() => {
                resetStack(LoginScreen);
            }, 1000);
        }
    }

    public render(): React.ReactNode {
        return (
            <View style={styles.wrapper}>
                <Image
                    source={R.images.ic_logo}
                    resizeMode="contain"
                    style={styles.imageStyle}
                />

                <ActivityIndicator size="small" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle: { width: '55%', height: 150, marginBottom: 40 },
    wrapper: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100
    }
});
