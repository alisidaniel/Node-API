export enum sortBy {
    Latest = 'Latest',
    Oldest = 'Oldest'
}

interface Iprice {
    from?: string;
    to?: string;
}

interface IOptions {
    sortBy?: sortBy;
    price?: Iprice;
}

export interface IFilters {
    page?: number;
    keyWord?: string;
    take?: number;
    options?: IOptions;
}

export const defaultFilterOptions = {
    limit: 15,
    page: 1
};
