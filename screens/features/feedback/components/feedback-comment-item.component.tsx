import { GlobalVariable } from 'constans/global-variable';
import { User } from 'features/auth/type/user';
import * as React from 'react';
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { translate } from 'res/languages';
import R from 'res/R';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { Feedback } from '../type/feedback';
import { Reply } from '../type/reply';

interface Props {
    item: Reply;
    index: number;
    feedback?: Feedback;
}

interface State {}

export default class FeedbackCommentItemComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private renderReplyName = () => {
        const { item, feedback } = this.props;
        let label = '';
        if (item.createdBy === feedback?.createdBy) {
            label = `Người hỏi #${item?.creator?.employeeId}`;
        } else {
            label = `Người trả lời #${item?.creator?.employeeId}`;
        }
        return (
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
        );
    };

    public render(): React.ReactNode {
        const { item, index } = this.props;
        return (
            <View
                style={{
                    paddingHorizontal: 12,
                    marginTop: index === 0 ? 15 : 0
                }}
            >
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <FastImage
                        source={R.images.ic_avatar_default}
                        style={{ width: 35, height: 35 }}
                    />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        {this.renderReplyName()}
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
                        </View>
                    </View>
                </View>

                <View style={styles.dividerStyle} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dividerStyle: {
        height: 1,
        backgroundColor: '#DFDFDF',
        marginLeft: 45,
        marginVertical: 15
    }
});
