import { User } from 'features/auth/type/user';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import { translate } from 'res/languages';
import R from 'res/R';
import { DimensionUtils } from 'utils/DimensionUtils';
import { Comment } from '../type/comment';

interface Props {
    onSendCommentPressed: (content: string) => void;
    onRemoveReplyMode?: () => void;
    commentReplied?: Comment;
}

interface State {
    sendDisable: boolean;
}

export default class CommentInputComponent extends React.PureComponent<
    Props,
    State
> {
    private content = '';

    private inputRef = React.createRef<TextInput>();

    constructor(props: Props) {
        super(props);
        this.state = {
            sendDisable: true
        };
    }

    focus() {
        this.inputRef?.current?.focus();
    }

    private onChangeText = (text: string) => {
        this.content = text;
        this.setState({ sendDisable: text.length === 0 });
    };

    private onPressed = () => {
        this.props.onSendCommentPressed(this.content);
        this.content = '';
        this.inputRef.current?.clear();
    };

    private renderUserReplied = () => {
        if (!this.props.commentReplied?.creator) return null;

        return (
            <View style={styles.replyWrapper}>
                <TouchableOpacity
                    onPress={this.props.onRemoveReplyMode}
                    style={{ padding: 5 }}
                >
                    <Image
                        style={{ width: 18, height: 18 }}
                        source={R.images.ic_delete_image}
                    />
                </TouchableOpacity>

                <Text style={{ marginLeft: 10 }}>
                    Trả lời: {this.props.commentReplied?.creator?.name}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        return (
            <View style={styles.wrapper}>
                {this.renderUserReplied()}
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={this.inputRef}
                        onChangeText={this.onChangeText}
                        placeholderTextColor="#ccc"
                        style={{ flex: 1, color: 'black' }}
                        placeholder={translate('enter_comment')}
                    />
                    <TouchableOpacity
                        onPress={this.onPressed}
                        style={{ padding: 5 }}
                    >
                        <Image
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: this.state.sendDisable
                                    ? '#ccc'
                                    : R.colors.primaryColor
                            }}
                            source={R.images.ic_post_create}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    replyWrapper: {
        marginHorizontal: 15,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputWrapper: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 15,
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: '#F7F7F7'
    },
    wrapper: {
        width: '100%',
        // position: 'absolute',
        // bottom: 0,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: DimensionUtils.getBottomSpace() + 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6
    }
});
