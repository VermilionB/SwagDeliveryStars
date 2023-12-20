import {$authHost, $host} from "./index";

export const getAllLicensesTypes = async () => {
    const {data} = await $authHost.get('http://localhost:5000/api/licenses/types/')
    return data
}

export const getLicenseTypeById = async (id :number) => {

    const {data} = await $host.get(`http://localhost:5000/api/licenses/types/${id}`)
    return data
}