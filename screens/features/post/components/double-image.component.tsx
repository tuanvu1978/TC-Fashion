import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from 'res/R';
import { Media } from 'types/Media';
import { transformImageUrl } from 'utils/CommonUtils';
import { DimensionUtils } from 'utils/DimensionUtils';

export interface DoubleImageProps {
    medias: Media[];
    onImagePressed?: any;
}

export interface DoubleImageState {}

export default class DoubleImageComponent extends React.Component<
    DoubleImageProps,
    DoubleImageState
> {
    shouldComponentUpdate(nextProps: DoubleImageProps) {
        if (
            JSON.stringify(this.props.medias) !==
            JSON.stringify(nextProps.medias)
        )
            return true;
        return false;
    }

    onPressed: any = (index: any) => () => {
        this.props.onImagePressed(index);
    };

    public render() {
        const image1 = transformImageUrl(this.props.medias[0].thumbnail);
        const image2 = transformImageUrl(this.props.medias[1].thumbnail);

        return (
            <View style={styles.containerStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.onPressed(0)}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <FastImage
                            resizeMode="cover"
                            style={styles.imageStyle}
                            source={{
                                uri: image1
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginLeft: 2 }}
                    activeOpacity={0.9}
                    onPress={this.onPressed(1)}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <FastImage
                            resizeMode="cover"
                            style={[styles.imageStyle]}
                            source={{
                                uri: image2
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        width: DimensionUtils.getScreenWidth() - 2,
        height: 187,
        flexDirection: 'row',
        marginTop: 1
    },
    imageStyle: {
        width: DimensionUtils.getScreenWidth() / 2 - 1,
        height: 187,
        backgroundColor: R.colors.bgOverlayImage
    }
});
