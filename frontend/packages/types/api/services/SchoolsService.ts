/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedSchoolList } from '../models/PaginatedSchoolList';
import type { School } from '../models/School';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SchoolsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Read-only schools list. Pass ?lat=&lng= to get distance_km from a
     * point and have results sorted nearest-first (used for a property's
     * "Nearby schools" section).
     * @param lat Latitude to sort schools nearest-first from.
     * @param limit Max number of schools to return (nearest first).
     * @param lng Longitude to sort schools nearest-first from.
     * @param page A page number within the paginated result set.
     * @returns PaginatedSchoolList
     * @throws ApiError
     */
    public schoolsList(
        lat?: number,
        limit?: number,
        lng?: number,
        page?: number,
    ): CancelablePromise<PaginatedSchoolList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/schools/',
            query: {
                'lat': lat,
                'limit': limit,
                'lng': lng,
                'page': page,
            },
        });
    }
    /**
     * Read-only schools list. Pass ?lat=&lng= to get distance_km from a
     * point and have results sorted nearest-first (used for a property's
     * "Nearby schools" section).
     * @param id A UUID string identifying this school.
     * @returns School
     * @throws ApiError
     */
    public schoolsRetrieve(
        id: string,
    ): CancelablePromise<School> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/schools/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
