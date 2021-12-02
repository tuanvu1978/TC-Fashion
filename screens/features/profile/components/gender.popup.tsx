import { Gender, transformGenderLabel } from 'features/auth/type/user';
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
    isVisible: boolean;
    onClosePopup: () => void;
    onGenderChange: (gender: Gender) => () => void;
}

interface State {}

const genders: Gender[] = [Gender.MALE, Gender.FEMALE];
export default class GenderPopup extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <Modal
                onBackButtonPress={this.props.onClosePopup}
                onBackdropPress={this.props.onClosePopup}
                isVisible={this.props.isVisible}
            >
                <View style={{ backgroundColor: 'white' }}>
                    {genders.map((gender) => {
                        return (
                            <TouchableOpacity
                                key={gender}
                                onPress={this.props.onGenderChange(gender)}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 15
                                }}
                            >
                                <Text>{transformGenderLabel(gender)}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Modal>
        );
    }
}
