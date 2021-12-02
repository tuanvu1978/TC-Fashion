import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { translate } from 'res/languages';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { Survey } from './type/survey';

interface Props {
    route: any;
}

interface State {}

export default class SurveyQuizScreen extends React.Component<Props, State> {
    static start(survey: Survey) {
        navigateToPage(ScreenName.SurveyQuizScreen, { survey });
    }

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const survey: Survey = this.props.route?.params?.survey;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_survey_detail')}
                />
                <WebView
                    style={{ flex: 1 }}
                    source={{ uri: survey.surveyUrl }}
                />
            </View>
        );
    }
}
