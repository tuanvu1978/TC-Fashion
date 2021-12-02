import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { goBack, navigateToPage } from 'routing/service-navigation';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName } from 'types/event-bus-type';
import { Media } from 'types/media';
import { DimensionUtils } from 'utils/DimensionUtils';
import ImageCreatorComponent from './components/image-creator.component';
import PostCreatorComponent from './components/post-creator.component';
import PostPrivacyComponent from './components/post-privacy.component';
import PrivacyPopup, { privacyList } from './components/privacy.popup';
import { createPost, updatePost } from './post.service';
import { CreatePostInput, Post, Privacy } from './type/post';

interface Props {
    route: any;
}

interface State {
    popupVisible: boolean;
    privacy: Privacy;
    title: string;
    content: string;
}

export default class PostCreateScreen extends React.Component<Props, State> {
    private imageCreatorRef = React.createRef<ImageCreatorComponent>();

    static start(post?: Post, openPhoto?: boolean, openPrivacy?: boolean) {
        navigateToPage(ScreenName.PostCreateScreen, {
            post,
            openPhoto,
            openPrivacy
        });
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            popupVisible: false,
            privacy: privacyList[0],
            title: '',
            content: ''
        };
    }

    componentDidMount() {
        this.fillData();

        const openPhoto = this.props.route?.params?.openPhoto;
        const openPrivacy = this.props.route?.params?.openPrivacy;
        if (openPhoto) {
            this.imageCreatorRef.current?.onSelectImagePressed();
        } else if (openPrivacy) {
            this.setState({ popupVisible: true });
        }
    }

    private fillData = () => {
        const post: Post = this.props.route?.params?.post;

        if (!post) return;

        const privacy =
            privacyList.find((it) => it.type === post.privacy) ||
            privacyList[0];
        this.setState({ title: post.title, content: post.content, privacy });
        this.imageCreatorRef.current?.setImages(post.images);
    };

    private onPrivacyPressed = () => {
        this.setState({ popupVisible: true });
    };

    private onClosePopup = () => {
        this.setState({ popupVisible: false });
    };

    private onPrivacySelected = (privacy: Privacy) => () => {
        this.setState({ popupVisible: false, privacy });
    };

    private onTitleChange = (text: string) => {
        this.setState({ title: text });
    };

    private onContentChange = (text: string) => {
        this.setState({ content: text });
    };

    private onUpdatePost = async (data: CreatePostInput) => {
        const res = await updatePost(data);
        hideLoading();
        if (res.status === ApiStatus.SUCCESS) {
            EventBus.getInstance().post({
                type: EventBusName.UPDATE_POST_EVENT,
                payload: res.data
            });
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('msg_edit_post_success')
            });
            goBack();
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_update_fail')
            });
        }
    };

    private onCreatePost = async (data: CreatePostInput) => {
        const res = await createPost(data);
        hideLoading();
        if (res.status === ApiStatus.SUCCESS) {
            EventBus.getInstance().post({
                type: EventBusName.CREATE_POST_EVENT,
                payload: res.data
            });
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: translate('msg_create_post_success')
            });
            goBack();
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_create_fail')
            });
        }
    };

    private onCreatePostPressed = async () => {
        const { title, privacy, content } = this.state;

        const post: Post = this.props.route?.params?.post;

        const imageIds = this.imageCreatorRef.current?.getImages();

        if (!title || !content) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('msg_error_validate_post')
            });
            return;
        }

        const data: CreatePostInput = {
            title,
            content,
            status: privacy.type,
            imageIds
        };

        showLoading();
        if (!post) {
            this.onCreatePost(data);
        } else {
            data._id = post._id;
            this.onUpdatePost(data);
        }
    };

    private renderRight = () => {
        return (
            <TouchableOpacity onPress={this.onCreatePostPressed}>
                <Image
                    resizeMode="contain"
                    style={{ width: 26, height: 26 }}
                    source={R.images.ic_post_create}
                />
            </TouchableOpacity>
        );
    };

    public render(): React.ReactNode {
        return (
            <View style={styles.wrapper}>
                <HeaderComponent
                    showBackButton
                    renderRight={this.renderRight()}
                    title={translate('title_create_post')}
                />

                <ScrollView style={{ paddingHorizontal: 12 }}>
                    <PostPrivacyComponent
                        privacy={this.state.privacy}
                        onPrivacyPressed={this.onPrivacyPressed}
                    />
                    <PrivacyPopup
                        onPrivacySelected={this.onPrivacySelected}
                        isVisible={this.state.popupVisible}
                        onClosePopup={this.onClosePopup}
                    />

                    <PostCreatorComponent />

                    <TextInput
                        placeholderTextColor="#ccc"
                        onChangeText={this.onTitleChange}
                        value={this.state.title}
                        style={styles.inputTitleStyle}
                        placeholder={translate('label_title')}
                    />

                    <TextInput
                        onChangeText={this.onContentChange}
                        value={this.state.content}
                        multiline
                        style={styles.inputContentStyle}
                        placeholderTextColor="#ccc"
                        placeholder={translate('label_content')}
                    />

                    <ImageCreatorComponent ref={this.imageCreatorRef} />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContentStyle: {
        marginTop: 20,
        minHeight: 100,
        textAlignVertical: 'top',
        maxHeight:
            DimensionUtils.getScreenHeight() -
            400 -
            DimensionUtils.getBottomSpace()
    },
    inputTitleStyle: {
        marginTop: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'white'
    }
});
