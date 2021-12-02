import AnnouncementDetailScreen from 'features/announcement/announcement-detail.screen';
import FeedbackDetailScreen from 'features/feedback/feedback-detail.screen';
import PostDetailScreen from 'features/post/post-detail.screen';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ListRenderItem,
    TouchableOpacity
} from 'react-native';
import { translate } from 'res/languages';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName } from 'types/event-bus-type';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { fetchNotifications, markAsRead } from '../notification.service';
import { Notification, NotificationType } from '../type/notification';
import NotificationItemComponent from './notification-item.component';

interface Props {
    routeKey: 'FEED' | 'FEEDBACK' | 'ANNOUNCEMENT';
}

interface State {
    notifications: Notification[];
    refreshing: boolean;
}

export default class NotificationListComponent extends React.PureComponent<
    Props,
    State
> {
    private allowLoadmore = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            notifications: [],
            refreshing: true
        };
    }

    componentDidMount() {
        this.fillData();
    }

    private fillData = async (after?: string) => {
        const res = await fetchNotifications({
            limit: 20,
            tab: this.props.routeKey,
            after
        });

        if (res.status === ApiStatus.SUCCESS) {
            if (after) {
                this.setState({
                    notifications: [...this.state.notifications, ...res.data!],
                    refreshing: false
                });
                this.allowLoadmore = res.data!.length > 0;
            } else {
                this.setState({
                    notifications: res.data || [],
                    refreshing: false
                });
            }

            EventBus.getInstance().post({
                type: EventBusName.DETAIL_UNREAD_NOTI_EVENT,
                payload: res.total
            });
        }
    };

    private onRefresh = () => {
        this.allowLoadmore = true;
        this.setState({ refreshing: true });
        this.fillData();
    };

    private onEndReached = (): void => {
        if (!this.allowLoadmore || this.state.notifications.length === 0)
            return;
        const afterId = this.state.notifications[
            this.state.notifications.length - 1
        ]._id;
        this.fillData(afterId);
    };

    private keyExtractor = (item: Notification, index: number): string =>
        item._id;

    private markNotificationAsRead(item: Notification, index: number) {
        if (!item.read) {
            markAsRead(item._id);
            const notifications = [...this.state.notifications];
            notifications.splice(index, 1, { ...item, read: true });
            this.setState({ notifications });

            EventBus.getInstance().post({
                type: EventBusName.UPDATE_COUNT_NOTIFICAION_EVENT,
                payload: false
            });

            EventBus.getInstance().post({
                type: EventBusName.REMOVE_DETAIL_UNREAD_NOTI_EVENT,
                payload: item.tab
            });
        }
    }

    private onNotificationPressed = (
        item: Notification,
        index: number
    ) => () => {
        this.markNotificationAsRead(item, index);

        switch (item.type) {
            case NotificationType.COMMENT_ON_POST:
            case NotificationType.REPLY_A_COMMENT:
                if (item.forPostId) {
                    PostDetailScreen.start(item.forPostId);
                }
                break;

            case NotificationType.REPLY_A_FEEDBACK:
                if (item.forFeedbackId) {
                    FeedbackDetailScreen.start(item.forFeedbackId);
                }
                break;

            case NotificationType.NEW_FEEDBACK:
            case NotificationType.REMIND_TO_REPLY_FEEDBACK:
                if (item.variables) {
                    const data = JSON.parse(item.variables);
                    FeedbackDetailScreen.start(data?.feedback?._id);
                }
                break;

            case NotificationType.NEW_ANNOUNCEMENT:
                if (item.variables) {
                    const data = JSON.parse(item.variables);
                    AnnouncementDetailScreen.start(data?.announcement?._id);
                }
                break;

            default:
                break;
        }
    };

    private renderItem: ListRenderItem<Notification> = ({ item, index }) => {
        return (
            <NotificationItemComponent
                onNotificationPressed={this.onNotificationPressed}
                item={item}
                index={index}
            />
        );
    };

    private renderEmpty = () => {
        if (this.state.refreshing) return null;
        return (
            <View style={{ marginTop: 120, alignSelf: 'center' }}>
                <Text style={{ fontSize: 15 }}>
                    {translate('no_data_available')}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        return (
            <FlatList
                style={{ paddingTop: 15 }}
                data={this.state.notifications}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListEmptyComponent={this.renderEmpty}
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.5}
            />
        );
    }
}
