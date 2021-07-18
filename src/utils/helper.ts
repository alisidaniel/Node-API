import { singleUpload, multipleUpload } from './index';
import WebContent from '../server/models/webModel';

export const contentResolver = async (key: any, id?: string) => {
    console.log(Object.keys(key)[0]);
    switch (key) {
        case Object.keys(key)[0] == 'vissionPhoto':
            const vissionPhoto = await singleUpload({
                base64: key,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $set: { vissionPhoto: vissionPhoto } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'missionPhoto':
            const missionPhoto = await singleUpload({
                base64: key,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $set: { missionPhoto: missionPhoto } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'heroImage':
            const heroImage = await singleUpload({
                base64: key,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $set: { heroImage: heroImage } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'banners':
            const banners = await singleUpload({
                base64: key,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $push: { banners: banners } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'sliderImages':
            const sliderImages = await singleUpload({
                base64: key,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $push: { sliderImages: sliderImages } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'mobileAppSection':
            const image = await singleUpload({
                base64: key.image,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            let mobileAppSection = {
                image,
                heading: key.heading,
                subHeading: key.subHeading,
                playStorLink: key.playStorLink,
                appStoreLink: key.appStoreLink
            };
            return await WebContent.updateOne(
                { _id: id },
                { $set: { mobileAppSection: mobileAppSection } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'testimonial':
            let testimonial = {
                name: key.name,
                testimony: key.testimony,
                description: key.description
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { testimonial: testimonial } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'blogShowCase':
            return await WebContent.updateOne(
                { _id: id },
                { $push: { blogShowCase: key.searchBlog } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'ourNumbers':
            console.log('got here in numbers');
            let ourNumbers = {
                number: key.number,
                subHeading: key.subHeading
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { ourNumbers: ourNumbers } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'trustedBy':
            const photo = await singleUpload({
                base64: key.photo,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            let trustedBy = {
                photo,
                company: key.company
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { trustedBy: trustedBy } },
                { upsert: true }
            );
        case Object.keys(key)[0] == 'videos':
            const url = await singleUpload({
                base64: key.url,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'video'
            });
            let videos = {
                heading: key.number,
                description: key.description,
                url
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { videos: videos } },
                { upsert: true }
            );
        default:
            return {};
    }
};
