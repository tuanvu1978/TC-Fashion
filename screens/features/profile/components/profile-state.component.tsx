import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';

interface Props {
    profileRequest?: { haveOne: boolean; success?: boolean };
}

interface State {}

export default class ProfileStateComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const { profileRequest } = this.props;
        if (!profileRequest) return null;

        if (!profileRequest.haveOne) return null;

        let label = translate('pending_update_profile');
        let icon = R.images.ic_pending_profile;
        let color = R.colors.primaryColor;
        if (profileRequest.haveOne && profileRequest.success === false) {
            label = translate('reject_update_profile');
            icon = R.images.ic_reject_profile;
            color = 'red';
        }
        return (
            <View style={styles.wrapper}>
                <Image
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    source={icon}
                />
                <Text style={{ color }}>{label}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 15
    }
});
