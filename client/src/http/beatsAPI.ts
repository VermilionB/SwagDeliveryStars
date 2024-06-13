import {$authHost, $host} from "./index";
import { AxiosRequestConfig } from "axios";

export const createBeat = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $authHost.post(`api/beats/`, formData, config)
    return data;
}

export const updateBeat = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $authHost.put(`api/beats/`, formData, config)
    return data;
}

export const deleteBeat = async (beatId: string) => {
    const {data} = await $authHost.delete(`api/beats/${beatId}`)
    return data;
}

export const getAllBeats = async (
    currentPage: number,
    pageSize: number,
    searchValue: string = ``,
    priceFrom: number = 0,
    priceTo: number = 0,
    isFree: string = ``
) => {
    const formattedPriceFrom = priceFrom.toFixed(2);
    const formattedPriceTo = priceTo.toFixed(2);

    let url = `api/beats?page=${currentPage}&pageSize=${pageSize}&beatName=${searchValue}`;
    if (formattedPriceFrom) {
        url += `&priceFrom=${formattedPriceFrom}`;
    }
    if (formattedPriceTo) {
        url += `&priceTo=${formattedPriceTo}`;
    }
    if (isFree) {
        url += `&isFree=${isFree}`;
    }

    const { data } = await $host.get(url);

    return data;
};


export const getBeatById = async (id: string) => {
    const {data} = await $host.get(`api/beats/${id}`)
    return data
}

export const playBeat = async (beatId: string) => {
    const {data} = await $authHost.post(`api/beats/play/${beatId}`)
    return data
}
export const getPlaysByBeat = async (beatId: string) => {
    const {data} = await $host.get(`api/beats/plays?beatId=${beatId}`)
    return data
}

export const allBeatsCount = async (searchValue: string = ``, priceFrom: number = 0, priceTo: number = 0, isFree: string = ``) => {
    const {data} = await $host.get(`api/beats/length?beatName=${searchValue}&priceFrom=${priceFrom}&priceTo=${priceTo}&isFree=${isFree}`)
    return {data}
}

export const likeBeatAction = async (beatId: string) => {
    const {data} = await $authHost.post(`api/beats/like/${beatId}` )
    return data
}

export const unlikeBeatAction = async (beatId: string) => {
    const {data} = await $authHost.post(`api/beats/dislike/${beatId}` )
    return data
}

export const checkIfBeatLiked = async (beatId: string) => {
    const {data} = await $authHost.get(`api/beats/findLiked/${beatId}` )
    return data
}

export const repostBeatAction = async (beatId: string) => {
    const {data} = await $authHost.post(`api/beats/repost/${beatId}` )
    return data
}

export const unrepostBeatAction = async (beatId: string) => {
    const {data} = await $authHost.post(`api/beats/unrepost/${beatId}` )
    return data
}

export const checkIfBeatReposted = async (beatId: string) => {
    const {data} = await $authHost.get(`api/beats/findReposted/${beatId}` )
    return data
}