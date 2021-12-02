import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from 'res/R';

import { transformImageUrl } from 'utils/CommonUtils';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import SurveyDetailScreen from '../survey-detail.screen';
import { Survey } from '../type/survey';

interface Props {
    item: Survey;
}

interface State {}

export default class SurveyItemComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private onSurveyPressed = () => {
        SurveyDetailScreen.start(this.props.item._id);
    };

    public render(): React.ReactNode {
        const { item } = this.props;
        return (
            <TouchableOpacity
                onPress={this.onSurveyPressed}
                style={{ marginBottom: 8 }}
            >
                <FastImage
                    source={{
                        uri: transformImageUrl(item.image?.url)
                    }}
                    style={{ width: '100%', height: 200 }}
                />
                <View style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: R.colors.primaryColor,
                            fontWeight: '600'
                        }}
                    >
                        {item.title}
                    </Text>
                    <Text
                        style={{
                            color: '#606060',
                            fontSize: 12,
                            marginVertical: 5
                        }}
                    >
                        {DateTimeUtils.getTimeSpanByNow(item.createdAt)}
                    </Text>
                    <Text numberOfLines={3}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
