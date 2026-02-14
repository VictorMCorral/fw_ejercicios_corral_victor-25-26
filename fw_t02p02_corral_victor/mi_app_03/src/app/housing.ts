import { Injectable, inject } from '@angular/core';

import { HousingLocationInfo } from './housinglocation';
import { LocalStorageService } from './services/localstorage.service';
import { InterfaceHouseForm } from './interfaces/interface-house-form';


@Injectable({
  providedIn: 'root',
})


export class HousingService {
  readonly url = 'https://dwec-fw-gp.vercel.app/api/houses';
  private LocalstorageService = inject(LocalStorageService);

  submitApplication(
    firstName: string,
    lastName: string,
    email: string,
    housingLocationId: number,
  ): void {
    // Crear el objeto de consulta
    const apply: InterfaceHouseForm = {
      id: 0,
      firstName: firstName,
      lastName: lastName,
      email: email,
      housingLocationId: housingLocationId,
      consultaDate: new Date(),
    };

    // Guardar en localStorage
    this.LocalstorageService.saveV2Application(apply);

    console.log('Consulta guardada:', apply);
    alert('Appy sent successfully!');
  }


  async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async getHousingLocationById(id: number): Promise<HousingLocationInfo |
    undefined> {
    const data = await fetch(`${this.url}?id=${id}`);
    const locationJson = await data.json();
    return locationJson[0] ?? {};
  }

}

