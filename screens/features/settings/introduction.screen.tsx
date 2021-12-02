import HeaderComponent from 'libraries/header/header.component';
import * as React from 'react';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    View
} from 'react-native';
import HTML from 'react-native-render-html';
import { translate } from 'res/languages';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import { transformImageUrl } from 'utils/CommonUtils';
import { DimensionUtils } from 'utils/DimensionUtils';
import { fetchIntroduction } from './setting.service';
import { Introduction } from './type/introduction';

interface Props {}

interface State {
    introduction?: Introduction;
}

export default class IntroductionScreen extends React.Component<Props, State> {
    static start() {
        navigateToPage(ScreenName.IntroductionScreen);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            introduction: undefined
        };
    }

    async componentDidMount() {
        const res = await fetchIntroduction();
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ introduction: res.data });
        }
    }

    private renderItem = (source: ImageSourcePropType, label?: string) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15
                }}
            >
                <Image style={{ width: 24, height: 24 }} source={source} />
                <Text
                    style={{
                        color: R.colors.primaryColor,
                        marginLeft: 8,
                        fontSize: 15
                    }}
                >
                    {label}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        const { introduction } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderComponent
                    showBackButton
                    title={translate('title_company_introduction')}
                />

                <ScrollView style={{ paddingHorizontal: 12 }}>
                    {!!introduction?.logo && (
                        <Image
                            resizeMode="contain"
                            style={{
                                alignSelf: 'center',
                                marginTop: 30,
                                width: DimensionUtils.getScreenWidth() - 160,
                                height: 120
                            }}
                            source={{
                                uri: transformImageUrl(introduction?.logo.url)
                            }}
                        />
                    )}

                    <Text
                        style={{
                            marginVertical: 20,
                            fontSize: 15,
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}
                    >
                        {introduction?.name}
                    </Text>

                    <HTML
                        containerStyle={{ marginBottom: 10 }}
                        source={{
                            html: introduction?.description || ''
                        }}
                        contentWidth={DimensionUtils.getScreenWidth()}
                    />

                    {this.renderItem(R.images.ic_phone, introduction?.phone)}
                    {this.renderItem(R.images.ic_email, introduction?.email)}
                    {this.renderItem(R.images.ic_web, introduction?.url)}
                </ScrollView>
            </View>
        );
    }
}
