import {Controller, Get, Param} from '@nestjs/common';
import { LicensesService } from './licenses.service';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('/types')
  async getAllLicenseTypes() {
    return this.licensesService.getAllLicensesTypes();
  }

  @Get('/types/:id')
  async getLicenseTypeById(@Param() id: number) {
    return this.licensesService.getLicenseTypeById(id);
  }
}
