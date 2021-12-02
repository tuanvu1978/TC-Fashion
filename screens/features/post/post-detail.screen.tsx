import { GlobalVariable } from 'constans/global-variable';
import { Position, Role } from 'features/auth/type/user';
import {
    fetchCommentList,
    sendComment
} from 'features/comment/comment.service';
import CommentItemComponent from 'features/comment/components/comment-item.component';
import { Comment, CommentType } from 'features/comment/type/comment';
import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
import * as React from 'react';
import { FlatList, ListRenderItem, Platform, Text, View } from 'react-native';
// @ts-ignore
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { translate } from 'res/languages';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import CommentInputComponent from '../comment/components/comment-input.component';
import PostComponent from './components/post.component';
import { fetchPostDetail } from './post.service';
import { Post } from './type/post';

interface Props {
    route: any;
}

interface State {
    post?: Post;
    comments: Comment[];
    refreshing: boolean;
    commentReplied?: Comment;
}

export default class PostDetailScreen extends React.Component<Props, State> {
    private commentInputRef = React.createRef<CommentInputComponent>();

    static start(_id: string) {
        navigateToPage(ScreenName.PostDetailScreen, { _id });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            comments: [],
            commentReplied: undefined,
            refreshing: false
        };
    }

    componentDidMount() {
        this.getPostData();
        this.getCommentData();
    }

    private onSendCommentPressed = async (content: string) => {
        if (!content) return;
        showLoading();

        let parentType = CommentType.POST;
        let parentId = this.state.post?._id;

        if (this.state.commentReplied) {
            parentType = CommentType.COMMENT;
            parentId = this.state.commentReplied._id;
        }

        const res = await sendComment({
            content,
            parentType,
            parentId
        });
        hideLoading();

        if (res.status === ApiStatus.SUCCESS) {
            if (this.state.commentReplied) {
                const comments = [...this.state.comments];

                const index = comments.findIndex(
                    (it) => it._id === this.state.commentReplied?._id
                );

                if (index >= 0) {
                    comments[index].commentCount =
                        comments[index].commentCount + 1;

                    this.onSeeMoreChildComment(
                        this.state.commentReplied,
                        index
                    );
                    this.setState({ commentReplied: undefined, comments });
                }
            } else {
                this.setState({
                    comments: [...this.state.comments, res.data!],
                    post: {
                        ...this.state.post!,
                        commentCount: (this.state.post?.commentCount || 0) + 1
                    }
                });
            }
        } else if (res.status === ApiStatus.FORBIDDEN) {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('comment_forbidden')
            });
        } else {
            ToastComponent.show({
                type: ToastType.ERROR,
                message: translate('comment_fail')
            });
        }
    };

    private onRemoveReplyMode = () => {
        this.setState({ commentReplied: undefined });
    };

    private async getPostData() {
        const _id = this.props.route.params._id;
        const res = await fetchPostDetail(_id);

        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ post: res.data, refreshing: false });
        }
    }

    private async getCommentData() {
        const _id = this.props.route.params._id;
        const res = await fetchCommentList({
            parentType: CommentType.POST,
            parentId: _id,
            limit: 20,
            commentReplyLimit: 0
        });
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ comments: res.data?.reverse() || [] });
        }
    }

    private onSeeMoreChildComment = async (comment: Comment, index: number) => {
        const res = await fetchCommentList({
            limit: 1000,
            parentType: CommentType.COMMENT,
            parentId: comment._id
        });

        if (res.status === ApiStatus.SUCCESS) {
            const comments = [...this.state.comments];
            const commentSelected = comments[index];
            commentSelected.comments = res.data || [];
            this.setState({ comments });
        }
    };

    private onSeeMoreCommentPressed = async () => {
        const _id = this.props.route.params._id;
        const res = await fetchCommentList({
            parentType: CommentType.POST,
            parentId: _id,
            limit: 20,
            afterId: this.state.comments[0]._id,
            commentReplyLimit: 0
        });
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({
                comments: [...res.data!.reverse(), ...this.state.comments]
            });
        }
    };

    private onHideChildComment = (index: number) => {
        const comments = [...this.state.comments];
        const commentSelected = comments[index];
        commentSelected.comments = [];
        this.setState({ comments });
    };

    private onReplyPressed = (comment: Comment) => () => {
        this.setState({ commentReplied: comment });
        this.commentInputRef.current?.focus();
    };

    private renderCommentInput = () => {
        if (!this.state.post) return null;

        if (
            GlobalVariable.user?.role === Role.CEO &&
            this.state.post.createdBy !== GlobalVariable.user?._id
        )
            return null;

        return (
            <CommentInputComponent
                ref={this.commentInputRef}
                onRemoveReplyMode={this.onRemoveReplyMode}
                commentReplied={this.state.commentReplied}
                onSendCommentPressed={this.onSendCommentPressed}
            />
        );
    };

    private renderPostDetail = () => {
        if (!this.state.post) return null;

        return (
            <View>
                <PostComponent post={this.state.post} isDetail />
                {this.state.comments.length < this.state.post.commentCount && (
                    <Text
                        onPress={this.onSeeMoreCommentPressed}
                        style={{ paddingHorizontal: 12, marginBottom: 15 }}
                    >
                        Xem bình luận cũ hơn
                    </Text>
                )}
            </View>
        );
    };

    private keyExtractor = (item: Comment, index: number): string => item._id;

    private renderItem: ListRenderItem<Comment> = ({ item, index }) => {
        return (
            <CommentItemComponent
                onHideChildComment={this.onHideChildComment}
                onSeeMoreChildComment={this.onSeeMoreChildComment}
                onReplyPressed={this.onReplyPressed}
                item={item}
                index={index}
            />
        );
    };

    private onRefresh = () => {
        this.setState({ refreshing: true });
        this.getPostData();
        this.getCommentData();
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={
                        GlobalVariable.isTestMode
                            ? 'Chi tiết chia sẻ'
                            : translate('title_post_detail')
                    }
                />

                {!!this.state.post && (
                    <FlatList
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        ListHeaderComponent={this.renderPostDetail}
                        data={this.state.comments}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                )}

                {this.renderCommentInput()}
                {Platform.OS === 'ios' && <KeyboardSpacer />}
            </View>
        );
    }
}
