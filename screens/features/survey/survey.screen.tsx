import HomeHeaderComponent from 'libraries/header/home-header.component';
import * as React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { translate } from 'res/languages';
import { ApiStatus } from 'types/base.type';
import SurveyItemComponent from './components/survey-item.component';
import { fetchSurveys } from './survey.service';
import { Survey } from './type/survey';

interface Props {}

interface State {
    surveys: Survey[];
    refreshing: boolean;
}

export default class SurveyScreen extends React.Component<Props, State> {
    private allowLoadmore = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            surveys: [],
            refreshing: true
        };
    }

    async componentDidMount() {
        this.getSurveys();
    }

    private async getSurveys(afterId?: string) {
        const res = await fetchSurveys(afterId);
        if (res.status === ApiStatus.SUCCESS) {
            if (afterId) {
                this.setState({
                    surveys: [...this.state.surveys, ...res.data!],
                    refreshing: false
                });
                this.allowLoadmore = res.data!.length > 0;
            } else {
                this.setState({ surveys: res.data || [], refreshing: false });
            }
        }
    }

    private onRefresh = () => {
        this.allowLoadmore = true;
        this.setState({ refreshing: true });
        this.getSurveys();
    };

    private onEndReached = (): void => {
        if (!this.allowLoadmore || this.state.surveys.length === 0) return;
        const afterId = this.state.surveys[this.state.surveys.length - 1]._id;
        this.getSurveys(afterId);
    };

    private keyExtractor = (item: Survey, index: number): string => item._id;

    private renderItem: ListRenderItem<Survey> = ({ item, index }) => {
        return <SurveyItemComponent item={item} />;
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
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HomeHeaderComponent title={translate('title_survey')} />
                <FlatList
                    data={this.state.surveys}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={this.renderEmpty}
                />
            </View>
        );
    }
}
