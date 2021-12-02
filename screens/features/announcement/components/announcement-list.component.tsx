import * as React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { translate } from 'res/languages';
import { ApiStatus } from 'types/base.type';
import { fetchAnnouncements } from '../announcement.service';

import { Announcement } from '../type/announcement';
import AnnouncementItemComponent from './announcement-item.component';

interface Props {
    routeKey: 'POLICY' | 'NEW';
}

interface State {
    announcements: Announcement[];
    refreshing: boolean;
}

export default class AnnouncementListComponent extends React.PureComponent<
    Props,
    State
> {
    private allowLoadmore = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            announcements: [],
            refreshing: true
        };
    }

    componentDidMount() {
        this.getAnnouncements();
    }

    private async getAnnouncements(after?: string) {
        const res = await fetchAnnouncements(this.props.routeKey, after);
        if (res.status === ApiStatus.SUCCESS) {
            if (after) {
                this.setState({
                    announcements: [...this.state.announcements, ...res.data!],
                    refreshing: false
                });
                this.allowLoadmore = res.data!.length > 0;
            } else {
                this.setState({
                    announcements: res.data || [],
                    refreshing: false
                });
            }
        }
    }

    private onRefresh = () => {
        this.allowLoadmore = true;
        this.setState({ refreshing: true });
        this.getAnnouncements();
    };

    private onEndReached = (): void => {
        if (!this.allowLoadmore || this.state.announcements.length === 0)
            return;
        const afterId = this.state.announcements[
            this.state.announcements.length - 1
        ]._id;
        this.getAnnouncements(afterId);
    };

    private keyExtractor = (item: Announcement): string => item._id;

    private renderItem: ListRenderItem<Announcement> = ({ item }) => {
        return <AnnouncementItemComponent item={item} />;
    };

    private renderEmpty = () => {
        if (this.state.refreshing) return null;
        return (
            <View style={{ marginTop: 120, alignSelf: 'center' }}>
                <Text style={{ fontSize: 15 }}>
                    {translate('no_data_available')}
                </Text>
            </View>
        );
    };

    public render(): React.ReactNode {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    data={this.state.announcements}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                />
            </View>
        );
    }
}
