import NewsListComponent from 'features/news/components/news-list.component';
import HomeHeaderComponent from 'libraries/header/home-header.component';
import * as React from 'react';
import { View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import R from 'res/R';
import { DimensionUtils } from 'utils/DimensionUtils';
import AnnouncementListComponent from './components/announcement-list.component';

interface Props {}

interface State {
    index: number;
    routes: { key: string; title: string }[];
}

export default class AnnouncementScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'NEW', title: 'Thông báo mới' },
                { key: 'POLICY', title: 'Chính sách nội quy' }
            ]
        };
    }

    renderScene = ({ route }: any) => {
        return <AnnouncementListComponent routeKey={route.key} />;
    };

    private onIndexChanged = (index: number) => {
        this.setState({ index });
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HomeHeaderComponent title="Thông báo" />

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
            </View>
        );
    }
}
