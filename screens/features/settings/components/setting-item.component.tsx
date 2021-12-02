import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import R from 'res/R';

interface Props {
    label: string;
    onPress?: () => void;
}

interface State {}

export default class SettingItemComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    paddingHorizontal: 12,
                    paddingVertical: 15,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Text style={{ fontSize: 15 }}>{this.props.label}</Text>
                <Image
                    source={R.images.ic_arrow_right}
                    style={{ width: 24, height: 24 }}
                />
            </TouchableOpacity>
        );
    }
}
