export enum sortBy {
    Latest = 'Latest',
    Oldest = 'Oldest'
}

export interface Iprice {
    from?: number;
    to?: number;
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

export const sortByMapper = {
    Latest: 1,
    Oldest: -1
};
