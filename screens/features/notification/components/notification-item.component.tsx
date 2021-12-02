import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { markAsRead } from '../notification.service';
import { Notification, NotificationType } from '../type/notification';

interface Props {
    item: Notification;
    index: number;
    onNotificationPressed: (item: Notification, index: number) => () => void;
}

interface State {}

export default class NotificationItemComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private renderContent = (item: Notification) => {
        const { variables } = item;
        const data = JSON.parse(variables);

        const message = this.getContentNotification(item);
        const from =
            item.type !== NotificationType.NEW_ANNOUNCEMENT
                ? data.fromUserName
                : 'Quản trị viên';
        const backgroundColor = item.read ? 'white' : '#F7F7F7';
        return (
            <TouchableOpacity
                onPress={this.props.onNotificationPressed(
                    item,
                    this.props.index
                )}
                style={[styles.itemWrapper, { backgroundColor }]}
            >
                <Text>
                        <Text style={{ fontWeight: 'bold' }}>{from}</Text>
                        {` ${message?.title}`}
                </Text>
                <Text numberOfLines={3} style={{ marginTop: 5 }}>
                    &quot;{message?.content}&quot;
                </Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#808080' }}>
                    {DateTimeUtils.getTimeSpanByNow(item.createdAt)}
                </Text>
            </TouchableOpacity>
        );
    };

    private getContentNotification(
        item: Notification
    ): { title: string; content: string } | undefined {
        const { variables } = item;
        const data = JSON.parse(variables);

        switch (item.type) {
            case NotificationType.REPLY_A_COMMENT:
                return {
                    title: 'đã trả lời bình luận:',
                    content: data.content
                };

            case NotificationType.COMMENT_ON_POST:
                return {
                    title: 'đã bình luận vào bài viết:',
                    content: data.content
                };

            case NotificationType.REPLY_A_FEEDBACK:
                return {
                    title: 'đã trả lời phản ánh:',
                    content: data.feedbackReply?.content
                };

            case NotificationType.NEW_FEEDBACK:
                return {
                    title: 'đã gửi 1 phản ánh:',
                    content: data.feedback?.title
                };

            case NotificationType.NEW_ANNOUNCEMENT:
                return {
                    title: 'đã gửi 1 thông báo mới:',
                    content: data.announcement?.title
                };

            case NotificationType.REMIND_TO_REPLY_FEEDBACK:
                return {
                    title: 'Có 1 phản ánh chưa được trả lời:',
                    content: data.feedback?.title
                };

            default:
                return undefined;
        }
    }

    public render(): React.ReactNode {
        const { item } = this.props;
        return this.renderContent(item);
    }
}

const styles = StyleSheet.create({
    itemWrapper: {
        shadowColor: '#525252',
        shadowOffset: {
            width: 0,
            height: 2
        },
        marginBottom: 15,
        backgroundColor: 'white',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        paddingVertical: 15,
        borderRadius: 5,
        elevation: 5
    }
});
