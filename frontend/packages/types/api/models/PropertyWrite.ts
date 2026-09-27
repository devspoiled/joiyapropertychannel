/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusEnum } from './StatusEnum';
import type { Type546Enum } from './Type546Enum';
export type PropertyWrite = {
    agent: string;
    neighborhood: string;
    type: Type546Enum;
    status?: StatusEnum;
    address: string;
    price_lac: number;
    latitude?: string | null;
    longitude?: string | null;
    plot_size?: string;
    lot_size_sqft?: number | null;
    beds?: number | null;
    baths?: number | null;
    sqft?: number | null;
    year_built?: number | null;
    description?: string;
    cover_image_url?: string;
    image_count?: number;
    is_active?: boolean;
};

