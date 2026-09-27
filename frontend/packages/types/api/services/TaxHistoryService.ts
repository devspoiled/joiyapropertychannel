/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedTaxHistoryList } from '../models/PaginatedTaxHistoryList';
import type { TaxHistory } from '../models/TaxHistory';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TaxHistoryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedTaxHistoryList
     * @throws ApiError
     */
    public taxHistoryList(
        page?: number,
    ): CancelablePromise<PaginatedTaxHistoryList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/tax-history/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this tax history entry.
     * @returns TaxHistory
     * @throws ApiError
     */
    public taxHistoryRetrieve(
        id: number,
    ): CancelablePromise<TaxHistory> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/tax-history/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
