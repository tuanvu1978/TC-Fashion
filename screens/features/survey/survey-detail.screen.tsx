import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
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
import SurveyQuizScreen from './survey-quiz.screen';
import { fetchSurveyDetail, markSurveyAsTaken } from './survey.service';
import { Survey } from './type/survey';

interface Props {
    route: any;
}

interface State {
    survey?: Survey;
}

export default class SurveyDetailScreen extends React.Component<Props, State> {
    static start(_id: string) {
        navigateToPage(ScreenName.SurveyDetailScreen, { _id });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            survey: undefined
        };
    }

    async componentDidMount() {
        const _id = this.props.route?.params?._id;
        const res = await fetchSurveyDetail<Survey>(_id);
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ survey: res.data });
        }
    }

    private onDoSurveyPressed = () => {
        markSurveyAsTaken(this.state.survey?._id);
        SurveyQuizScreen.start(this.state.survey!);
    };

    private renderContent = () => {
        const { survey } = this.state;
        if (!survey) {
            return (
                <View style={{ marginTop: 100, alignSelf: 'center' }}>
                    <ActivityIndicator size="small" />
                </View>
            );
        }

        return (
            <>
                <Text style={styles.titleStyle}>{survey?.title}</Text>
                <View style={styles.timeWrapper}>
                    <Image
                        source={R.images.ic_time_news}
                        style={styles.timeIconStyle}
                    />
                    <Text style={{ fontSize: 13, color: '#606060' }}>
                        {DateTimeUtils.getTimeSpanByNow(survey?.createdAt)}
                    </Text>
                </View>

                <Text
                    style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}
                >
                    {survey?.description}
                </Text>

                <HTML
                    containerStyle={{ marginTop: 15 }}
                    source={{ html: survey?.content || '' }}
                    contentWidth={DimensionUtils.getScreenWidth()}
                />
            </>
        );
    };

    public render(): React.ReactNode {
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
                    title={translate('title_survey_detail')}
                />
                <ScrollView style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                    {this.renderContent()}
                </ScrollView>

                <TouchableOpacity
                    onPress={this.onDoSurveyPressed}
                    style={styles.buttonWrapper}
                >
                    <Text style={styles.labelButtonStyle}>
                        {translate('survey_now')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    labelButtonStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    buttonWrapper: {
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: R.colors.primaryColor,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
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
