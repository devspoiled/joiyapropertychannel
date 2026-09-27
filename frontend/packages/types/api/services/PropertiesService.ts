/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedPropertyCardList } from '../models/PaginatedPropertyCardList';
import type { PatchedPropertyWrite } from '../models/PatchedPropertyWrite';
import type { Property } from '../models/Property';
import type { PropertyWrite } from '../models/PropertyWrite';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PropertiesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param beds Minimum bedrooms
     * @param city Filter by neighborhood city
     * @param neighborhood Filter by neighborhood id
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param priceMax Max price in Lac
     * @param q Search by address, neighborhood or city
     * @param type Filter by property type
     * @returns PaginatedPropertyCardList
     * @throws ApiError
     */
    public propertiesList(
        beds?: number,
        city?: string,
        neighborhood?: string,
        page?: number,
        pageSize?: number,
        priceMax?: number,
        q?: string,
        type?: string,
    ): CancelablePromise<PaginatedPropertyCardList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/properties/',
            query: {
                'beds': beds,
                'city': city,
                'neighborhood': neighborhood,
                'page': page,
                'page_size': pageSize,
                'price_max': priceMax,
                'q': q,
                'type': type,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Property
     * @throws ApiError
     */
    public propertiesCreate(
        requestBody: PropertyWrite,
    ): CancelablePromise<Property> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/properties/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A UUID string identifying this property.
     * @returns Property
     * @throws ApiError
     */
    public propertiesRetrieve(
        id: string,
    ): CancelablePromise<Property> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/properties/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A UUID string identifying this property.
     * @param requestBody
     * @returns PropertyWrite
     * @throws ApiError
     */
    public propertiesUpdate(
        id: string,
        requestBody: PropertyWrite,
    ): CancelablePromise<PropertyWrite> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/properties/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A UUID string identifying this property.
     * @param requestBody
     * @returns PropertyWrite
     * @throws ApiError
     */
    public propertiesPartialUpdate(
        id: string,
        requestBody?: PatchedPropertyWrite,
    ): CancelablePromise<PropertyWrite> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/properties/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A UUID string identifying this property.
     * @returns void
     * @throws ApiError
     */
    public propertiesDestroy(
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/properties/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
