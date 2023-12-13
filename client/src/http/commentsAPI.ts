import {$authHost} from "./index";

export const createComment = async (comment: string, beatId: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/comments/create/${beatId}`, {comment: comment})
    return data
}