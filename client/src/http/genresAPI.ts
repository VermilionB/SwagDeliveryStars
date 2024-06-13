import {$authHost, $host} from "./index";


export const createGenre = async (genre: string) => {
    const {data} = await $authHost.post('api/genres/', {genre: genre})
    return data
}

export const getAllGenres = async () => {
    const {data} = await $authHost.get('api/genres/')
    return data
}