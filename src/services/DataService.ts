/**
 * @fileoverview 
 * 
 * DataService.ts is a utility file that prevents any callers from continuously
 * retrieving the required information each time. For example, any requests for a logged-in
 * user will ALWAYS need to pass the Firebase ID token. By using these functions, it
 * prevents each calling code from needing to pass the ID token.
 */

import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_END_POINT = import.meta.env.VITE_API_END_POINT;
const auth = getAuth();

const getIdTokenFromCurrentUser = async (): Promise<string | undefined> => {
    return await auth.currentUser?.getIdToken();
}

const addDomain = (path: string) => {
    /**
     * @param { string } path - The path that will be appended to the domain to create the full URL.
     */
    return API_END_POINT + path;
}

/**
 * Makes an HTTP request using the specified method.
 * Utilizes axios for making HTTP requests and includes the Authorization header with the logged-in user ID token.
 * 
 * @param { 'get' | 'put' | 'post' | 'patch' | 'delete' } method - The HTTP method.
 * @param { string } path - The URL path.
 * @param { any } [body=null] - The body of the HTTP request (optional for non-GET and non-DELETE requests).
 * @param { any } [queryParams={}] - The query parameters to be included in the request (optional).
 * @returns { Promise<any> } The response from the HTTP request.
 */
const request = async (
    method: 'get' | 'put' | 'post' | 'patch' | 'delete', 
    path: string, 
    body: any = null, 
    queryParams: any = {}
  ): Promise<any> => {
    const config = {
        headers: {
            "Authorization": 'Bearer ' + await getIdTokenFromCurrentUser()
        },
        params: queryParams
    };
    if (method === 'get' || method === 'delete') {
        /** 
         * For GET and DELETE requests, exclude the body parameter.
         * 
         * A REST API can have arguments in several places:
         * 
         *  1. In the request body, as part of a JSON body or other MIME type.
         *  2. In the query string - e.g. /api/resource?p1=v1&p2=v2
         *  3. As part of the URL path - e.g. /api/resource/v1/v2
         * 
         * Usually, the content body is used for the data that is to be uploaded
         * or downloaded from the server, and the query parameters are used to 
         * specify the name, MIME type, etc.
         * 
         * In general, the query parameters are properties of the query and not
         * the data. It's expected that GET and DELETE requests are idempotent.
         */
        return await axios[method](addDomain(path), config);
    } else {
        return await axios[method](addDomain(path), body, config);
    }
};

export const get = (path: string, queryParams: any = {}) => {
    return request('get', path, null, queryParams);
};
  
export const put = (path: string, body: any = null, queryParams: any = {}) => {
    return request('put', path, body, queryParams);
};
  
export const post = (path: string, body: any = null, queryParams: any = {}) => {
    return request('post', path, body, queryParams);
};
  
export const patch = (path: string, body: any = null, queryParams: any = {}) => {
    return request('patch', path, body, queryParams);
};

export const del = (path: string, queryParams: any = {}) => {
    return request('delete', path, null, queryParams);
};
