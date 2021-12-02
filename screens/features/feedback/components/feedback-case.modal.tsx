import AuthButtonComponent from 'features/auth/components/auth-button.componen';
import PopupComponent from 'libraries/popup/popup.component';
import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    Image
} from 'react-native';
import Modal from 'react-native-modal';
import R from 'res/R';
import { ApiStatus } from 'types/base.type';
import { DimensionUtils } from 'utils/DimensionUtils';
import { fetchFeedbackCases } from '../feedback.service';
import { Case } from '../type/case';

interface Props {
    isVisible: boolean;
    onClosePopup: () => void;
    onFeedbackCaseSelected: (item: Case, subCase?: string) => void;
}

interface State {
    cases: Case[];
    caseSelected?: Case;
    subItem?: string;
}

export default class FeedbackCaseModal extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            cases: [],
            caseSelected: undefined,
            subItem: undefined
        };
    }

    async componentDidMount() {
        const res = await fetchFeedbackCases();
        if (res.status === ApiStatus.SUCCESS) {
            this.setState({ cases: res.data || [] });
        }
    }

    private onItemPressed = (item: Case, subItem?: string) => () => {
        this.setState({ caseSelected: item, subItem });
    };

    private onFeedbackCaseSelected = () => {
        if (!this.state.caseSelected) return;

        this.props.onFeedbackCaseSelected(
            this.state.caseSelected,
            this.state.subItem
        );

        this.setState({ caseSelected: undefined, subItem: undefined });
    };

    private onClosePopup = () => {
        this.props.onClosePopup();
        this.setState({ caseSelected: undefined, subItem: undefined });
    };

    private keyExtractor = (item: Case, index: number): string => item._id;

    private renderItem: ListRenderItem<Case> = ({ item, index }) => {
        const parentSelected =
            !this.state.subItem && item._id === this.state.caseSelected?._id;

        return (
            <View style={{ paddingVertical: 12, paddingHorizontal: 12 }}>
                <TouchableOpacity
                    onPress={this.onItemPressed(item)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Image
                        source={
                            parentSelected
                                ? R.images.ic_checked
                                : R.images.ic_uncheck
                        }
                        style={styles.checkboxStyle}
                    />
                    <Text>{item.name}</Text>
                </TouchableOpacity>
                {item.subCases.map((it) => {
                    const childSelected =
                        !!this.state.subItem && it === this.state.subItem;
                    return (
                        <TouchableOpacity
                            onPress={this.onItemPressed(item, it)}
                            style={styles.subWrapper}
                        >
                            <Image
                                source={
                                    childSelected
                                        ? R.images.ic_checked
                                        : R.images.ic_uncheck
                                }
                                style={styles.checkboxStyle}
                            />
                            <Text>{it}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    public render(): React.ReactNode {
        return (
            <Modal
                onBackdropPress={this.onClosePopup}
                onBackButtonPress={this.onClosePopup}
                isVisible={this.props.isVisible}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        maxHeight: DimensionUtils.getScreenHeight() / 1.8
                    }}
                >
                    <FlatList
                        extraData={[
                            this.state.cases,
                            this.state.caseSelected,
                            this.state.subItem
                        ]}
                        data={this.state.cases}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />

                    <TouchableOpacity
                        onPress={this.onFeedbackCaseSelected}
                        style={styles.selectButtonWrapper}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>
                            Lựa chọn
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    selectButtonWrapper: {
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: R.colors.primaryColor
    },
    checkboxStyle: {
        width: 22,
        height: 22,
        marginRight: 8
    },
    subWrapper: {
        marginLeft: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
