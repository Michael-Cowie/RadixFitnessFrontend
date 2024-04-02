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

export const get = async (path: string) => {
    /**
     * @param {string} path - The URL path.
     * 
     * Utilizes axios.get(path, header) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * ---------- NOTE ----------
     * 
     * It's expected that GET requests are idempotent: Requesting the same URL 
     * multiple times always gets you an equivalent result. This e.g. allows 
     * for caching (which some browsers and proxies do very aggressively). If 
     * you move query parameters into the request body, you are violating this 
     * expectation so please avoid this. You're setting yourself up for hard to 
     * debug problems.
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.get(addDomain(path), header);
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
