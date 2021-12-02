import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from 'res/R';
import { transformImageUrl } from 'utils/CommonUtils';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import NewsDetailScreen from '../news-detail.screen';
import { News } from '../type/news';

interface Props {
    item: News;
}

interface State {}

export default class NewsItemComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private onNewsPressed = () => {
        NewsDetailScreen.start(this.props.item._id);
    };

    public render(): React.ReactNode {
        const { item } = this.props;

        return (
            <TouchableOpacity
                onPress={this.onNewsPressed}
                style={styles.wrapper}
            >
                <Text style={styles.titleStyle}>{item.title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    {!!item.image && (
                        <FastImage
                            source={{
                                uri: transformImageUrl(item.image?.url)
                            }}
                            style={{ width: 150, height: 100, marginRight: 10 }}
                        />
                    )}
                    <View style={{ flex: 1 }}>
                        <View style={styles.timeWrapper}>
                            <Image
                                source={R.images.ic_time_news}
                                style={styles.timeIconStyle}
                            />
                            <Text style={{ fontSize: 13, color: '#606060' }}>
                                {DateTimeUtils.getTimeSpanByNow(item.createdAt)}
                            </Text>
                        </View>

                        <Text numberOfLines={4} style={{ marginTop: 8 }}>
                            {item.description}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeIconStyle: {
        width: 16,
        height: 16,
        marginRight: 3
    },
    titleStyle: {
        fontSize: 18,
        color: R.colors.primaryColor,
        marginBottom: 12
    },
    wrapper: {
        padding: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        width: '100%'
    }
});
