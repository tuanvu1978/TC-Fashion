import { GlobalVariable } from 'constans/global-variable';
import { Role } from 'features/auth/type/user';
import MenuPostModal from 'features/post/components/menu-post.modal';
import PostComponent from 'features/post/components/post.component';
import PostCreateScreen from 'features/post/post-create.screen';
import { deletePost } from 'features/post/post.service';
import { Post } from 'features/post/type/post';
import PopupComponent from 'libraries/popup/popup.component';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { translate } from 'res/languages';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { ApiStatus } from 'types/base.type';
import { EventBusName, EventPayload } from 'types/event-bus-type';
import FirebaseUtils from 'utils/firebase.utils';
import FeedHeaderComponent from './components/feed-header.component';
import { fetchFeed } from './feed.service';

interface Props {
    isPrivate?: boolean;
}

interface State {
    posts: Post[];
    isMenuVisible: boolean;
    isDeleteVisible: boolean;
    postSelected?: Post;
    refreshing: boolean;
}

export default class FeedScreen extends React.Component<Props, State> {
    private subscriptions = new Subscription();

    private allowLoadmore = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            posts: [],
            refreshing: true,
            isMenuVisible: false,
            isDeleteVisible: false
        };
    }

    async componentDidMount() {
        this.registerEventBus();
        this.getFeed();
        FirebaseUtils.getInstance().init();
    }

    private async getFeed(afterId?: string) {
        const res = await fetchFeed({
            limit: 20,
            afterId,
            userId: this.props.isPrivate ? GlobalVariable.user?._id : undefined
        });
        if (res.status === ApiStatus.SUCCESS) {
            if (afterId) {
                this.setState({
                    posts: [...this.state.posts, ...res.data!],
                    refreshing: false
                });
                this.allowLoadmore = res.data!.length > 0;
            } else {
                this.setState({ posts: res.data || [], refreshing: false });
            }
        }
    }

    componentWillUnmount() {
        this.unregisterEventBus();
    }

    private registerEventBus = () => {
        this.subscriptions.add(
            EventBus.getInstance().events.subscribe(
                (data: EventPayload<any>) => {
                    switch (data.type) {
                        case EventBusName.CREATE_POST_EVENT:
                            this.setState({
                                posts: [data.payload, ...this.state.posts]
                            });
                            break;

                        case EventBusName.UPDATE_POST_EVENT:
                            this.onUpdatePost(data.payload);
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

    private onUpdatePost = (post: Post) => {
        const posts = [...this.state.posts];
        const findIndex = posts.findIndex((it) => it._id === post._id);

        if (findIndex > -1) {
            posts.splice(findIndex, 1, post);
            this.setState({ posts });
        }
    };

    private onEditPostPressed = () => {
        PostCreateScreen.start(this.state.postSelected);
        this.onClosePopup();
    };

    private onDeletePostPressed = () => {
        this.setState({ isMenuVisible: false });

        setTimeout(() => {
            this.setState({ isDeleteVisible: true });
        }, 500);
    };

    private onClosePopup = () => {
        this.setState({ isMenuVisible: false, postSelected: undefined });
    };

    private onMenuPressed = (post: Post) => () => {
        this.setState({ isMenuVisible: true, postSelected: post });
    };

    private onCloseDeletePopup = () => {
        this.setState({ isDeleteVisible: false, postSelected: undefined });
    };

    private onDeletePost = async () => {
        // Delete post here
        if (this.state.postSelected) {
            const res = await deletePost(this.state.postSelected?._id);
            if (res.status === ApiStatus.SUCCESS) {
                const posts = [...this.state.posts];
                const index = posts.findIndex(
                    (post) => post._id === this.state.postSelected?._id
                );
                if (index > -1) {
                    posts.splice(index, 1);
                    this.setState({ posts });
                    ToastComponent.show({
                        type: ToastType.SUCCESS,
                        message: translate('msg_delete_post_success')
                    });
                }
            }
        }

        this.onCloseDeletePopup();
    };

    private onRefresh = () => {
        this.allowLoadmore = true;
        this.setState({ refreshing: true });
        this.getFeed();
    };

    private onEndReached = (): void => {
        if (!this.allowLoadmore || this.state.posts.length === 0) return;
        const afterId = this.state.posts[this.state.posts.length - 1]._id;
        this.getFeed(afterId);
    };

    private keyExtractor = (item: Post): string => item._id;

    private renderItem: ListRenderItem<Post> = ({ item, index }) => {
        return (
            <PostComponent
                index={index}
                onMenuPressed={this.onMenuPressed}
                post={item}
            />
        );
    };

    private renderHeader = () => {
        if (
            !GlobalVariable.isTestMode &&
            GlobalVariable.user?.role === Role.STAFF
        )
            return null;

        if (this.props.isPrivate) return null;

        return <FeedHeaderComponent />;
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
            <View style={{ backgroundColor: '#ececec', flex: 1 }}>
                <FlatList
                    data={this.state.posts}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader}
                    ListEmptyComponent={this.renderEmpty}
                />

                <MenuPostModal
                    onDeletePost={this.onDeletePostPressed}
                    onEditPost={this.onEditPostPressed}
                    onClosePopup={this.onClosePopup}
                    isVisible={this.state.isMenuVisible}
                />

                <PopupComponent
                    ctaTextRight={translate('cta_delete_post')}
                    ctaLeftCallback={this.onCloseDeletePopup}
                    ctaRightCallback={this.onDeletePost}
                    onClosePopup={this.onCloseDeletePopup}
                    isVisible={this.state.isDeleteVisible}
                    message={translate('msg_delete_post')}
                />
            </View>
        );
    }
}
