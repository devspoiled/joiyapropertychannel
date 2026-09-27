/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Agent } from '../models/Agent';
import type { PaginatedAgentList } from '../models/PaginatedAgentList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AgentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedAgentList
     * @throws ApiError
     */
    public agentsList(
        page?: number,
    ): CancelablePromise<PaginatedAgentList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/agents/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * @param id A UUID string identifying this agent.
     * @returns Agent
     * @throws ApiError
     */
    public agentsRetrieve(
        id: string,
    ): CancelablePromise<Agent> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/agents/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
