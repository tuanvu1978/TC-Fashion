import { uploadImage } from 'features/media/media.service';
import * as React from 'react';
import {
    FlatList,
    Image,
    ListRenderItem,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { translate } from 'res/languages';
import R from 'res/R';
import { ApiStatus } from 'types/base.type';
import { Media } from 'types/media';
import { transformImageUrl } from 'utils/CommonUtils';

interface Props {}

interface State {
    images: Media[];
}

export default class ImageCreatorComponent extends React.PureComponent<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            images: []
        };
    }

    setImages = (images: Media[]) => {
        this.setState({ images });
    };

    getImages = () => {
        const imageIds: string[] = [];
        this.state.images.forEach((image) => {
            if (image.url) {
                imageIds.push(image._id);
            }
        });
        return imageIds;
    };

    onSelectImagePressed = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            multiple: true,
            forceJpg: true,
            maxFiles: 10,
            compressImageMaxWidth: 720,
            compressImageMaxHeight: 720,
            compressImageQuality: 0.8
        }).then((data) => {
            const medias: Media[] = [];
            data.forEach((image) => {
                medias.push({
                    _id: `${Date.now().toString()}_${image.filename}`,
                    localUrl:
                        Platform.OS === 'ios' ? image.sourceURL : image.path,
                    width: image.width,
                    height: image.height
                });
            });
            const images = [...this.state.images, ...medias];
            this.setState({ images });
            this.uploadImages(medias);
        });
    };

    private updateImage = (oldMedia: Media, newMedia: Media) => {
        const temp = [...this.state.images];
        const findIndex = temp.findIndex((item) => item._id === oldMedia._id);
        if (findIndex >= 0) {
            temp.splice(findIndex, 1, newMedia);
        }
        this.setState({ images: temp });
    };

    private uploadImages = async (images: Media[]) => {
        await Promise.all(
            images.map(async (image: Media) => {
                const res = await uploadImage(image);
                if (res.status === ApiStatus.SUCCESS) {
                    this.updateImage(image, res.data!);
                }
            })
        );
    };

    private onDeletePressed = (index: number) => () => {
        const images = [...this.state.images];
        images.splice(index, 1);
        this.setState({ images });
    };

    private keyExtractor = (item: Media, index: number): string =>
        item._id || index.toString();

    private renderItem: ListRenderItem<Media> = ({ item, index }) => {
        return (
            <View
                style={{
                    width: 150,
                    borderWidth: 1,
                    marginRight: 10,
                    borderColor: 'rgba(0,0,0,.03)'
                }}
            >
                <FastImage
                    style={{ width: '100%', height: 90 }}
                    source={{
                        uri: transformImageUrl(item.thumbnail) || item.localUrl
                    }}
                />

                <TouchableOpacity
                    onPress={this.onDeletePressed(index)}
                    style={{
                        padding: 5,
                        position: 'absolute',
                        top: 0,
                        right: 0
                    }}
                >
                    <Image
                        style={{ width: 18, height: 18 }}
                        source={R.images.ic_delete_image}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    public render(): React.ReactNode {
        return (
            <View>
                <TouchableOpacity
                    onPress={this.onSelectImagePressed}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 10
                    }}
                >
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={R.images.ic_feed_photo}
                    />
                    <Text style={{ marginLeft: 5 }}>
                        {translate('upload_image')}
                    </Text>
                </TouchableOpacity>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    extraData={this.state.images}
                    data={this.state.images}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}
