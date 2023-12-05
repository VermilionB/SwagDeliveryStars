import {$authHost, $host} from "./index";
import { AxiosRequestConfig } from "axios";

export const createBeat = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $authHost.post('http://localhost:5000/api/beats/', formData, config)
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