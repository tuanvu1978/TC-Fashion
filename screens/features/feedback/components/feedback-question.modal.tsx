import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import R from 'res/R';
import { FeedbackType, transformFeedbackTypeLabel } from '../type/feedback';

interface Props {
    isVisible: boolean;
    onClosePopup: () => void;
    typeSelected?: FeedbackType;
    onFeedbackTypeSelected: (item: FeedbackType) => () => void;
}

interface State {}

export default class FeedbackQuestionModal extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private renderItem = (type: FeedbackType) => {
        return (
            <TouchableOpacity
                onPress={this.props.onFeedbackTypeSelected(type)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12
                }}
            >
                <Image
                    source={
                        this.props.typeSelected === type
                            ? R.images.ic_checked
                            : R.images.ic_uncheck
                    }
                    style={styles.checkboxStyle}
                />
                <Text>{transformFeedbackTypeLabel(type)}</Text>
            </TouchableOpacity>
        );
    };

    public render(): React.ReactNode {
        return (
            <Modal
                onBackdropPress={this.props.onClosePopup}
                onBackButtonPress={this.props.onClosePopup}
                isVisible={this.props.isVisible}
            >
                <View
                    style={{
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        backgroundColor: 'white'
                    }}
                >
                    {this.renderItem(FeedbackType.QUESTION)}
                    {this.renderItem(FeedbackType.FEEDBACK)}
                    {this.renderItem(FeedbackType.SUGGESTION)}
                    {this.renderItem(FeedbackType.REPORT)}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    selectButtonWrapper: {
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: R.colors.primaryColor
    },
    checkboxStyle: {
        width: 22,
        height: 22,
        marginRight: 8
    },
    subWrapper: {
        marginLeft: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
