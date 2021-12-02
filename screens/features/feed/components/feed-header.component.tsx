import { GlobalVariable } from 'constans/global-variable';
import PostCreateScreen from 'features/post/post-create.screen';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ImageSourcePropType
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { translate } from 'res/languages';
import R from 'res/R';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { EventBusName, EventPayload } from 'types/event-bus-type';
import { transformImageUrl } from 'utils/CommonUtils';

interface Props {}

interface State {}

export default class FeedHeaderComponent extends React.PureComponent<
    Props,
    State
> {
    private subscriptions = new Subscription();

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
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
                        case EventBusName.UPDATE_PROFILE_EVENT:
                            this.forceUpdate();
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

    private onHeaderPressed = () => {
        PostCreateScreen.start();
    };

    private onPhotoCreatorPressed = () => {
        PostCreateScreen.start(undefined, true);
    };

    private onPrivacyCreatorPressed = () => {
        PostCreateScreen.start(undefined, false, true);
    };

    public render(): React.ReactNode {
        const avatar: ImageSourcePropType = GlobalVariable.user?.avatar
            ? { uri: transformImageUrl(GlobalVariable.user?.avatar.thumbnail) }
            : R.images.ic_avatar_default;

        return (
            <TouchableOpacity
                onPress={this.onHeaderPressed}
                style={styles.wrapper}
            >
                <View style={styles.contentWrapper}>
                    <Image source={avatar} style={styles.imageStyle} />
                    <Text style={{ marginLeft: 12, fontSize: 15 }}>
                        {translate('label_post_create')}
                    </Text>
                </View>

                <View style={styles.actionWrapper}>
                    <TouchableOpacity
                        onPress={this.onPhotoCreatorPressed}
                        style={styles.actionContainerStyle}
                    >
                        <Image
                            source={R.images.ic_feed_photo}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Text>{translate('image')}</Text>
                    </TouchableOpacity>
                    <View style={styles.dividerStyle} />
                    <TouchableOpacity
                        onPress={this.onPrivacyCreatorPressed}
                        style={styles.actionContainerStyle}
                    >
                        <Image
                            source={R.images.ic_public}
                            style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                        <Text>{translate('public_privacy')}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
    },
    dividerStyle: {
        width: 1,
        height: 40,
        backgroundColor: '#DFDFDF'
    },
    actionContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionWrapper: {
        flexDirection: 'row',
        height: 40,
        borderTopColor: '#DFDFDF',
        borderTopWidth: 1
    },
    contentWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 15
    },
    wrapper: { backgroundColor: 'white', marginBottom: 8 }
});
