import { GlobalVariable } from 'constans/global-variable';
import { transformRoleLabel } from 'features/auth/type/user';
import * as React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import R from 'res/R';
import { transformImageUrl } from 'utils/CommonUtils';

interface Props {}

interface State {}

export default class PostCreatorComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const avatar: ImageSourcePropType = GlobalVariable.user?.avatar
            ? { uri: transformImageUrl(GlobalVariable.user?.avatar?.thumbnail) }
            : R.images.ic_avatar_default;

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15
                }}
            >
                <Image style={styles.avatarStyle} source={avatar} />

                <Text
                    style={{
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: '600'
                    }}
                >
                    {GlobalVariable.user?.name} (
                    {transformRoleLabel(GlobalVariable.user?.role)})
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    avatarStyle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
    }
});
