import { singleUpload, multipleUpload } from './index';
import WebContent from '../server/models/webModel';
import { defaultFilterOptions, sortBy, sortByMapper, Iprice } from './constant';

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

export const priceRange = ({ from, to }: Iprice): Iprice => {
    return { from: from || 0, to: to || 1000000000 };
};

export const skipNumber = (page = 1): Number =>
    page === 1 ? 0 : page * defaultFilterOptions.limit;

export const productsForTheWeek = (id: any) =>
    Date.now() - id.getTimestamp() < 7 * 24 * 60 * 60 * 1000;

export const sortByFormatter = (sortType: sortBy): number => sortByMapper[sortType];

export const parsedOptions = (options: string | undefined | object) =>
    options && typeof options === 'string'
        ? JSON.parse(options)
        : options && typeof options === 'object'
        ? options
        : null;
