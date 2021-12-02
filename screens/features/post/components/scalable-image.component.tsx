import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Media } from 'types/media';
import { transformImageUrl } from 'utils/CommonUtils';
import { DimensionUtils } from 'utils/DimensionUtils';

interface Dimension {
    width: number;
    height: number;
}

export interface ScaleableImageProps {
    image: Media;
    onImagePressed?: any;
    index?: number;
    thumbnail?: string;
    showThumbnail?: boolean;
}

export interface ScaleableImageState {}

export default class ScaleableImageComponent extends React.Component<
    ScaleableImageProps,
    ScaleableImageState
> {
    constructor(props: ScaleableImageProps) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps: ScaleableImageProps) {
        if (
            JSON.stringify(this.props.image) !== JSON.stringify(nextProps.image)
        ) {
            return true;
        }

        if (this.props.index !== nextProps.index) return true;
        if (this.props.thumbnail !== nextProps.thumbnail) return true;

        return false;
    }

    onPressed: any = (index: any) => () => {
        this.props.onImagePressed?.(index);
    };

    getDimension() {
        const { width, height } = this.props.image;
        if (width && height) {
            let heightImg = (DimensionUtils.getScreenWidth() * height) / width;

            if (heightImg > DimensionUtils.getScreenHeight()) {
                heightImg = DimensionUtils.getScreenHeight();
            }

            return {
                width: DimensionUtils.getScreenWidth(),
                height: heightImg
            };
        }

        return {
            width: DimensionUtils.getScreenWidth(),
            height: DimensionUtils.getScreenHeight()
        };
    }

    public render() {
        const dimension = this.getDimension();
        const uri = transformImageUrl(this.props.image.url);
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.onPressed(0)}
                style={{ backgroundColor: '#F8F8F8' }}
            >
                <View style={[dimension, { alignSelf: 'center' }]}>
                    <FastImage
                        style={[dimension, { backgroundColor: '#e5e5e5' }]}
                        source={{ uri }}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center'
    }
});
