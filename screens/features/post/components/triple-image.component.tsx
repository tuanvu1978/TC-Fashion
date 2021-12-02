import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from 'res/R';
import { Media } from 'types/Media';
import { transformImageUrl } from 'utils/CommonUtils';
import { DimensionUtils } from 'utils/DimensionUtils';

export interface TripleImageProps {
    medias: Media[];
    onImagePressed?: any;
}

export interface TripleImageState {}

const IMAGE_HEIGHT = 123;

export default class TripleImageComponent extends React.Component<
    TripleImageProps,
    TripleImageState
> {
    constructor(props: TripleImageProps) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps: TripleImageProps) {
        if (
            JSON.stringify(this.props.medias) !==
            JSON.stringify(nextProps.medias)
        )
            return true;
        return false;
    }

    renderLastImage() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.onPressed(2)}
                style={styles.imageSizeStyle}
            >
                <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <FastImage
                        resizeMode="cover"
                        style={[styles.imageSizeStyle, styles.marginImage]}
                        source={{
                            uri: transformImageUrl(
                                this.props.medias[2].thumbnail
                            )
                        }}
                    />
                </View>

                {this.props.medias.length > 3 && (
                    <View style={styles.backdropStyle}>
                        <Text style={styles.numberLeftTextStyle}>
                            +{this.props.medias.length - 2}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    onPressed: any = (index: any) => () => {
        this.props.onImagePressed(index);
    };

    public render() {
        return (
            <View style={styles.imageRowSecondContainer}>
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
                            style={{
                                width: DimensionUtils.getScreenWidth() / 3,
                                height: IMAGE_HEIGHT
                            }}
                            source={{
                                uri: transformImageUrl(
                                    this.props.medias[0].thumbnail
                                )
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
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
                            style={[styles.imageSizeStyle, styles.marginImage]}
                            source={{
                                uri: transformImageUrl(
                                    this.props.medias[1].thumbnail
                                )
                            }}
                        />
                    </View>
                </TouchableOpacity>

                {this.renderLastImage()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageRowSecondContainer: {
        width: DimensionUtils.getScreenWidth() - 3,
        height: IMAGE_HEIGHT,
        flexDirection: 'row'
    },
    numberLeftTextStyle: { color: 'white', fontSize: 30, fontWeight: 'bold' },
    backdropStyle: {
        position: 'absolute',
        width: DimensionUtils.getScreenWidth() / 3 - 1,
        height: IMAGE_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginLeft: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    imageSizeStyle: {
        width: DimensionUtils.getScreenWidth() / 3 - 1,
        height: IMAGE_HEIGHT,
        backgroundColor: R.colors.bgOverlayImage
    },

    marginImage: {
        marginLeft: 1
    }
});
