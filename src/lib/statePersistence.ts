import useAuthContext from 'context/AuthContext/AuthContext';

/**
  * Unfortunately, due to not being able to call contexts within useEffect,
  * some usages will need to first get the persistence key to later
  * use that within the useEffect. 
  */
export const getPersistenceKey = (): string => {
    const { user } = useAuthContext();

    // @ts-ignore - User is guaranteed to be logged in at this point.
    const user_id = user.uid;
    return 'user_' + user_id + '_';
}

export function getLocalStorage(persistence_key: string, key: string): any {
    let storage = localStorage.getItem(persistence_key + key);

    if ( storage === null) {
        return null;
    }

    return JSON.parse(storage);
}

export function setLocalStorage(persistence_key: string, key: string, value: boolean | string) {
    localStorage.setItem(persistence_key + key, JSON.stringify(value));
}
