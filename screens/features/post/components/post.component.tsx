import { GlobalVariable } from 'constans/global-variable';
import { transformRoleLabel } from 'features/auth/type/user';
import ImageViewerModal from 'libraries/popup/image-viewer.modal';
import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import R from 'res/R';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import PostDetailScreen from '../post-detail.screen';
import { Post } from '../type/post';
import FeedPhotoComponent from './feed-photo.component';

interface Props {
    post: Post;
    index?: number;
    isDetail?: boolean;
    onMenuPressed?: (post: Post, index?: number) => () => void;
}

interface State {}

export default class PostComponent extends React.PureComponent<Props, State> {
    private imageViewerModal = React.createRef<ImageViewerModal>();

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private onImagePressed = (index: number) => {
        this.imageViewerModal?.current?.onShow(
            index,
            this.props.post.images || []
        );
    };

    private onPostPressed = () => {
        if (this.props.isDetail) return;
        PostDetailScreen.start(this.props.post._id);
    };

    private renderDotMenu = () => {
        const { post, index, isDetail } = this.props;
        if (isDetail) return null;

        if (post.createdBy !== GlobalVariable.user?._id) return null;
        return (
            <TouchableOpacity onPress={this.props.onMenuPressed?.(post, index)}>
                <Image
                    source={R.images.ic_dot_horizontal}
                    style={{ width: 24, height: 24 }}
                />
            </TouchableOpacity>
        );
    };

    public render(): React.ReactNode {
        const { post } = this.props;
        return (
            <TouchableOpacity
                onPress={this.onPostPressed}
                style={styles.wrapper}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: R.colors.primaryColor
                            }}
                        >
                            {post.title}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: 10
                            }}
                        >
                            <Text style={{ fontSize: 12, color: '#404040' }}>
                                {post.creator?.name} (
                                {transformRoleLabel(post.creator?.role)})
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#808080',
                                    marginLeft: 15
                                }}
                            >
                                {DateTimeUtils.getTimeSpanByNow(post.createdAt)}
                            </Text>
                        </View>
                    </View>

                    {this.renderDotMenu()}
                </View>

                <Text>{post.content}</Text>

                <View style={{ marginTop: 10 }}>
                    <FeedPhotoComponent
                        onImagePressed={this.onImagePressed}
                        post={post}
                    />
                </View>

                {!this.props.isDetail && (
                    <View style={styles.commentWrapper}>
                        <Text>Nhập bình luận</Text>
                    </View>
                )}

                <ImageViewerModal ref={this.imageViewerModal} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    commentWrapper: {
        width: '100%',
        marginTop: 12,
        height: 32,
        borderRadius: 16,
        paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: '#F7F7F7'
    },
    wrapper: {
        backgroundColor: 'white',
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 15
    }
});
