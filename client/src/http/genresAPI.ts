import {$authHost, $host} from "./index";


export const createGenre = async (genre: string) => {
    const {data} = await $authHost.post('http://localhost:5000/api/genres/', {genre: genre})
    return data
}

export const getAllGenres = async () => {
    const {data} = await $authHost.get('http://localhost:5000/api/genres/')
    return data
}