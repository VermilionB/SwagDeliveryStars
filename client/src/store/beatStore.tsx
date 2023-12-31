import {makeAutoObservable} from 'mobx';
import {fetchAvatarFile} from "../http/usersAPI";

export interface GenreInterface {
    id: string;
    genre: string;
}

export interface KeysInterface {
    id: string;
    key: string;
}

export interface LicensesTypesInterface {
    id: string;
    license_type: string;
    description: string;
}

export interface BeatsInterface {
    id: string;
    name: string;
    users: {
        username: string;
    }
    image_url: string;
    duration: number;
    bpm: number;
    keys: {
        key: string;
    }
    genres: {
        genre: string;
    }
    likes: number;
    is_free: boolean;
    is_available: boolean;
    licenses: [
        {
            license_type: number;
            price: string;
        }
    ],
    description: string
}

interface RepostsInterface {
    beats: BeatsInterface,
}

export default class BeatStore {
    private _genres: GenreInterface[] = [];
    private _keys: KeysInterface[] = [];
    private _licensesTypes: LicensesTypesInterface[] = [];
    private _beats: BeatsInterface[] = [];
    private _reposts: RepostsInterface[] = []

    constructor() {
        makeAutoObservable(this);
    }

    setGenres(genres: GenreInterface[]) {
        this._genres = genres;
    }

    get genres(): GenreInterface[] {
        return this._genres;
    }

    setKeys(keys: KeysInterface[]) {
        this._keys = keys;
    }

    get keys(): KeysInterface[] {
        return this._keys;
    }

    setLicensesTypes(licensesTypes: LicensesTypesInterface[]) {
        this._licensesTypes = licensesTypes;
    }

    get licensesTypes(): LicensesTypesInterface[] {
        return this._licensesTypes;
    }

    setBeats = async (beats: BeatsInterface[]) => {
        this._beats = await Promise.all(beats.map(async (beat) => {
            return {
                ...beat,
                image_url: await fetchAvatarFile(beat.image_url),
            };
        }));
    }

    setReposts = async (reposts: RepostsInterface[]) => {
        this._reposts = await Promise.all(reposts.map(async (repost) => {
            return {
                ...repost,
                beats: {
                    ...repost.beats,
                    image_url: await fetchAvatarFile(repost.beats.image_url),
                },
            };
        }));
    }

    get reposts(): RepostsInterface[] {
        return this._reposts;
    }


    get beats(): BeatsInterface[] {
        return this._beats;
    }
}