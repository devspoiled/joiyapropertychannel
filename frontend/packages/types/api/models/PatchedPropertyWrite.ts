/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusEnum } from './StatusEnum';
import type { Type584Enum } from './Type584Enum';
export type PatchedPropertyWrite = {
    agent?: string;
    neighborhood?: string;
    type?: Type584Enum;
    status?: StatusEnum;
    block?: string;
    property_number?: string;
    address?: string;
    price_lac?: number;
    latitude?: string | null;
    longitude?: string | null;
    plot_size?: string;
    lot_size_sqft?: number | null;
    beds?: number | null;
    baths?: number | null;
    sqft?: number | null;
    year_built?: number | null;
    features?: Array<number>;
    nearby_schools?: Array<string>;
    nearby_hospitals?: Array<string>;
    description?: string;
    cover_image_url?: string;
    image_count?: number;
    is_active?: boolean;
};

