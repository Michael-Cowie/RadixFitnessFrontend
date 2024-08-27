/**
 * @fileoverview 
 * 
 *  DataService.ts is a utility file that prevents any callers continuously
 *  retrieving the required information each time. For example, any requests for a logged in
 *  user will ALWAYS needs to pass The Firebase ID token, by using these functions it
 *  prevents each calling code to pass the ID token. 
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

export const get = async (path: string, params?: Record<string, any>) => {
    /**
     * @param {string} path - The URL path.
     * @param {Record<string, any>} params - The query parameters.
     * 
     * Utilizes axios.get(...) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * ---------- NOTE ----------
     * 
     * A REST API can have arguments in several places,
     * 
     *  1. In the request body, as part of a JSON body or other MIME type.
     *  2. In the query string - e.g. /api/resource?p1=v1&p2=v2
     *  3. As part of the URL path - e.g. /api/resource/v1/v2
     * 
     * Usually the content body is used for the data that is to be uploaded
     * or downloaded from the server and the query parameters are used to 
     * specify the name, MIME type, etc. 
     * 
     * In general, the query parameters are property of the query and not
     * the data. It's expected that GET requests are idempotent. If you
     * move query parameters into the request bdoy, you're violating this 
     * expectation so please avoid it.
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.get(addDomain(path), { ...header, params });
}

export const put = async (path: string, body: any) => {
    /**
     * Utilizes axios.put(url, body, header) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * @param { string } path - The URL path. 
     * @param { any } body - The body of the HTTP request
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.put(addDomain(path), body, header);
}

export const post = async (path: string, body: any) => {
    /**
     * Utilizes axios.put(path, body, header) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * @param { string } path - The URL path.
     * @param { any } body - The body of the HTTP request
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.post(addDomain(path), body, header);
}

export const patch = async (path: string, body: any) => {
    /**
     * Utilizes axios.patch(path, body, header) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * @param { string } path - The URL path.
     * @param { any } body - The body of the HTTP request
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.patch(addDomain(path), body, header);
}
