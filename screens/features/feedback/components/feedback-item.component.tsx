import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import FeedbackDetailScreen from '../feedback-detail.screen';
import {
    Feedback,
    FeedbackStatus,
    transformStatusLabel
} from '../type/feedback';

interface Props {
    item: Feedback;
}

interface State {}

export default class FeedbackItemComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private onFeedbackItemPressed = () => {
        FeedbackDetailScreen.start(this.props.item._id);
    };

    private renderStatus = () => {
        const { item } = this.props;

        const color =
            item?.status === FeedbackStatus.ACTIVE ? '#07B25D' : '#DFDFDF';
        return (
            <View style={[styles.statusWrapper, { backgroundColor: color }]}>
                <Text
                    style={{
                        color: 'white',
                        fontWeight: '600'
                    }}
                >
                    {transformStatusLabel(item?.status)}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        const { item } = this.props;
        return (
            <TouchableOpacity
                onPress={this.onFeedbackItemPressed}
                style={styles.wrapper}
            >
                <Text
                    style={{
                        color: '#F8BA5D',
                        fontWeight: 'bold',
                        fontSize: 16
                    }}
                >
                    {item.title}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ fontSize: 12, color: '#808080' }}>
                        {DateTimeUtils.formatDate(
                            item.createdAt,
                            'HH:mm DD/MM/YYYY'
                        )}
                    </Text>
                    {this.renderStatus()}
                </View>

                <Text numberOfLines={2}>{item.content}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    statusWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        paddingVertical: 3,
        paddingHorizontal: 12,
        borderRadius: 2
    },
    wrapper: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        backgroundColor: 'white',
        marginVertical: 8,
        marginHorizontal: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
    }
});
