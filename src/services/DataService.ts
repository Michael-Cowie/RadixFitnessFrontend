/**
 * @fileoverview 
 * 
 *  DataService.ts is a utility file that prevents any callers continuously
 *  retrieving the required information each time. For example, any requests for a logged in
 *  user will ALWAYS needs to pass The Firebase ID token, by using these functions it
 *  prevents each calling code to pass the ID token. 
 */

import { getAuth } from 'firebase/auth';
import axios from "axios";

const auth = getAuth();

const getIdTokenFromCurrentUser = async (): Promise<string | undefined> => {
    return await auth.currentUser?.getIdToken();
}

export const get = async (url: string) => {
    /**
     * @param {string} url - The URL to which the HTTP request will be.
     * 
     * Utilizes axios.get(url, header) but also passes the logged in user ID token
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
    return await axios.get(url, header);
}

export const put = async (url: string, body: any) => {
    /**
     * Utilizes axios.put(url, body, header) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * @param { string } url - The URL to which the HTTP request will be.
     * @param { any } body - The body of the HTTP request
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.put(url, body, header);
}

export const post = async (url: string, body: any) => {
    /**
     * Utilizes axios.put(url, body, header) but also passes the logged in user ID token
     * in the Autorization field in the header.
     * 
     * @param { string } url - The URL to which the HTTP request will be.
     * @param { any } body - The body of the HTTP request
    */
    const header = {
        headers: {
            "Authorization": await getIdTokenFromCurrentUser()
        }
    }
    return await axios.post(url, body, header);
}