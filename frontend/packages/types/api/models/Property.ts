/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Agent } from './Agent';
import type { Neighborhood } from './Neighborhood';
import type { PriceHistory } from './PriceHistory';
import type { PropertyImage } from './PropertyImage';
import type { StatusEnum } from './StatusEnum';
import type { TaxHistory } from './TaxHistory';
import type { Type546Enum } from './Type546Enum';
export type Property = {
    readonly id: string;
    readonly agent: Agent;
    readonly neighborhood: Neighborhood;
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
    readonly images: Array<PropertyImage>;
    readonly tax_history: Array<TaxHistory>;
    readonly price_history: Array<PriceHistory>;
    readonly created_at: string;
};

