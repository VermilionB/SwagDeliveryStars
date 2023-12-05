import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";

@Injectable()
export class LicensesService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllLicensesTypes() {
        return this.prisma.license_types.findMany({})
    }

    async getLicenseTypeById(id) {
        return this.prisma.license_types.findUnique({
            where: {id : +id.id},
            select: {
                id: true,
                license_type: true,
                description: true
            }
        })
    }
}
