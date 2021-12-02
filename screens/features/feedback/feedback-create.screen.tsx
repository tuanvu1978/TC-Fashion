import { GlobalVariable } from 'constans/global-variable';
import ProfileDropdownComponent from 'features/profile/components/profile-dropdown.component';
import ProfileInputComponent from 'features/profile/components/profile-input.component';
import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import PopupComponent from 'libraries/popup/popup.component';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { goBack, navigateToPage } from 'routing/service-navigation';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName } from 'types/event-bus-type';
import FeedbackCaseModal from './components/feedback-case.modal';
import FeedbackQuestionModal from './components/feedback-question.modal';
import { createFeedback, updateFeedback } from './feedback.service';
import { Case } from './type/case';
import {
    CreateFeedbackInput,
    Feedback,
    FeedbackType,
    transformFeedbackTypeLabel
} from './type/feedback';

interface Props {
    route: any;
}

interface State {
    isFeedbackCaseVisibile: boolean;
    isFeedbackTypeVisibile: boolean;
    caseSelected?: Case;
    subCase?: string;
    title: string;
    content: string;
    feedbackType?: FeedbackType;
}

export default class FeedbackCreateScreen extends React.Component<
    Props,
    State
> {
    static start(feedback?: Feedback) {
        navigateToPage(ScreenName.FeedbackCreateScreen, { feedback });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            isFeedbackCaseVisibile: false,
            isFeedbackTypeVisibile: false,
            caseSelected: undefined,
            feedbackType: undefined,
            subCase: undefined,
            title: '',
            content: ''
        };
    }

    componentDidMount() {
        this.fillData();
    }

    private fillData() {
        const feedback: Feedback = this.props.route?.params?.feedback;

        if (!feedback) return;

        this.setState({
            title: feedback.title,
            content: feedback.content,
            feedbackType: feedback.type,
            caseSelected: feedback.case,
            subCase: feedback.caseName
        });
    }

    private onSendFeedback = async () => {
        const {
            title,
            content,
            feedbackType,
            caseSelected,
            subCase
        } = this.state;

        if (title.trim().length === 0) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('title_invalid')
            });
            return;
        }

        if (content.trim().length === 0 || content.length > 2000) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('content_invalid')
            });
            return;
        }

        if (!feedbackType) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('type_invalid')
            });
            return;
        }

        if (!caseSelected) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('case_invalid')
            });
            return;
        }

        let caseName = caseSelected.name;

        if (subCase) {
            caseName = subCase;
        }

        const feedback: Feedback = this.props.route?.params?.feedback;

        const data: CreateFeedbackInput = {
            title,
            content,
            type: feedbackType,
            caseId: caseSelected._id,
            caseName
        };
        showLoading();

        if (feedback) {
            data._id = feedback._id;
            this.editFeedback(data);
        } else {
            this.createFeedback(data);
        }
    };

    private async createFeedback(data: CreateFeedbackInput) {
        const res = await createFeedback(data);
        hideLoading();

        if (res.status === ApiStatus.SUCCESS) {
            EventBus.getInstance().post({
                type: EventBusName.CREATE_FEEDBACK_EVENT,
                payload: res.data
            });
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('create_feedback_success')
            });
            goBack();
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('create_feedback_fail')
            });
        }
    }

    private async editFeedback(data: CreateFeedbackInput) {
        const res = await updateFeedback(data);
        hideLoading();

        if (res.status === ApiStatus.SUCCESS) {
            EventBus.getInstance().post({
                type: EventBusName.UPDATE_FEEDBACK_EVENT,
                payload: res.data
            });
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('update_feedback_success')
            });
            goBack();
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('update_feedback_fail')
            });
        }
    }

    private onShowCasePopup = () => {
        this.setState({ isFeedbackCaseVisibile: true });
    };

    private onCloseFeedbackCasePopup = () => {
        this.setState({ isFeedbackCaseVisibile: false });
    };

    private onShowFeedbackTypePopup = () => {
        this.setState({ isFeedbackTypeVisibile: true });
    };

    private onCloseFeedbackTypePopup = () => {
        this.setState({ isFeedbackTypeVisibile: false });
    };

    private onFeedbackCaseSelected = (item: Case, subCase?: string) => {
        this.setState({
            caseSelected: item,
            subCase,
            isFeedbackCaseVisibile: false
        });
    };

    private onFeedbackTypeSelected = (type: FeedbackType) => () => {
        this.setState({ feedbackType: type });
        this.onCloseFeedbackTypePopup();
    };

    private getCaseName = () => {
        if (!this.state.caseSelected) return '';

        if (this.state.subCase) return this.state.subCase;

        return this.state.caseSelected.name;
    };

    private onChangeTitle = (text: string) => {
        this.setState({ title: text });
    };

    private onChangeContent = (text: string) => {
        this.setState({ content: text });
    };

    public render(): React.ReactNode {
        const feedback: Feedback = this.props.route?.params?.feedback;

        let ctaLabel = 'send_feedback';
        if (feedback) {
            ctaLabel = 'update_feedback';
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('add_feedback')}
                />

                <ScrollView style={{ paddingHorizontal: 12 }}>
                    <ProfileInputComponent
                        value={this.state.title}
                        onChangeText={this.onChangeTitle}
                        containerStyle={{ marginTop: 20 }}
                        label={translate('label_title')}
                    />
                    <ProfileInputComponent
                        onChangeText={this.onChangeContent}
                        multiline
                        value={this.state.content}
                        numberOfLines={5}
                        containerStyle={{ marginTop: 20, maxHeight: 180 }}
                        label={translate('label_content')}
                    />

                    {/* <ProfileInputComponent
                        editable={false}
                        value={GlobalVariable.user?.department?.name}
                        containerStyle={{ marginTop: 20 }}
                        label={translate('label_faculty')}
                    /> */}

                    <ProfileDropdownComponent
                        onPress={this.onShowFeedbackTypePopup}
                        editable
                        value={transformFeedbackTypeLabel(
                            this.state.feedbackType
                        )}
                        containerStyle={{ marginTop: 20 }}
                        label={translate('label_feedback_type')}
                    />

                    <ProfileDropdownComponent
                        onPress={this.onShowCasePopup}
                        editable
                        value={this.getCaseName()}
                        containerStyle={{ marginTop: 20 }}
                        label={translate('label_case_feedback')}
                    />

                    <TouchableOpacity
                        onPress={this.onSendFeedback}
                        style={styles.sendFeedbackStyle}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {translate(ctaLabel)}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                <FeedbackCaseModal
                    onFeedbackCaseSelected={this.onFeedbackCaseSelected}
                    isVisible={this.state.isFeedbackCaseVisibile}
                    onClosePopup={this.onCloseFeedbackCasePopup}
                />

                <FeedbackQuestionModal
                    typeSelected={this.state.feedbackType}
                    onFeedbackTypeSelected={this.onFeedbackTypeSelected}
                    isVisible={this.state.isFeedbackTypeVisibile}
                    onClosePopup={this.onCloseFeedbackTypePopup}
                />

                {/* 
message: string;
    ctaTextLeft?: string;
    ctaLeftCallback: () => void;
    ctaTextRight: string;
    ctaRightCallback: () => void;
    isVisible: boolean;
    onClosePopup: () => void; */}
                {/* <PopupComponent 
                    message='Mọi chỉnh sửa '
                /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sendFeedbackStyle: {
        height: 40,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: R.colors.primaryColor,
        borderRadius: 5,
        marginTop: 40
    }
});
