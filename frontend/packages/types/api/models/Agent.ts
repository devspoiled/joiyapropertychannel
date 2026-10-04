/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Agent = {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    brokerage?: string;
    designation?: string;
    phone?: string;
    photo_url?: string;
    bio?: string;
    readonly experience_highlights: Array<string>;
    is_verified?: boolean;
    /**
     * Featured as Founder & Owner instead of in the regular agent grid.
     */
    is_founder?: boolean;
    readonly listing_count: number;
};

