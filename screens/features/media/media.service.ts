import RNFetchBlob from 'rn-fetch-blob';
import { ResponseBase } from 'types/base.type';
import { Media } from 'types/media';
import ApiUtils from 'utils/ApiUtils';
import { getFileName, transformImageUrl } from 'utils/CommonUtils';

export const UPLOAD_IMAGE = '/media';

const dirs = RNFetchBlob.fs.dirs;
export function uploadImage(media: Media) {
    const data = new FormData();

    const name = `${Date.now().toString()}`;
    data.append('file', {
        uri: media.localUrl,
        type: 'image/jpeg',
        name
    });
    data.append('width', media.width);
    data.append('height', media.height);
    return ApiUtils.postForm<any, ResponseBase<Media>>(UPLOAD_IMAGE, data);
}

export function downloadFile(url: string) {
    return RNFetchBlob.config({
        // response data will be saved to this path if it has access right.
        path: `${dirs.DocumentDir}/${getFileName(url)}`
    }).fetch('GET', transformImageUrl(url) || '', {});
}
