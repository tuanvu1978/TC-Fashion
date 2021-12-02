import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    ListRenderItem,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { translate } from 'res/languages';
import R from 'res/R';
import { DimensionUtils } from 'utils/DimensionUtils';
import { Privacy, PrivacyType } from '../type/post';

interface Props {
    isVisible: boolean;
    onClosePopup: () => void;
    onPrivacySelected: (privacy: Privacy) => () => void;
}

interface State {}

export const privacyList: Privacy[] = [
    {
        icon: R.images.ic_public,
        name: 'public',
        type: PrivacyType.PUBLIC
    },
    {
        icon: R.images.ic_draft,
        name: 'draft',
        type: PrivacyType.DRAFT
    }
];

export default class PrivacyPopup extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private keyExtractor = (item: Privacy, index: number): string =>
        index.toString();

    private renderItem: ListRenderItem<Privacy> = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={this.props.onPrivacySelected(item)}
                style={styles.wrapper}
            >
                <Image
                    style={{ width: 20, height: 20, tintColor: '#111' }}
                    source={item.icon}
                />
                <Text style={{ marginHorizontal: 10, fontSize: 15 }}>
                    {translate(item.name)}
                </Text>
            </TouchableOpacity>
        );
    };

    public render(): React.ReactNode {
        return (
            <Modal
                onBackdropPress={this.props.onClosePopup}
                onBackButtonPress={this.props.onClosePopup}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                isVisible={this.props.isVisible}
            >
                <View
                    style={{
                        paddingVertical: 10,
                        backgroundColor: 'white',
                        paddingBottom: DimensionUtils.getBottomSpace()
                    }}
                >
                    <FlatList
                        data={privacyList}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15
    }
});
