/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedPriceHistoryList } from '../models/PaginatedPriceHistoryList';
import type { PriceHistory } from '../models/PriceHistory';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PriceHistoryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedPriceHistoryList
     * @throws ApiError
     */
    public priceHistoryList(
        page?: number,
    ): CancelablePromise<PaginatedPriceHistoryList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/price-history/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this price history entry.
     * @returns PriceHistory
     * @throws ApiError
     */
    public priceHistoryRetrieve(
        id: number,
    ): CancelablePromise<PriceHistory> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/price-history/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
