import { Injectable } from '@angular/core';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  public get<T>(key:  string | undefined): T | undefined | null {
    if (key) {
      const obj = localStorage.getItem(key);

      return obj ? JSON.parse(decompressFromUTF16(obj)) as T : null;
    }

    return undefined;
  }

  public set(key: string | undefined, data: unknown): void {
    if (key) {
      localStorage.setItem(key, compressToUTF16(JSON.stringify(data)));
    }
  }

  public delete(key:  string | undefined): void {
    if (key) {
      localStorage.removeItem(key);
    }
  }
}
