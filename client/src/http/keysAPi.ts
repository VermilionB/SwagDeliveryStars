import {$authHost, $host} from "./index";


export const createKey = async (key: number) => {
    const {data} = await $authHost.post('api/keys/', {key: key})
    return data
}

export const getAllKeys = async () => {
    const {data} = await $authHost.get('api/keys/')
    return data
}