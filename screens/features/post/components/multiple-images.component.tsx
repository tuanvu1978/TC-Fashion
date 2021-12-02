import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from 'res/R';
import { Media } from 'types/Media';
import { transformImageUrl } from 'utils/CommonUtils';
import { DimensionUtils } from 'utils/DimensionUtils';
import TripleImageComponent from './triple-image.component';

export interface MultipleImagesProps {
    medias: Media[];
    onImagePressed?: any;
}

export interface MultipleImagesState {}

const IMAGE_HEIGHT = 249;
export default class MultipleImagesComponent extends React.Component<
    MultipleImagesProps,
    MultipleImagesState
> {
    constructor(props: MultipleImagesProps) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps: MultipleImagesProps) {
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

    onAdditionImagePressed = (index: number) => {
        this.props.onImagePressed(1 + index);
    };

    public render() {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.onPressed(0)}
                    style={{
                        marginBottom: 1,
                        backgroundColor: R.colors.bgOverlayImage
                    }}
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
                                width: DimensionUtils.getScreenWidth(),
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

                <TripleImageComponent
                    onImagePressed={this.onAdditionImagePressed}
                    medias={this.props.medias.slice(
                        1,
                        this.props.medias.length
                    )}
                />
            </View>
        );
    }
}
