import { Injectable, inject } from '@angular/core';
import { HousingLocationInfo } from './housinglocation';

import { LocalStorageService } from './services/localstorage.service';
import { InterfaceHouseForm } from './interfaces/interface-house-form';


@Injectable({
  providedIn: 'root',
})


export class HousingService {
  readonly url = 'https://dwec-fw-gp.vercel.app/api/houses';

  submitApplication(firstName: string, lastName: string, email: string, housingLocationId: number) {
    console.log(
      `Homes application received: firstName: ${firstName}, lastName:
                                ${lastName}, email: ${email}.`,
    );
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

