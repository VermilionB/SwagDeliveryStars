import {$authHost, $host} from "./index";

export const createComment = async (comment: string, beatId: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/comments/create/${beatId}`, {comment: comment})
    return data
}

export const createRating = async (rating: number, beatId: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/ratings/create/${beatId}`, {rating: rating})
    return data
}

export const getRatingByUserAndBeat = async(userId: string, beatId: string) => {
    if (userId && beatId) {
        const {data} = await $host.get(`http://localhost:5000/api/ratings/user/${userId}/beat/${beatId}`)
        return data
    }
}
