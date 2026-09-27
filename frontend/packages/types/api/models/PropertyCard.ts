/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Agent } from './Agent';
import type { Neighborhood } from './Neighborhood';
import type { StatusEnum } from './StatusEnum';
import type { Type546Enum } from './Type546Enum';
/**
 * Lean shape for list views — only what a property card renders.
 * Full nested images/tax_history/price_history are fetched separately
 * on the detail page, not on every card in a listing grid. image_urls is
 * just the URL strings (no id/order objects) so the card can carousel
 * through photos on hover without the cost of the full images relation.
 */
export type PropertyCard = {
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
    beds?: number | null;
    baths?: number | null;
    sqft?: number | null;
    cover_image_url?: string;
    image_count?: number;
    readonly image_urls: Array<string>;
};

