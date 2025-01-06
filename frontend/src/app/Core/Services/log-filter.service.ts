import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LogFilterService {

  private filters: { [key: string]: boolean } = {
    info: true,
    warning: true,
    error: true
  };

  public getFilterValue(key: string): boolean {
    return this.filters[key]
  }

  public setFilter(key: string , value: boolean): void {
    if(this.filters.hasOwnProperty(key)){
      this.filters[key] = value;
    }
  }
}
