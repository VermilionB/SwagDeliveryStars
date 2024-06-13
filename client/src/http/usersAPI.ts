import {$authHost, $host} from "./index";
import {jwtDecode} from 'jwt-decode';
import {AxiosRequestConfig} from "axios";
import {BeatsInterface} from "../store/beatStore";

export interface UserData {
    user: {
        id: string;
        username: string;
        avatar_url: string;
        bio: string;
        contact_info: string
        followers_followers_who_followsTousers: [{
            who_follows: string,
            who_followed: string
        }];
        followers_followers_who_followedTousers: [{
            who_follows: string,
            who_followed: string
        }];
        beats: [],
        is_banned: boolean
        reposts: [
            {
                beats: BeatsInterface
            }
        ],
        social_links: {
            id: string,
            youtube: string;
            soundcloud: string;
            facebook: string;
            twitter: string;
            instagram: string;
            tiktok: string;
            twitch: string;
        }
    },
    totalPlays: number
}

export const registration = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $host.post(`api/auth/registration`, formData, config)
    localStorage.setItem(`token`, data.token)
    return jwtDecode(data.token);
}

export const login = async (email: string, password: string) => {
    const {data} = await $host.post(`api/auth/login`, {email, password})
    localStorage.setItem(`token`, data.token)
    return jwtDecode(data.token);
}

export const getUserById = async (id: string) => {
    const {data} = await $authHost.get(`api/users/${id}`)
    return data
}

export const check = async () => {
    const {data} = await $authHost.get(`api/auth/check`)
    localStorage.setItem(`token`, data.token)
    return jwtDecode(data.token)
}

export const fetchAvatarFile = async (id: string) => {
    const {data} = await $authHost.get(`api/file-upload/${id}`)
    return data
}

export const followProducer = async (userId: string) => {
    const {data} = await $authHost.post(`api/users/follow/${userId}`)
    return data
}

export const unfollowProducer = async (id: string) => {
    const {data} = await $authHost.post(`api/users/unfollow/${id}`)
    return data
}

export const findFollowed = async (id: string) => {
    const {data} = await $authHost.get(`api/users/findFollowed/${id}`)
    return data
}

export const updateUserData = async (formData: FormData, config: AxiosRequestConfig<any> | undefined) => {
    const {data} = await $authHost.put(`api/users`, formData, config)
    return data
}

export const getAllUsers = async (searchValue: string, userId: string | null = null) => {
    const {data} = await $host.get(`api/users?username=${searchValue}&userId=${userId}`)
    return data
}

export const blockUser = async (userId: string) => {
    const {data} = await $authHost.put(`api/users/block/${userId}`)
    return data
}

export const unblockUser = async (userId: string) => {
    const {data} = await $authHost.put(`api/users/unblock/${userId}`)
    return data
}
