import * as React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { translate } from 'res/languages';
import { ApiStatus } from 'types/base.type';
import { fetchNews } from '../news.service';
import { News } from '../type/news';
import NewsItemComponent from './news-item.component';

interface Props {}

interface State {
    news: News[];
    refreshing: boolean;
}

export default class NewsListComponent extends React.PureComponent<
    Props,
    State
> {
    private allowLoadmore = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            news: [],
            refreshing: true
        };
    }

    componentDidMount() {
        this.getNews();
    }

    private async getNews(afterId?: string) {
        const res = await fetchNews<News[]>({ limit: 20, afterId });
        if (res.status === ApiStatus.SUCCESS) {
            if (afterId) {
                this.setState({
                    news: [...this.state.news, ...res.data!],
                    refreshing: false
                });
                this.allowLoadmore = res.data!.length > 0;
            } else {
                this.setState({ news: res.data || [], refreshing: false });
            }
        }
    }

    private onRefresh = () => {
        this.allowLoadmore = true;
        this.setState({ refreshing: true });
        this.getNews();
    };

    private onEndReached = (): void => {
        if (!this.allowLoadmore || this.state.news.length === 0) return;
        const afterId = this.state.news[this.state.news.length - 1]._id;
        this.getNews(afterId);
    };

    private keyExtractor = (item: News): string => item._id;

    private renderItem: ListRenderItem<News> = ({ item }) => {
        return <NewsItemComponent item={item} />;
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
            <View style={{ flex: 1 }}>
                <FlatList
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    data={this.state.news}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                />
            </View>
        );
    }
}
