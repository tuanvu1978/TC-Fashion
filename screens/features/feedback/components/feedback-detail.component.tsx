import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import R from 'res/R';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import {
    Feedback,
    FeedbackStatus,
    FeedbackType,
    transformFeedbackTypeLabel,
    transformStatusLabel
} from '../type/feedback';

interface Props {
    feedback?: Feedback;
}

interface State {}

export default class FeedbackDetailComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private renderStatus = () => {
        const { feedback } = this.props;

        const color =
            feedback?.status === FeedbackStatus.ACTIVE ? '#07B25D' : '#DFDFDF';
        return (
            <View style={[styles.statusWrapper, { backgroundColor: color }]}>
                <Text
                    style={{
                        color: 'white',
                        fontWeight: '600'
                    }}
                >
                    {transformStatusLabel(feedback?.status)}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        const { feedback } = this.props;
        return (
            <View>
                <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
                    <Text
                        style={{
                            fontSize: 17,
                            color: R.colors.primaryColor,
                            fontWeight: '600'
                        }}
                    >
                        {feedback?.title}
                    </Text>
                    <View style={styles.timeWrapper}>
                        <Image
                            source={R.images.ic_time_news}
                            style={styles.timeIconStyle}
                        />
                        <Text style={{ fontSize: 13, color: '#606060' }}>
                            {DateTimeUtils.formatDate(
                                feedback?.createdAt,
                                'HH:mm DD/MM/YYYY'
                            )}
                        </Text>
                    </View>

                    <Text style={styles.labelStyle}>Trạng thái:</Text>
                    {this.renderStatus()}

                    <Text style={styles.labelStyle}>Nội dung:</Text>
                    <Text style={{ marginTop: 5 }}>{feedback?.content}</Text>

                    <Text style={styles.labelStyle}>Loại câu hỏi:</Text>
                    <Text style={{ marginTop: 5 }}>
                        {transformFeedbackTypeLabel(feedback?.type)}
                    </Text>

                    <Text style={styles.labelStyle}>Trường hợp phản ánh:</Text>
                    <Text style={{ marginTop: 5 }}>{feedback?.caseName}</Text>
                </View>
                <View style={styles.sectionStyle}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#111',
                            fontWeight: 'bold'
                        }}
                    >
                        Phản hồi
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sectionStyle: {
        height: 45,
        marginTop: 15,
        backgroundColor: '#EFEFEF',
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    statusWrapper: {
        marginTop: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
        width: 120,
        borderRadius: 3,
        backgroundColor: R.colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelStyle: { marginTop: 15, color: '#504f4f' },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    timeIconStyle: {
        width: 16,
        height: 16,
        marginRight: 3
    },
    titleStyle: {
        fontSize: 18,
        color: R.colors.primaryColor,
        marginBottom: 12
    }
});
