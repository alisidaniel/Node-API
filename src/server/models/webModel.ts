import { model, Schema, Document } from 'mongoose';

interface Itrust {
    company: string;
}
interface Inumber {
    number: string;
    subHeading: string;
}
interface IblogShowCase {}
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

        teamSection: {}
    },
    {
        timestamps: true
    }
);

const WebContent = model('WebContent', webModel);

export default WebContent;
