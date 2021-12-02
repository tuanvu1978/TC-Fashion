import { GlobalVariable } from 'constans/global-variable';
import { UserStatus } from 'features/auth/type/user';
import * as React from 'react';
import {
    FlatList,
    Image,
    ImageSourcePropType,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { translate } from 'res/languages';
import R from 'res/R';
import { transformImageUrl } from 'utils/CommonUtils';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { Comment } from '../type/comment';

interface Props {
    index: number;
    item: Comment;
    isChild?: boolean;
    onSeeMoreChildComment?: (comment: Comment, index: number) => void;
    onReplyPressed?: (comment: Comment) => () => void;
    onHideChildComment?: (index: number) => void;
}

interface State {}

export default class CommentItemComponent extends React.Component<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private onSeeMoreChildComment = async () => {
        if (this.props.item.comments.length === 0) {
            this.props.onSeeMoreChildComment?.(
                this.props.item,
                this.props.index
            );
        } else {
            this.props.onHideChildComment?.(this.props.index);
        }
    };

    private keyExtractor = (item: Comment, index: number): string => item._id;

    private renderItem: ListRenderItem<Comment> = ({ item, index }) => {
        return <CommentItemComponent index={index} isChild item={item} />;
    };

    private renderReply = () => {
        const { item } = this.props;

        if (this.props.isChild) return null;

        return (
            <TouchableOpacity
                onPress={this.props.onReplyPressed?.(item)}
                style={{ padding: 5 }}
            >
                <Text
                    style={{
                        fontSize: 11,
                        color: '#808080',
                        marginLeft: 15
                    }}
                >
                    Trả lời
                </Text>
            </TouchableOpacity>
        );
    };

    private renderSeeMoreComment = () => {
        const { item } = this.props;
        if (!item.commentCount || item.commentCount <= 0) return null;

        let message = translate('msg_see_more_comment', {
            number: item.commentCount
        });

        if (item.comments.length > 0) {
            message = translate('msg_hide_comment', {
                number: item.commentCount
            });
        }

        return (
            <Text
                onPress={this.onSeeMoreChildComment}
                style={{ marginTop: 8, fontSize: 12 }}
            >
                {message}
            </Text>
        );
    };

    public render(): React.ReactNode {
        const { item } = this.props;

        const avatar: ImageSourcePropType = item.creator?.avatar
            ? { uri: transformImageUrl(item.creator?.avatar.thumbnail) }
            : R.images.ic_avatar_default;

        return (
            <View
                style={{
                    paddingHorizontal: 12,
                    marginTop: this.props.index === 0 ? 10 : 0
                }}
            >
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <Image source={avatar} style={styles.avatarStyle} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                marginBottom: 5,
                                textDecorationLine:
                                    item.creator?.status === UserStatus.LOCKED
                                        ? 'line-through'
                                        : 'none'
                            }}
                        >
                            {item.creator?.name}
                        </Text>
                        <Text>{item.content}</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 3
                            }}
                        >
                            <Text style={{ fontSize: 11, color: '#808080' }}>
                                {DateTimeUtils.getTimeSpanByNow(item.createdAt)}
                            </Text>
                            {this.renderReply()}
                        </View>

                        {this.renderSeeMoreComment()}

                        {!!item.comments && item.comments.length > 0 && (
                            <FlatList
                                data={item.comments}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.dividerStyle} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    avatarStyle: {
        width: 34,
        height: 34,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
        borderRadius: 17
    },
    dividerStyle: {
        height: 1,
        backgroundColor: '#DFDFDF',
        marginLeft: 45,
        marginVertical: 15
    }
});
