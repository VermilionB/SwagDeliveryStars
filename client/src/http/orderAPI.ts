import {$authHost} from "./index";

export const createOrder = async (seller: string, consumer: string, license: string | undefined, beat: string) => {
    const {data} = await $authHost.post('api/orders/', {seller, consumer, license, beat})
    return data;
}

export const getOrdersByUser = async (userId: string) => {
    const {data} = await $authHost.get(`api/orders/orders/${userId}`)
    return data;
}

export const getSalesByUser = async (userId: string) => {
    const {data} = await $authHost.get(`api/orders/sales/${userId}`)
    return data;
}

