import {makeAutoObservable} from "mobx";

export interface OrderInterface {
    id: string;
    users_order_history_seller_idTousers: {
        username: string
    };
    users_order_history_consumer_idTousers: {
        username: string
    };
    beats: {
        id: string,
        name: string,
        producer_id: string,
        genre_id: string,
        beat_files_id: string,
        image_url: string,
        duration: number,
        description: string,
        bpm: number,
        key: number,
        tags: string[],
        is_free: boolean,
        is_available: boolean,
        genres: {
            id: string,
            genre: string
        },
        keys: {
            id: number,
            key: string
        },
        beat_files: {
            id: string,
            mp3_file: string,
            wav_file: string,
            zip_file: string
        }
    },
    purchase_date: string,
    licenses: {
        license_types: {
            id: 4,
            license_type: string,
            description: string,
            includes_mp3: boolean,
            includes_wav: boolean,
            includes_zip: boolean
        },
        price: string
    }
}

export default class OrdersStore {
    private _orders: OrderInterface[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setOrders(orders: OrderInterface[]) {
        this._orders = orders;
    }

    get orders(): OrderInterface[] {
        return this._orders;
    }
}