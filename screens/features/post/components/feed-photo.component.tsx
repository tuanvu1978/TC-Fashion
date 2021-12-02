import * as React from 'react';
import { Post } from '../type/post';

import DoubleImageComponent from './double-image.component';
import MultipleImagesComponent from './multiple-images.component';
import QuadrupleImageComponent from './quadruple-image.component';
import ScaleableImageComponent from './scalable-image.component';
import TripleImageComponent from './triple-image.component';

export interface FeedPhotoProps {
    // images?: string[];
    onImagePressed?: any;
    showThumbnail?: boolean;
    thumbnail?: string;
    post: Post;
}

export interface FeedPhotoState {}

export default class FeedPhotoComponent extends React.Component<
    FeedPhotoProps,
    FeedPhotoState
> {
    shouldComponentUpdate(nextProps: FeedPhotoProps) {
        if (this.props.showThumbnail !== nextProps.showThumbnail) return true;
        if (this.props.thumbnail !== nextProps.thumbnail) return true;
        if (
            this.props.post &&
            nextProps.post &&
            JSON.stringify(this.props.post.images) !==
                JSON.stringify(nextProps.post.images)
        )
            return true;

        return false;
    }

    public render() {
        const { showThumbnail, post } = this.props;

        if (!post.images || post.images.length === 0) return null;
        if (post.images.length === 1) {
            return (
                <ScaleableImageComponent
                    thumbnail={post.images[0].thumbnail}
                    image={post.images[0]}
                    onImagePressed={this.props.onImagePressed}
                    showThumbnail={showThumbnail}
                />
            );
        }

        if (post.images.length === 2) {
            return (
                <DoubleImageComponent
                    onImagePressed={this.props.onImagePressed}
                    medias={post.images}
                />
            );
        }

        if (post.images.length === 3) {
            return (
                <TripleImageComponent
                    onImagePressed={this.props.onImagePressed}
                    medias={post.images}
                />
            );
        }

        if (post.images.length === 4) {
            return (
                <QuadrupleImageComponent
                    onImagePressed={this.props.onImagePressed}
                    medias={post.images}
                />
            );
        }

        return (
            <MultipleImagesComponent
                onImagePressed={this.props.onImagePressed}
                medias={post.images}
            />
        );
    }
}
