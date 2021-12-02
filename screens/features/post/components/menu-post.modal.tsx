import * as React from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import R from 'res/R';
import { translate } from 'res/languages';
import { DimensionUtils } from 'utils/DimensionUtils';
import { Post } from '../type/post';

interface Props {
    isVisible: boolean;
    onDeletePost?: () => void;
    onEditPost?: () => void;
    onClosePopup: () => void;
}

interface State {}

export default class MenuPostModal extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={this.props.onClosePopup}
                onBackdropPress={this.props.onClosePopup}
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View style={styles.wrapper}>
                    <TouchableOpacity
                        onPress={this.props.onEditPost}
                        style={styles.menuWrapper}
                    >
                        <Image
                            style={styles.imageStyle}
                            source={R.images.ic_edit_post}
                        />

                        <Text>{translate('edit_post')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this.props.onDeletePost}
                        style={styles.menuWrapper}
                    >
                        <Image
                            style={styles.imageStyle}
                            source={R.images.ic_delete_post}
                        />

                        <Text>{translate('delete_post')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle: { width: 24, height: 24, marginRight: 12 },
    menuWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12
    },
    wrapper: {
        paddingBottom: DimensionUtils.getBottomSpace() + 12,
        paddingTop: 12,
        backgroundColor: 'white',
        paddingHorizontal: 12
    }
});
