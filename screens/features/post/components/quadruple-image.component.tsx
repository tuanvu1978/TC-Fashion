import * as React from 'react';
import { View } from 'react-native';
import { Media } from 'types/Media';
import DoubleImageComponent from './double-image.component';

export interface QuadrupleImageProps {
    medias: Media[];
    onImagePressed?: any;
}

export interface QuadrupleImageState {}

export default class QuadrupleImageComponent extends React.Component<
    QuadrupleImageProps,
    QuadrupleImageState
> {
    constructor(props: QuadrupleImageProps) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps: QuadrupleImageProps) {
        if (
            JSON.stringify(this.props.medias) !==
            JSON.stringify(nextProps.medias)
        )
            return true;
        return false;
    }

    onAdditionImagePressed = (index: number) => {
        this.props.onImagePressed(index + 2);
    };

    onPressed: any = (index: any) => {
        this.props.onImagePressed(index);
    };

    public render() {
        return (
            <View>
                <DoubleImageComponent
                    onImagePressed={this.onPressed}
                    medias={this.props.medias.slice(0, 2)}
                />
                <DoubleImageComponent
                    onImagePressed={this.onAdditionImagePressed}
                    medias={this.props.medias.slice(2, 4)}
                />
            </View>
        );
    }
}
