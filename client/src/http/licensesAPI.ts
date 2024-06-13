import {$authHost, $host} from "./index";

export const getAllLicensesTypes = async () => {
    const {data} = await $authHost.get('api/licenses/types/')
    return data
}

export const getLicenseTypeById = async (id :number) => {

    const {data} = await $host.get(`api/licenses/types/${id}`)
    return data
}