import { GlobalVariable } from 'constans/global-variable';
import { Role } from 'features/auth/type/user';
import CommentInputComponent from 'features/comment/components/comment-input.component';
import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import PopupComponent from 'libraries/popup/popup.component';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import {
    FlatList,
    Image,
    ListRenderItem,
    Platform,
    TouchableOpacity,
    View
} from 'react-native';
// @ts-ignore
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { goBack, navigateToPage } from 'routing/service-navigation';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName, EventPayload } from 'types/event-bus-type';
import FeedbackCommentItemComponent from './components/feedback-comment-item.component';
import FeedbackDetailComponent from './components/feedback-detail.component';
import FeedbackMenuPopup from './components/feedback-menu.popup';
import FeedbackCreateScreen from './feedback-create.screen';
import {
    closeFeedback,
    fetchFeedbackDetail,
    removeFeedback,
    sendCommentFeedback
} from './feedback.service';
import { Feedback, FeedbackStatus } from './type/feedback';
import { Reply } from './type/reply';

interface Props {
    route: any;
}

interface State {
    isMenuVisible: boolean;
    refreshing: boolean;
    feedback?: Feedback;
    isCloseConfirmPopupVisible: boolean;
    isDeleteConfirmPopupVisible: boolean;
}

export default class FeedbackDetailScreen extends React.Component<
    Props,
    State
> {
    private commentInputRef = React.createRef<CommentInputComponent>();

    private subscriptions = new Subscription();

    static start(id: string) {
        if (!id) return;
        navigateToPage(ScreenName.FeedbackDetailScreen, { id });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            feedback: undefined,
            isMenuVisible: false,
            refreshing: false,
            isCloseConfirmPopupVisible: false,
            isDeleteConfirmPopupVisible: false
        };
    }

    componentDidMount() {
        this.getData();
        this.registerEventBus();
    }

    componentWillUnmount() {
        this.unregisterEventBus();
    }

    private async getData() {
        const id = this.props.route?.params?.id;
        const res = await fetchFeedbackDetail(id);
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ feedback: res.data, refreshing: false });
        }
    }

    private registerEventBus = () => {
        this.subscriptions.add(
            EventBus.getInstance().events.subscribe(
                (data: EventPayload<any>) => {
                    switch (data.type) {
                        case EventBusName.UPDATE_FEEDBACK_EVENT:
                            this.onUpdateFeedback(data.payload);
                            break;

                        default:
                            break;
                    }
                }
            )
        );
    };

    private onUpdateFeedback = (feedback: Feedback) => {
        this.setState({ feedback });
    };

    private unregisterEventBus = () => {
        this.subscriptions.unsubscribe();
    };

    private keyExtractor = (item: Reply, index: number): string => item._id;

    private renderItem: ListRenderItem<Reply> = ({ item, index }) => {
        return (
            <FeedbackCommentItemComponent
                feedback={this.state.feedback}
                index={index}
                item={item}
            />
        );
    };

    private renderHeader = () => {
        return <FeedbackDetailComponent feedback={this.state.feedback} />;
    };

    private onSendCommentPressed = async (content: string) => {
        if (!this.state.feedback) return;

        showLoading();
        const res = await sendCommentFeedback({
            feedbackId: this.state.feedback?._id,
            content
        });
        hideLoading();

        if (res.status === ApiStatus.SUCCESS) {
            const reply = res.data;

            const replies = [...this.state.feedback.replies, reply];
            const updatedFeedback = { ...this.state.feedback, replies };

            this.setState({ feedback: updatedFeedback });
        }
    };

    private renderCommentInput = () => {
        if (
            GlobalVariable.isTestMode ||
            !this.state.feedback ||
            this.state.feedback?.status === FeedbackStatus.CLOSED
        )
            return null;
        return (
            <CommentInputComponent
                ref={this.commentInputRef}
                onSendCommentPressed={this.onSendCommentPressed}
            />
        );
    };

    private renderMenuRight = () => {
        if (
            GlobalVariable.user?.role === Role.STAFF &&
            this.state.feedback?.status === FeedbackStatus.CLOSED
        )
            return <View />;

        return (
            <TouchableOpacity onPress={this.onMenuPressed}>
                <Image
                    source={R.images.ic_dot_horizontal}
                    style={{ width: 24, height: 24, tintColor: 'white' }}
                />
            </TouchableOpacity>
        );
    };

    private onMenuPressed = () => {
        this.setState({ isMenuVisible: true });
    };

    private onClosePopup = () => {
        this.setState({ isMenuVisible: false });
    };

    private onCloseFeedbackPressed = () => {
        this.onClosePopup();

        setTimeout(() => {
            this.setState({ isCloseConfirmPopupVisible: true });
        }, 500);
    };

    private onCloseConfirmPopup = () => {
        this.setState({ isCloseConfirmPopupVisible: false });
    };

    private onCloseFeedback = async () => {
        this.onCloseConfirmPopup();
        const id = this.props.route?.params?.id;
        const res = await closeFeedback(id);
        if (res.status === ApiStatus.SUCCESS) {
            EventBus.getInstance().post({
                type: EventBusName.CLOSE_FEEDBACK_EVENT,
                payload: res.data
            });
            this.setState({
                // @ts-ignore
                feedback: {
                    ...this.state.feedback,
                    status: FeedbackStatus.CLOSED
                }
            });
        }
    };

    private onEditFeedback = () => {
        this.onClosePopup();
        FeedbackCreateScreen.start(this.state.feedback);
    };

    private onDeleteFeedbackPressed = () => {
        this.onClosePopup();

        setTimeout(() => {
            this.setState({ isDeleteConfirmPopupVisible: true });
        }, 500);
    };

    private onCloseDeleteConfirmPopup = () => {
        this.setState({ isDeleteConfirmPopupVisible: false });
    };

    private onDeleteFeedback = async () => {
        const id = this.props.route?.params?.id;
        this.onCloseDeleteConfirmPopup();
        const res = await removeFeedback(id);
        if (res.status === ApiStatus.SUCCESS) {
            EventBus.getInstance().post({
                type: EventBusName.REMOVE_FEEDBACK_EVENT,
                payload: id
            });
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('delete_feedback_success')
            });

            goBack();
        } else {
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('delete_feedback_fail')
            });
        }
    };

    private onRefresh = () => {
        this.getData();
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    renderRight={this.renderMenuRight()}
                    showBackButton
                    title={translate('title_feedback_detail')}
                />

                {!!this.state.feedback && (
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        extraData={this.state.feedback}
                        data={this.state.feedback.replies}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.renderHeader}
                    />
                )}

                {this.renderCommentInput()}
                {Platform.OS === 'ios' && <KeyboardSpacer />}

                <FeedbackMenuPopup
                    feedback={this.state.feedback}
                    onCloseFeedback={this.onCloseFeedbackPressed}
                    onEditFeedback={this.onEditFeedback}
                    onDeleteFeedback={this.onDeleteFeedbackPressed}
                    onClosePopup={this.onClosePopup}
                    isVisible={this.state.isMenuVisible}
                />

                <PopupComponent
                    isVisible={this.state.isCloseConfirmPopupVisible}
                    ctaTextRight={translate('cta_closed')}
                    onClosePopup={this.onCloseConfirmPopup}
                    ctaRightCallback={this.onCloseFeedback}
                    ctaLeftCallback={this.onCloseConfirmPopup}
                    message={translate('msg_close_feedback')}
                />

                <PopupComponent
                    isVisible={this.state.isDeleteConfirmPopupVisible}
                    ctaTextRight={translate('cta_delete')}
                    onClosePopup={this.onCloseDeleteConfirmPopup}
                    ctaRightCallback={this.onDeleteFeedback}
                    ctaLeftCallback={this.onCloseDeleteConfirmPopup}
                    message={translate('msg_delete_feedback')}
                />
            </View>
        );
    }
}
