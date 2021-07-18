import { singleUpload, multipleUpload } from './index';
import WebContent from '../server/models/webModel';

export const contentResolver = async (key: any, id?: string) => {
    const value = Object.keys(key)[0];
    switch (value) {
        case 'vissionPhoto':
            const vissionPhoto = await singleUpload({
                base64: key.vissionPhoto,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $set: { vissionPhoto: vissionPhoto } },
                { upsert: true }
            );
        case 'missionPhoto':
            const missionPhoto = await singleUpload({
                base64: key.missionPhoto,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $set: { missionPhoto: missionPhoto } },
                { upsert: true }
            );
        case 'heroImage':
            const heroImage = await singleUpload({
                base64: key.heroImage,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $set: { heroImage: heroImage } },
                { upsert: true }
            );
        case 'banners':
            const banners = await singleUpload({
                base64: key.banners,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $push: { banners: banners } },
                { upsert: true }
            );
        case 'sliderImages':
            const sliderImages = await singleUpload({
                base64: key.sliderImages,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            return await WebContent.updateOne(
                { _id: id },
                { $push: { sliderImages: sliderImages } },
                { upsert: true }
            );
        case 'mobileAppSection':
            const image = await singleUpload({
                base64: key.mobileAppSection.image,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            let mobileAppSection = {
                image,
                heading: key.mobileAppSection.heading,
                subHeading: key.mobileAppSection.subHeading,
                playStorLink: key.mobileAppSection.playStorLink,
                appStoreLink: key.mobileAppSection.appStoreLink
            };
            return await WebContent.updateOne(
                { _id: id },
                { $set: { mobileAppSection: mobileAppSection } },
                { upsert: true }
            );
        case 'testimonial':
            let testimonial = {
                name: key.testimonial.name,
                testimony: key.testimonial.testimony,
                description: key.testimonial.description
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { testimonial: testimonial } },
                { upsert: true }
            );
        case 'blogShowCase':
            return await WebContent.updateOne(
                { _id: id },
                { $push: { blogShowCase: key.blogShowCase.searchBlog } },
                { upsert: true }
            );
        case 'ourNumbers':
            console.log('got here in numbers');
            let ourNumbers = {
                number: key.ourNumbers.number,
                subHeading: key.ourNumbers.subHeading
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { ourNumbers: ourNumbers } },
                { upsert: true }
            );
        case 'trustedBy':
            const photo = await singleUpload({
                base64: key.trustedBy.photo,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'image'
            });
            let trustedBy = {
                photo,
                company: key.trustedBy.company
            };
            return await WebContent.updateOne(
                { _id: id },
                { $push: { trustedBy: trustedBy } },
                { upsert: true }
            );
        case 'videos':
            const url = await singleUpload({
                base64: key.url,
                id: `${new Date().getTime()}`,
                path: 'content',
                type: 'video'
            });
            let videos = {
                heading: key.videos.number,
                description: key.videos.description,
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
