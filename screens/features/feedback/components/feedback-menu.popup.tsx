import { GlobalVariable } from 'constans/global-variable';
import { Role } from 'features/auth/type/user';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ImageSourcePropType,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import R from 'res/R';
import { DimensionUtils } from 'utils/DimensionUtils';
import { Feedback, FeedbackStatus } from '../type/feedback';

interface Props {
    isVisible: boolean;
    feedback?: Feedback;
    onClosePopup: () => void;
    onCloseFeedback: () => void;
    onEditFeedback: () => void;
    onDeleteFeedback: () => void;
}

interface State {}

export default class FeedbackMenuPopup extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private renderItem = (
        icon: ImageSourcePropType,
        label: string,
        onPress: () => void
    ) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.itemWrapper}>
                <Image
                    source={icon}
                    style={{ width: 24, height: 24, marginRight: 12 }}
                />
                <Text>{label}</Text>
            </TouchableOpacity>
        );
    };

    public render(): React.ReactNode {
        return (
            <Modal
                onBackButtonPress={this.props.onClosePopup}
                onBackdropPress={this.props.onClosePopup}
                isVisible={this.props.isVisible}
                style={{ margin: 0, justifyContent: 'flex-end' }}
            >
                <View style={styles.wrapper}>
                    {GlobalVariable.user?.role === Role.ADMIN &&
                        this.props.feedback?.status === FeedbackStatus.ACTIVE &&
                        this.renderItem(
                            R.images.ic_edit_feedback,
                            'Chỉnh sửa phản ánh',
                            this.props.onEditFeedback
                        )}

                    {this.props.feedback?.status === FeedbackStatus.ACTIVE &&
                        this.renderItem(
                            R.images.ic_closed_feedback,
                            'Kết thúc',
                            this.props.onCloseFeedback
                        )}

                    {GlobalVariable.user?.role === Role.ADMIN &&
                        this.renderItem(
                            R.images.ic_delete_feedback,
                            'Xóa',
                            this.props.onDeleteFeedback
                        )}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    itemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    wrapper: {
        backgroundColor: 'white',
        paddingBottom: DimensionUtils.getBottomSpace() + 12,
        paddingTop: 12,
        paddingHorizontal: 12
    }
});
