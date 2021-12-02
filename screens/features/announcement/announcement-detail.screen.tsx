import { downloadFile } from 'features/media/media.service';
import HeaderComponent from 'libraries/header/header.component';
import { hideLoading, showLoading } from 'libraries/loading/loading-modal';
import ToastComponent, { ToastType } from 'libraries/toast/toast.component';
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
import FileViewer from 'react-native-file-viewer';
import R from 'res/R';
import * as ScreenName from 'routing/screen-name';
import { navigateToPage } from 'routing/service-navigation';
import { ApiStatus } from 'types/base.type';
import { getFileName } from 'utils/CommonUtils';
import { DateTimeUtils } from 'utils/DateTimeUtils';
import { DimensionUtils } from 'utils/DimensionUtils';
import { detailAnnouncement } from './announcement.service';
import { Announcement, File } from './type/announcement';

interface Props {
    route: any;
}

interface State {
    announcement?: Announcement;
}

export default class AnnouncementDetailScreen extends React.Component<
    Props,
    State
> {
    static start(_id: string) {
        if (!_id) return;
        navigateToPage(ScreenName.AnnouncementDetailScreen, { _id });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            announcement: undefined
        };
    }

    async componentDidMount() {
        const _id = this.props.route?.params?._id;
        const res = await detailAnnouncement<Announcement>(_id);
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ announcement: res.data });
        }
    }

    private onDownloadFile = (file: File) => async () => {
        showLoading();
        const res = await downloadFile(file.url!);
        hideLoading();
        if (res && res.path()) {
            ToastComponent.show({
                type: ToastType.SUCCESS,
                message: `Tài liệu được lưu tại ${res.path()}`
            });

            FileViewer.open(res.path());
        }
    };

    private renderContent = () => {
        const { announcement } = this.state;
        if (!announcement) {
            return (
                <View style={{ marginTop: 100, alignSelf: 'center' }}>
                    <ActivityIndicator size="small" />
                </View>
            );
        }

        return (
            <>
                <Text style={styles.titleStyle}>{announcement?.title}</Text>
                <View style={styles.timeWrapper}>
                    <Image
                        source={R.images.ic_time_news}
                        style={styles.timeIconStyle}
                    />
                    <Text style={{ fontSize: 13, color: '#606060' }}>
                        {DateTimeUtils.getTimeSpanByNow(
                            announcement?.lastAnnounceAt
                        )}
                    </Text>
                </View>

                <Text
                    style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}
                >
                    {announcement?.description}
                </Text>

                <HTML
                    containerStyle={{ marginTop: 15 }}
                    source={{ html: announcement?.content || '' }}
                    contentWidth={DimensionUtils.getScreenWidth()}
                />

                {this.state.announcement?.attachFiles &&
                    this.state.announcement?.attachFiles?.length > 0 && (
                        <View style={{ marginTop: 30 }}>
                            <Text style={{ fontSize: 15 }}>File đính kèm</Text>
                            {this.state.announcement?.attachFiles.map(
                                (file) => {
                                    return (
                                        <Text
                                            onPress={this.onDownloadFile(file)}
                                            style={{
                                                color: 'blue',
                                                marginTop: 5,
                                                paddingVertical: 10,
                                                textDecorationLine: 'underline'
                                            }}
                                        >
                                            {getFileName(file.url)}
                                        </Text>
                                    );
                                }
                            )}
                        </View>
                    )}
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
                    title={translate('title_announcement_detail')}
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
