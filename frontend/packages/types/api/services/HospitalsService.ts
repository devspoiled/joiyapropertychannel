/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Hospital } from '../models/Hospital';
import type { PaginatedHospitalList } from '../models/PaginatedHospitalList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HospitalsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Read-only hospitals list. Pass ?lat=&lng= to get distance_km from a
     * point and have results sorted nearest-first (used for a property's
     * "Nearby hospitals" section).
     * @param lat Latitude to sort hospitals nearest-first from.
     * @param limit Max number of hospitals to return (nearest first).
     * @param lng Longitude to sort hospitals nearest-first from.
     * @param page A page number within the paginated result set.
     * @returns PaginatedHospitalList
     * @throws ApiError
     */
    public hospitalsList(
        lat?: number,
        limit?: number,
        lng?: number,
        page?: number,
    ): CancelablePromise<PaginatedHospitalList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/hospitals/',
            query: {
                'lat': lat,
                'limit': limit,
                'lng': lng,
                'page': page,
            },
        });
    }
    /**
     * Read-only hospitals list. Pass ?lat=&lng= to get distance_km from a
     * point and have results sorted nearest-first (used for a property's
     * "Nearby hospitals" section).
     * @param id A UUID string identifying this hospital.
     * @returns Hospital
     * @throws ApiError
     */
    public hospitalsRetrieve(
        id: string,
    ): CancelablePromise<Hospital> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/hospitals/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
