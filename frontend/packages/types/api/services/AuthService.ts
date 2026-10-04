/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SocialLogin } from '../models/SocialLogin';
import type { SocialLoginResponse } from '../models/SocialLoginResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Bridge for the frontend's auth server: given an identity already
     * verified by a social provider (e.g. Google) and a shared secret proving
     * the call comes from our own Next.js server rather than a browser,
     * finds-or-creates the matching Django user and returns a JWT pair in the
     * same shape as /api/token/.
     * @param requestBody
     * @returns SocialLoginResponse
     * @throws ApiError
     */
    public authSocialCreate(
        requestBody: SocialLogin,
    ): CancelablePromise<SocialLoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/social/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
