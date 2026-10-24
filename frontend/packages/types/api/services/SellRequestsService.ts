/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SellRequest } from '../models/SellRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SellRequestsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Public 'Sell your home' lead form — always saved to the database so
     * staff can review it in the admin, regardless of whether the best-effort
     * email notification below is configured or succeeds.
     * @param requestBody
     * @returns SellRequest
     * @throws ApiError
     */
    public sellRequestsCreate(
        requestBody: SellRequest,
    ): CancelablePromise<SellRequest> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/sell-requests/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
