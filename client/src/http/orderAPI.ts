import {$authHost} from "./index";

export const createOrder = async (seller: string, consumer: string, license: string | undefined, beat: string) => {
    const {data} = await $authHost.post('http://localhost:5000/api/orders/', {seller, consumer, license, beat})
    return data;
}

export const getOrdersByUser = async (userId: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/orders/orders/${userId}`)
    return data;
}

export const getSalesByUser = async (userId: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/orders/sales/${userId}`)
    return data;
}

