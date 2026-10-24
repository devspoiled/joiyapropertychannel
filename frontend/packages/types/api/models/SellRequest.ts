/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AreaUnitEnum } from './AreaUnitEnum';
import type { PropertyTypeEnum } from './PropertyTypeEnum';
export type SellRequest = {
    name: string;
    email: string;
    phone: string;
    property_type: PropertyTypeEnum;
    area_value: string;
    area_unit?: AreaUnitEnum;
    address: string;
    city: string;
    demanding_price_lac: number;
    latitude?: string | null;
    longitude?: string | null;
};

