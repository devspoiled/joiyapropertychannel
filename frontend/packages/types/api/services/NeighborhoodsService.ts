/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Neighborhood } from '../models/Neighborhood';
import type { PaginatedNeighborhoodList } from '../models/PaginatedNeighborhoodList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NeighborhoodsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedNeighborhoodList
     * @throws ApiError
     */
    public neighborhoodsList(
        page?: number,
    ): CancelablePromise<PaginatedNeighborhoodList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/neighborhoods/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * @param id A UUID string identifying this neighborhood.
     * @returns Neighborhood
     * @throws ApiError
     */
    public neighborhoodsRetrieve(
        id: string,
    ): CancelablePromise<Neighborhood> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/neighborhoods/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
