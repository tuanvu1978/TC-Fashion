import { GlobalVariable } from 'constans/global-variable';
import FeedScreen from 'features/feed/feed.screen';
import HomeHeaderComponent from 'libraries/header/home-header.component';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { translate } from 'res/languages';
import R from 'res/R';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { EventBusName, EventPayload } from 'types/event-bus-type';
import { DimensionUtils } from 'utils/DimensionUtils';
import NewsListComponent from './components/news-list.component';

interface Props {}

interface State {
    isLogin: boolean;
    index: number;
    routes: { key: string; title: string }[];
}

export default class NewsScreen extends React.Component<Props, State> {
    private subscriptions = new Subscription();

    constructor(props: Props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {
                    key: 'feed',
                    title: GlobalVariable.isTestMode ? 'Chia sẻ' : 'Tin nội bộ'
                },
                { key: 'news', title: 'Tin tức mới' }
            ],
            isLogin: !!GlobalVariable.token
        };
    }

    async componentDidMount() {
        this.registerEventBus();
    }

    componentWillUnmount() {
        this.unregisterEventBus();
    }

    private registerEventBus = () => {
        this.subscriptions.add(
            EventBus.getInstance().events.subscribe(
                (data: EventPayload<any>) => {
                    switch (data.type) {
                        case EventBusName.LOGOUT_EVENT:
                            this.setState({
                                isLogin: false
                            });
                            break;

                        default:
                            break;
                    }
                }
            )
        );
    };

    private unregisterEventBus = () => {
        this.subscriptions.unsubscribe();
    };

    renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'feed':
                return <FeedScreen />;
            case 'news':
                return <NewsListComponent />;
            default:
                return null;
        }
    };

    private onIndexChanged = (index: number) => {
        this.setState({ index });
    };

    private renderContent() {
        if (this.state.isLogin) {
            return (
                <TabView
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            style={{ backgroundColor: 'white' }}
                            activeColor={R.colors.primaryColor}
                            inactiveColor="#ccc"
                            labelStyle={{ fontWeight: 'bold' }}
                            indicatorStyle={{
                                backgroundColor: R.colors.primaryColor,
                                height: 3
                            }}
                        />
                    )}
                    navigationState={{
                        index: this.state.index,
                        routes: this.state.routes
                    }}
                    renderScene={this.renderScene}
                    onIndexChange={this.onIndexChanged}
                    initialLayout={{
                        height: 0,
                        width: DimensionUtils.getScreenWidth()
                    }}
                />
            );
        }
        return <NewsListComponent />;
    }

    public render(): React.ReactNode {
        return (
            <View style={styles.wrapper}>
                <HomeHeaderComponent title={translate('label_news')} />

                {this.renderContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' }
});
