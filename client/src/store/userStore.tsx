import { makeAutoObservable } from 'mobx';
import {UserData} from "../http/usersAPI";

interface User {
    // Define your user properties here
}

export default class UserStore {
    private _isAuth: boolean = false;
    private _user: User = {};
    private _currentUser: UserData | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setIsAuth(bool: boolean) {
        this._isAuth = bool;
    }

    setUser(user: User) {
        this._user = user;
    }

    setCurrentUser(currentUser: UserData) {
        this._user = currentUser;
    }

    get isAuth(): boolean {
        return this._isAuth;
    }

    get user(): User {
        return this._user;
    }

    get currentUser(): UserData | null {
        return this._currentUser;
    }
}
