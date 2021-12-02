import {
    Gender,
    Position,
    transformGenderLabel,
    transformPositionLabel
} from 'features/auth/type/user';
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
    isVisible: boolean;
    onClosePopup: () => void;
    onPositionChange: (position: Position) => () => void;
}

interface State {}

const positions: Position[] = [
    Position.MANAGER,
    Position.OFFICER,
    Position.WORKER
];
export default class PositionPopup extends React.PureComponent<Props, State> {
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
                    {positions.map((position) => {
                        return (
                            <TouchableOpacity
                                key={position}
                                onPress={this.props.onPositionChange(position)}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 15
                                }}
                            >
                                <Text>{transformPositionLabel(position)}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Modal>
        );
    }
}
