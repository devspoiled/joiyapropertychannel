/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from '../models/Contact';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ContactService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Site-wide 'Contact us' form — always delivers to CONTACT_EMAIL_TO,
     * regardless of who's asking, so it isn't configurable per-request.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public contactCreate(
        requestBody: Contact,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/contact/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                503: `No response body`,
            },
        });
    }
}
