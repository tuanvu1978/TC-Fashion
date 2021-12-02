import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import HTML from 'react-native-render-html';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { DimensionUtils } from 'utils/DimensionUtils';
import { fetchNewsDetail } from './news.service';
import { News } from './type/news';

interface Props {
    route: any;
}

interface State {
    news?: News;
}

export default class NewsDetailScreen extends React.Component<Props, State> {
    static start(_id: string) {
        navigateToPage(ScreenName.NewsDetailScreen, { _id });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            news: undefined
        };
    }

    async componentDidMount() {
        const _id = this.props.route?.params?._id;
        const res = await fetchNewsDetail<News>(_id);
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ news: res.data });
        }
    }

    private renderContent = () => {
        const { news } = this.state;
        if (!news) {
            return (
                <View style={{ marginTop: 100, alignSelf: 'center' }}>
                    <ActivityIndicator size="small" />
                </View>
            );
        }

        return (
            <>
                <Text style={styles.titleStyle}>{news?.title}</Text>
                <View style={styles.timeWrapper}>
                    <Image
                        source={R.images.ic_time_news}
                        style={styles.timeIconStyle}
                    />
                    <Text style={{ fontSize: 13, color: '#606060' }}>
                        {DateTimeUtils.getTimeSpanByNow(news?.createdAt)}
                    </Text>
                </View>

                <Text
                    style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}
                >
                    {news?.description}
                </Text>

                <HTML
                    containerStyle={{ marginTop: 15 }}
                    source={{ html: news?.content || '' }}
                    contentWidth={DimensionUtils.getScreenWidth()}
                />
            </>
        );
    };

    public render(): React.ReactNode {
        const { news } = this.state;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    paddingBottom: DimensionUtils.getBottomSpace()
                }}
            >
                <HeaderComponent
                    showBackButton
                    title={translate('title_news_detail')}
                />
                <ScrollView style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                    {this.renderContent()}
                </ScrollView>
            </View>
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
    }
});
