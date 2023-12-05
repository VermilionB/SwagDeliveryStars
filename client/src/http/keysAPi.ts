import {$authHost, $host} from "./index";


export const createKey = async (key: number) => {
    const {data} = await $authHost.post('http://localhost:5000/api/keys/', {key: key})
    return data
}

export const getAllKeys = async () => {
    const {data} = await $authHost.get('http://localhost:5000/api/keys/')
    return data
}