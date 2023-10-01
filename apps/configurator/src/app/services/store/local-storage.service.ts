import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  public get<T>(key:  string | undefined): T | undefined | null {
    if (key) {
      const obj = sessionStorage.getItem(key);

      return obj ? JSON.parse(obj) as T : null;
    }

    return undefined;
  }

  public set(key: string | undefined, data: unknown): void {
    if (key) {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  public delete(key:  string | undefined): void {
    if (key) {
      sessionStorage.removeItem(key);
    }
  }
}
