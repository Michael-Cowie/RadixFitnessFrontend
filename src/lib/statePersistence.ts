import useAuthContext from 'context/AuthContext/hooks';

export const usePersistenceKey = (): string => {
  const { user } = useAuthContext();

  //@ts-expect-error User is guaranteed to be logged in.
  const user_id = user.uid;
  return 'user_' + user_id + '_';
};

export function getLocalStorage(persistence_key: string, key: string): string | null {
  const storage = localStorage.getItem(persistence_key + key);

  if (storage === null) {
    return null;
  }

  return JSON.parse(storage);
}

export function setLocalStorage(persistence_key: string, key: string, value: boolean | string) {
  localStorage.setItem(persistence_key + key, JSON.stringify(value));
}
