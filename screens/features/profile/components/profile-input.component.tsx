import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    KeyboardTypeOptions,
    Image,
    StyleProp,
    ViewStyle
} from 'react-native';
import R from 'res/R';

interface Props {
    value?: string;
    label: string;
    multiline?: boolean;
    numberOfLines?: number;
    onChangeText?: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    editable?: boolean;
    disable?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

interface State {}

export default class ProfileInputComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const { disable, editable } = this.props;
        return (
            <View style={this.props.containerStyle}>
                <Text
                    style={{ color: disable && editable ? '#BDBCBC' : '#111' }}
                >
                    {this.props.label}
                </Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        onChangeText={this.props.onChangeText}
                        numberOfLines={this.props.numberOfLines}
                        multiline={this.props.multiline}
                        value={this.props.value}
                        style={{
                            textAlignVertical: this.props.multiline
                                ? 'top'
                                : 'center',
                            flex: 1,
                            paddingVertical: 0,
                            color: disable && editable ? '#DFDFDF' : '#111'
                        }}
                        editable={editable}
                        keyboardType={this.props.keyboardType}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,

        borderBottomWidth: 1,
        borderBottomColor: '#dadada',

        paddingBottom: 5
    }
});
