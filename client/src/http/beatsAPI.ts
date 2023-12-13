import {$authHost, $host} from "./index";
import { AxiosRequestConfig } from "axios";

export const createBeat = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $authHost.post('http://localhost:5000/api/beats/', formData, config)
    return data;
}

export const updateBeat = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $authHost.put('http://localhost:5000/api/beats/', formData, config)
    return data;
}

export const deleteBeat = async (beatId: string) => {
    const {data} = await $authHost.delete(`http://localhost:5000/api/beats/${beatId}`)
    return data;
}

export const getAllBeats = async (currentPage: number, pageSize: number) => {
    const {data} = await $host.get(`http://localhost:5000/api/beats?page=${currentPage}&pageSize=${pageSize}`)
    return data
}

export const getBeatById = async (id: string) => {
    const {data} = await $host.get(`http://localhost:5000/api/beats/${id}`)
    return data
}

export const playBeat = async (beatId: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/beats/play/${beatId}`)
    return data
}
export const getPlaysByBeat = async (beatId: string) => {
    const {data} = await $host.get(`http://localhost:5000/api/beats/plays?beatId=${beatId}`)
    return data
}

export const allBeatsCount = async () => {
    const {data} = await $host.get('http://localhost:5000/api/beats/length')
    return {data}
}

export const likeBeatAction = async (beatId: string) => {
    console.log(beatId)
    const {data} = await $authHost.post(`http://localhost:5000/api/beats/like/${beatId}` )
    return data
}

export const unlikeBeatAction = async (beatId: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/beats/dislike/${beatId}` )
    return data
}

export const checkIfBeatLiked = async (beatId: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/beats/findLiked/${beatId}` )
    return data
}

export const repostBeatAction = async (beatId: string) => {
    console.log(beatId)
    const {data} = await $authHost.post(`http://localhost:5000/api/beats/repost/${beatId}` )
    return data
}

export const unrepostBeatAction = async (beatId: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/beats/unrepost/${beatId}` )
    return data
}

export const checkIfBeatReposted = async (beatId: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/beats/findReposted/${beatId}` )
    return data
}