import { model, Schema, Document } from 'mongoose';

interface Itrust {
    company: string;
}

interface Ivideos {
    heading: String;
    description: string;
    url: string;
}
interface Inumber {
    number: string;
    subHeading: string;
}
interface IblogShowCase {
    searchBlog: string;
}
interface Itestimonial {
    testimony: string;
    name: string;
    description: string;
}
interface ImobileAppSection {
    image: string;
    heading: string;
    subHeading: string;
    playStoreLink: string;
    appStoreLink: string;
}
export interface IWeb {
    heroImage?: string;
    missionPhoto?: String;
    vissionPhoto?: string;
    banners?: string[];
    trustedBy?: Itrust[];
    ourNumbers?: Inumber[];
    blogShowCase?: IblogShowCase[];
    testimonial?: Itestimonial[];
    mobileAppSection?: ImobileAppSection;
    sliderImages?: string[];
    videos?: Ivideos[];
}

interface WebDocument extends IWeb, Document {}

const webModel = new Schema<WebDocument>(
    {
        heroImage: {
            type: String,
            required: false
        },
        missonPhoto: {
            type: String,
            required: false
        },
        vissionPhoto: {
            type: String,
            required: false
        },
        banners: {
            type: [String]
        },
        trustedBy: [
            {
                company: String,
                photo: String,
                default: []
            }
        ],
        ourNumbers: [
            {
                number: String,
                subHeading: String,
                default: []
            }
        ],
        blogShowCase: [
            {
                searchBlog: String,
                default: []
            }
        ],
        videos: [
            {
                heading: String,
                description: String
            }
        ],
        testimonial: [
            {
                testimony: String,
                name: String,
                description: String,
                default: []
            }
        ],
        mobileAppSection: {
            image: String,
            heading: String,
            subHeading: String,
            playStorLink: String,
            appStoreLink: String
        },
        sliderImages: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

const WebContent = model('WebContent', webModel);

export default WebContent;
