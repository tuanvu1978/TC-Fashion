import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import R from 'res/R';
import { Subscription } from 'rxjs';
import EventBus from 'services/EventBus';
import { EventBusName, EventPayload } from 'types/event-bus-type';

export interface Props {
    tabSeleted: number;
    onTabPressed?: any;
    routes: any;
}

export interface States {
    detailUnreads: { feed: number; feedback: number; announcement: number };
}

export default class NotificationTabHeaderComponent extends React.PureComponent<
    Props,
    States
> {
    private subscriptions = new Subscription();

    constructor(props: Props) {
        super(props);
        this.state = {
            detailUnreads: { feed: 0, feedback: 0, announcement: 0 }
        };
    }

    componentDidMount() {
        this.registerEventBus();
    }

    componentWillUnmount() {
        this.unregisterEventBus();
    }

    private onUnreadChanged = (tab: 'FEED' | 'FEEDBACK' | 'ANNOUNCEMENT') => {
        if (tab === 'FEED') {
            if (this.state.detailUnreads.feed > 0) {
                this.setState({
                    detailUnreads: {
                        ...this.state.detailUnreads,
                        feed: this.state.detailUnreads.feed - 1
                    }
                });
            }
            return;
        }

        if (tab === 'FEEDBACK') {
            if (this.state.detailUnreads.feedback > 0) {
                this.setState({
                    detailUnreads: {
                        ...this.state.detailUnreads,
                        feedback: this.state.detailUnreads.feedback - 1
                    }
                });
            }
            return;
        }

        if (tab === 'ANNOUNCEMENT') {
            if (this.state.detailUnreads.announcement > 0) {
                this.setState({
                    detailUnreads: {
                        ...this.state.detailUnreads,
                        announcement: this.state.detailUnreads.announcement - 1
                    }
                });
            }
        }
    };

    private registerEventBus = () => {
        this.subscriptions.add(
            EventBus.getInstance().events.subscribe(
                (data: EventPayload<any>) => {
                    switch (data.type) {
                        case EventBusName.DETAIL_UNREAD_NOTI_EVENT:
                            this.setState({ detailUnreads: data.payload });
                            break;

                        case EventBusName.REMOVE_DETAIL_UNREAD_NOTI_EVENT:
                            this.onUnreadChanged(data.payload);
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

    private renderUnreadMessage = (route: any) => {
        const { detailUnreads } = this.state;
        let total = 0;
        switch (route.key) {
            case 'FEED':
                total = detailUnreads.feed;
                break;

            case 'FEEDBACK':
                total = detailUnreads.feedback;
                break;

            case 'ANNOUNCEMENT':
                total = detailUnreads.announcement;
                break;

            default:
                break;
        }

        if (total === 0) return null;

        return (
            <View style={styles.indicatorWrapper}>
                <Text
                    style={{
                        fontSize: 10,
                        color: 'white'
                    }}
                >
                    {total}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        return (
            <View>
                <View style={styles.tabBarContainerStyle}>
                    {this.props.routes.map((route: any, pFocus: number) => {
                        const { tabSeleted } = this.props;
                        const color =
                            pFocus === tabSeleted
                                ? R.colors.primaryColor
                                : '#9F9F9F';
                        const borderBottomColor =
                            pFocus === tabSeleted
                                ? R.colors.primaryColor
                                : '#EFEFEF';
                        return (
                            <TouchableOpacity
                                key={pFocus.toString()}
                                activeOpacity={1}
                                style={[
                                    styles.tabItemContainerStyle
                                    // { borderBottomWidth: 3, borderBottomColor }
                                ]}
                                onPress={this.props.onTabPressed(pFocus)}
                            >
                                <Text
                                    style={{
                                        color,
                                        textAlign: 'center',
                                        fontWeight: '600'
                                    }}
                                >
                                    {route.title}
                                </Text>
                                {pFocus === 0 && <View style={styles.border} />}
                                <View
                                    style={[
                                        styles.line,
                                        { backgroundColor: borderBottomColor }
                                    ]}
                                />

                                {this.renderUnreadMessage(route)}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    indicatorWrapper: {
        position: 'absolute',
        right: 18,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        zIndex: 10,
        top: 10,
        backgroundColor: 'red'
    },
    tabItemContainerStyle: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    tabBarContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45
    },
    txt: { textAlign: 'center', fontWeight: '600' },
    line: {
        height: 3,
        backgroundColor: R.colors.primaryColor,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 3
    },
    border: {
        width: 1,
        height: 16,
        backgroundColor: R.colors.white70,
        position: 'absolute',
        right: 0
    },
    bottomView: {
        backgroundColor: 'white',
        height: 60,
        borderTopLeftRadius: 20,
        marginBottom: -20
    }
});
