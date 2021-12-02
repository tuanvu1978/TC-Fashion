import * as React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import R from 'res/R';

interface Props {
    value?: string;
    editable?: boolean;
    label: string;
    disable?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    imageRight?: ImageSourcePropType;
    onPress?: () => void;
}

interface State {}

export default class ProfileDropdownComponent extends React.PureComponent<
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
            <TouchableOpacity
                onPress={this.props.onPress}
                style={this.props.containerStyle}
            >
                <Text
                    style={{ color: disable && editable ? '#BDBCBC' : '#111' }}
                >
                    {this.props.label}
                </Text>

                <View style={styles.inputWrapper}>
                    <Text
                        style={{
                            flex: 1,
                            color: disable && editable ? '#DFDFDF' : '#111'
                        }}
                    >
                        {this.props.value}
                    </Text>

                    {this.props.editable && !this.props.disable && (
                        <Image
                            resizeMode="contain"
                            source={
                                this.props.imageRight || R.images.ic_arrow_right
                            }
                            style={{ width: 24, height: 24 }}
                        />
                    )}
                </View>
            </TouchableOpacity>
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
