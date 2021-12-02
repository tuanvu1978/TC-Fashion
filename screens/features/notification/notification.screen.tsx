import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import { View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { translate } from 'res/languages';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { DimensionUtils } from 'utils/DimensionUtils';
import NotificationListComponent from './components/notification-list.component';
import NotificationTabHeaderComponent from './components/notification-tab-header.component';

interface Props {}

interface State {
    index: number;
    routes: { key: string; title: string }[];
}

export default class NotificationScreen extends React.Component<Props, State> {
    static start() {
        navigateToPage(ScreenName.NotificationScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'FEED', title: 'Bản tin' },
                { key: 'FEEDBACK', title: 'Phản ánh' },
                { key: 'ANNOUNCEMENT', title: 'Nội bộ' }
            ]
        };
    }

    renderScene = ({ route }: any) => {
        return <NotificationListComponent routeKey={route.key} />;
    };

    private onTabPressed = (nextFocus: number) => () => {
        if (this.state.index !== nextFocus) {
            this.setState({ index: nextFocus });
        }
    };

    renderTabBar = (): React.ReactElement => (
        <NotificationTabHeaderComponent
            routes={this.state.routes}
            tabSeleted={this.state.index}
            onTabPressed={this.onTabPressed}
        />
    );

    private onIndexChanged = (index: number) => {
        this.setState({ index });
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_notification')}
                />

                <TabView
                    renderTabBar={this.renderTabBar}
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
