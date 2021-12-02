import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import AuthButtonComponent from 'features/auth/components/auth-button.componen';
import R from 'res/R';

interface Props {
    isVisible: boolean;
    onClosePopup: () => void;
    onDateChange: (date: Date) => void;
}

interface State {
    date: Date;
}

export default class DatePickerPopup extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    private onDateChange = (date: Date) => {
        this.setState({ date });
    };

    private onSelectPressed = () => {
        this.props.onDateChange(this.state.date);
    };

    public render(): React.ReactNode {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={this.props.onClosePopup}
                onBackButtonPress={this.props.onClosePopup}
            >
                <View style={{ backgroundColor: 'white' }}>
                    <DatePicker
                        locale="vi"
                        mode="date"
                        maximumDate={new Date()}
                        date={this.state.date}
                        onDateChange={this.onDateChange}
                    />

                    <TouchableOpacity
                        onPress={this.onSelectPressed}
                        style={styles.buttonWrapper}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Lựa chọn
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    buttonWrapper: {
        backgroundColor: R.colors.primaryColor,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
