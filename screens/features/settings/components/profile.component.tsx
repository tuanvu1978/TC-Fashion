import { GlobalVariable } from 'constans/global-variable';
import { transformRoleLabel } from 'features/auth/type/user';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ImageSourcePropType
} from 'react-native';
import R from 'res/R';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { EventBusName, EventPayload } from 'types/event-bus-type';
import { transformImageUrl } from 'utils/CommonUtils';

interface Props {}

interface State {}

export default class ProfileComponent extends React.PureComponent<
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

    public render(): React.ReactNode {
        const avatar: ImageSourcePropType = GlobalVariable.user?.avatar
            ? { uri: transformImageUrl(GlobalVariable.user?.avatar.thumbnail) }
            : R.images.ic_avatar_default;

        return (
            <View style={{ padding: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={avatar} style={styles.imageStyle} />
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '600',
                                color: R.colors.primaryColor,
                                marginBottom: 5
                            }}
                        >
                            {GlobalVariable.user?.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: R.colors.primaryColor
                            }}
                        >
                            {transformRoleLabel(GlobalVariable.user?.role)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width: 80,
        height: 80,
        marginRight: 12,
        borderWidth: 1,
        borderRadius: 40,
        borderColor: 'rgba(0,0,0,0.03)'
    }
});
