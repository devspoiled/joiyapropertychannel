/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SchoolTypeEnum } from './SchoolTypeEnum';
export type School = {
    readonly id: string;
    name: string;
    type: SchoolTypeEnum;
    grade_levels?: string;
    city: string;
    website?: string;
    readonly distance_km: string;
};

