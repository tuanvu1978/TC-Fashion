import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import { View } from 'react-native';
import { translate } from 'res/languages';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import FeedScreen from './feed.screen';

interface Props {}

interface State {}

export default class MyFeedScreen extends React.Component<Props, State> {
    static start() {
        navigateToPage(ScreenName.MyFeedScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_my_posts')}
                />

                <FeedScreen isPrivate />
            </View>
        );
    }
}
