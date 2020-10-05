import {AsyncStorage} from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId,token, expirationTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expirationTime));
        dispatch({
            type: AUTHENTICATE,
            userId,
            token
        })
    }
};

export const signup = (email,password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDuYvKYr7i_Fesf9-NXzyE3UzMWM4f6Dqg',
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken:true
                })
            });
        if (!response.ok){
            const errorResponseData = await response.json();
            const errorId = errorResponseData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS'){
                message = 'This e-mail already exists in our database';
            }

            throw new Error(message);
        }

        const resData = await response.json();
        dispatch(authenticate(resData.localId,resData.idToken,parseInt(resData.expiresIn)*1000));
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        saveDataToStorage(resData.idToken,resData.localId, expirationDate);
    };
}


export const login = (email,password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDuYvKYr7i_Fesf9-NXzyE3UzMWM4f6Dqg',
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken:true
                })
            });
        if (!response.ok){
            const errorResponseData = await response.json();
            const errorId = errorResponseData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND'){
                message = 'This e-mail could not be found';
            }else if (errorId === 'INVALID_PASSWORD'){
                message = 'Wrong password. Please try again!'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData);
        dispatch(authenticate(resData.localId,resData.idToken, parseInt(resData.expiresIn)*1000));
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        saveDataToStorage(resData.idToken,resData.localId, expirationDate);
    };
}


export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return{
        type: LOGOUT
    }
}

const setLogoutTimer = (expirationTime) => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        },expirationTime);
    }
}

const clearLogoutTimer = () => {
    if (timer){
        clearTimeout(timer);
    }
}

const saveDataToStorage = (token,userId,expirationDate) => {
    AsyncStorage.setItem('userData',JSON.stringify({
        token,
        userId,
        expirationDate: expirationDate.toISOString()
    }));
}