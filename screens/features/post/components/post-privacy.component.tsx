import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import { Privacy } from '../type/post';

interface Props {
    privacy: Privacy;
    onPrivacyPressed: () => void;
}

interface State {}

export default class PostPrivacyComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const { privacy } = this.props;

        return (
            <View style={styles.wrapper}>
                <Text>{translate('share_to')}</Text>
                <TouchableOpacity
                    onPress={this.props.onPrivacyPressed}
                    style={styles.privacyWrapper}
                >
                    <Image
                        style={{ width: 20, height: 20, tintColor: '#111' }}
                        source={privacy.icon}
                    />
                    <Text style={{ marginHorizontal: 8 }}>
                        {translate(privacy.name)}
                    </Text>
                    <Image
                        style={{ width: 16, height: 16 }}
                        source={R.images.ic_dropdown}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    privacyWrapper: {
        marginLeft: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        borderRadius: 6
    }
});
