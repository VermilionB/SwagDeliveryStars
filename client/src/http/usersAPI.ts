import {$authHost, $host} from "./index";
import {jwtDecode } from 'jwt-decode';
import { AxiosRequestConfig } from "axios";

export interface UserData {
    id: string;
    username: string;
    avatar_url: string;
    bio: string;
    followers_followers_who_followsTousers: [{
        who_follows: string,
        who_followed: string
    }];
    followers_followers_who_followedTousers: [{
        who_follows: string,
        who_followed: string
    }];
    plays: [],
    beats: []
}
export const registration = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    console.log(formData)
    const {data} = await $host.post('http://localhost:5000/api/auth/registration', formData, config)
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const login = async (email: string, password: string) => {
    const {data} = await $host.post('http://localhost:5000/api/auth/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const getUserById = async (id: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/users/${id}`)
    return data
}

export const check = async () => {
    const {data} = await $authHost.get('http://localhost:5000/api/auth/check' )
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchAvatarFile = async (id: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/file-upload/${id}` )
    return data
}

export const followProducer = async (userId: string) => {
    console.log(userId)
    const {data} = await $authHost.post(`http://localhost:5000/api/users/follow/${userId}` )
    return data
}

export const unfollowProducer = async (id: string) => {
    const {data} = await $authHost.post(`http://localhost:5000/api/users/unfollow/${id}` )
    return data
}

export const findFollowed = async (id: string) => {
    const {data} = await $authHost.get(`http://localhost:5000/api/users/findFollowed/${id}` )
    return data
}
