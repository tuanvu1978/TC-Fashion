import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ImageSourcePropType
} from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import R from 'res/R';
import { Media } from 'types/media';
import { transformImageUrl } from 'utils/CommonUtils';

interface Props {
    editable: boolean;
    avatar?: Media;
    onChangeAvatar: () => void;
}

interface State {}

export default class AvatarComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const avatar: ImageSourcePropType = this.props.avatar
            ? { uri: transformImageUrl(this.props.avatar.thumbnail) }
            : R.images.ic_avatar_default;

        return (
            <View style={styles.wrapper}>
                <Image source={avatar} style={styles.avatarStyle} />

                {this.props.editable && (
                    <TouchableOpacity
                        onPress={this.props.onChangeAvatar}
                        style={{ position: 'absolute', bottom: 0, right: 0 }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={R.images.ic_gallery}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    avatarStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.03)'
    },
    wrapper: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    }
});
