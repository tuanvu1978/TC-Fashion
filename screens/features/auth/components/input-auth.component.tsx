import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    KeyboardTypeOptions,
    Image,
    StyleProp,
    ViewStyle,
    Platform
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import R from 'res/R';

interface Props {
    label: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    onPasswordVisibilityPressed?: () => void;
    onTextChange?: (text: string) => void;
    onSubmit?: () => void;
}

interface State {
    visiblePassword: boolean;
}

export default class InputAuthComponent extends React.PureComponent<
    Props,
    State
> {
    private textInputRef = React.createRef<TextInput>();

    constructor(props: Props) {
        super(props);
        this.state = {
            visiblePassword: false
        };
    }

    focus() {
        this.textInputRef.current?.focus();
    }

    private onPasswordVisibilityPressed = () => {
        this.setState({
            visiblePassword: !this.state.visiblePassword
        });
    };

    public render(): React.ReactNode {
        return (
            <View style={this.props.containerStyle}>
                <Text>{this.props.label}</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={this.textInputRef}
                        onSubmitEditing={this.props.onSubmit}
                        secureTextEntry={
                            this.props.secureTextEntry &&
                            !this.state.visiblePassword
                        }
                        style={{
                            flex: 1,
                            paddingVertical: 0
                        }}
                        autoCapitalize="none"
                        onChangeText={this.props.onTextChange}
                        keyboardType={this.props.keyboardType}
                    />
                    {this.props.secureTextEntry && (
                        <TouchableOpacity
                            onPress={this.onPasswordVisibilityPressed}
                        >
                            <Image
                                resizeMode="contain"
                                style={{ width: 20, height: 20 }}
                                source={
                                    this.state.visiblePassword
                                        ? R.images.ic_eye_active
                                        : R.images.ic_eye_inactive
                                }
                            />
                        </TouchableOpacity>
                    )}
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

        paddingBottom: Platform.OS === 'ios' ? 5 : 0
    }
});
