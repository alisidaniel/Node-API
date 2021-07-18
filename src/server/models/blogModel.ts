import { model, Schema, Document } from 'mongoose';

export interface IBlog {
    heading?: string;
    content: string;
    logo?: string;
    tags?: string;
}

interface BlogDocument extends IBlog, Document {}

const blogModel = new Schema<BlogDocument>(
    {
        heading: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: false
        },
        tags: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

const Blog = model('Blog', blogModel);

export default Blog;
