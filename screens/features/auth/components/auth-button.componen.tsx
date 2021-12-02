import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import R from 'res/R';

interface Props {
    onPress: () => void;
    label: string;
    disabled?: boolean;
}

interface State {}

export default class AuthButtonComponent extends React.PureComponent<
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
                disabled={this.props.disabled}
                onPress={this.props.onPress}
                style={[
                    styles.buttonLoginWrapper,
                    {
                        backgroundColor: this.props.disabled
                            ? '#DFDFDF'
                            : R.colors.primaryColor
                    }
                ]}
            >
                <Text
                    style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}
                >
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    buttonLoginWrapper: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        borderRadius: 5
    }
});
