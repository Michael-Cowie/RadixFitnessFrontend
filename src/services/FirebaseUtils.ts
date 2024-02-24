import {
    createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut
} from 'firebase/auth';

const auth = getAuth();

interface Result {
    success: boolean,
    message: string
}

export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        return false;
    }
};


export const createNewUser = async (email: string, password: string): Promise<Result> => {
    try {
        /**
         * When successfully creating a user, they will be automatically logged in. This will 
         * call onAuthStateChanged, set the User and update userIsLoggedIn. This will
         * cause a rerender. Because userIsLoggedIn will now be True, when rerendering
         * the Login page we will be redirected to the home page.
         */
        await createUserWithEmailAndPassword(auth, email, password);
        return {
            success: true,
            message: 'Success'
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.code
        };
    }
};

export const signOutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        // An error happened.
    }
}
