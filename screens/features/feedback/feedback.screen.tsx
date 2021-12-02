import { GlobalVariable } from 'constans/global-variable';
import { Role } from 'features/auth/type/user';
import HeaderComponent from 'libraries/header/header.component';
import HomeHeaderComponent from 'libraries/header/home-header.component';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    Image
} from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName, EventPayload } from 'types/event-bus-type';
import FeedbackItemComponent from './components/feedback-item.component';
import FeedbackCreateScreen from './feedback-create.screen';
import { fetchFeedbacks } from './feedback.service';
import { Feedback } from './type/feedback';

interface Props {}

interface State {
    refreshing: boolean;
    feedbacks: Feedback[];
}

export default class FeedbackScreen extends React.Component<Props, State> {
    private subscriptions = new Subscription();

    private allowLoadmore = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshing: true,
            feedbacks: []
        };
    }

    componentDidMount() {
        this.fillData();
        this.registerEventBus();
    }

    componentWillUnmount() {
        this.unregisterEventBus();
    }

    private registerEventBus = () => {
        this.subscriptions.add(
            EventBus.getInstance().events.subscribe(
                (data: EventPayload<any>) => {
                    switch (data.type) {
                        case EventBusName.CREATE_FEEDBACK_EVENT:
                            this.setState({
                                feedbacks: [
                                    data.payload,
                                    ...this.state.feedbacks
                                ]
                            });
                            break;

                        case EventBusName.UPDATE_FEEDBACK_EVENT:
                            this.onUpdateFeedback(data.payload);
                            break;

                        case EventBusName.CLOSE_FEEDBACK_EVENT:
                            this.onCloseFeedback(data.payload);
                            break;

                        case EventBusName.REMOVE_FEEDBACK_EVENT:
                            this.onRemoveFeedback(data.payload);
                            break;

                        default:
                            break;
                    }
                }
            )
        );
    };

    private unregisterEventBus = () => {
        this.subscriptions.unsubscribe();
    };

    private onCloseFeedback = (feedback: Feedback) => {
        const feedbacks = [...this.state.feedbacks];
        const index = feedbacks.findIndex((it) => it._id === feedback._id);
        if (index > -1) {
            feedbacks.splice(index, 1, feedback);
            this.setState({ feedbacks });
        }
    };

    private onUpdateFeedback = (feedback: Feedback) => {
        const feedbacks = [...this.state.feedbacks];
        const index = feedbacks.findIndex((it) => it._id === feedback._id);
        if (index > -1) {
            feedbacks.splice(index, 1);
            this.setState({ feedbacks });
        }
    };

    private onRemoveFeedback = (_id: string) => {
        const feedbacks = [...this.state.feedbacks];
        const index = feedbacks.findIndex((it) => it._id === _id);
        if (index > -1) {
            feedbacks.splice(index, 1);
            this.setState({ feedbacks });
        }
    };

    private fillData = async (afterId?: string) => {
        const res = await fetchFeedbacks(afterId);
        if (res.status === ApiStatus.SUCCESS) {
            if (afterId) {
                this.setState({
                    feedbacks: [...this.state.feedbacks, ...res.data!],
                    refreshing: false
                });
                this.allowLoadmore = res.data!.length > 0;
            } else {
                this.setState({ feedbacks: res.data || [], refreshing: false });
            }
        }
    };

    private keyExtractor = (item: Feedback): string => item._id;

    private renderItem: ListRenderItem<Feedback> = ({ item }) => {
        return <FeedbackItemComponent item={item} />;
    };

    private onCreateFeedbackPressed = () => {
        FeedbackCreateScreen.start();
    };

    private onRefresh = () => {
        this.allowLoadmore = true;
        this.setState({ refreshing: true });
        this.fillData();
    };

    private onEndReached = (): void => {
        if (!this.allowLoadmore || this.state.feedbacks.length === 0) return;
        const afterId = this.state.feedbacks[this.state.feedbacks.length - 1]
            ._id;
        this.fillData(afterId);
    };

    private renderCreateFeedback = () => {
        return (
            <TouchableOpacity onPress={this.onCreateFeedbackPressed}>
                <Image
                    style={{ width: 24, height: 24 }}
                    source={R.images.ic_plus}
                />
            </TouchableOpacity>
        );
    };

    private renderHeader = () => {
        if (
            GlobalVariable.user?.role === Role.STAFF ||
            (!GlobalVariable.user && GlobalVariable.isTestMode)
        ) {
            return (
                <HeaderComponent
                    renderRight={this.renderCreateFeedback()}
                    title={translate('title_feedbacks')}
                />
            );
        }
        return <HomeHeaderComponent title={translate('title_feedbacks')} />;
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
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {this.renderHeader()}
                <FlatList
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    data={this.state.feedbacks}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                />
            </View>
        );
    }
}
