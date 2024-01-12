import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { config, distinctUntilChanged, filter, first, interval, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardConfig } from '@configurator/shared';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ServerSyncService implements OnDestroy {
  private readonly remoteServerAddress = 'https://service.z-wave.me/z-uno-configurator/'
  private readonly interval$ = interval(1000 * 5);
  private readonly destroy$: Subject<void> = new Subject<void>();

  private firstLoad = true;

  private currentKey = '';
  constructor(
    private readonly httpClient: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
  ) { }

  public init(callback: (config: BoardConfig) => void): void {
    this.activatedRoute.queryParams
    .pipe(
      first(),
      map((data) => data['url']),
      filter(Boolean),
      switchMap(url => {
        this.currentKey = this.router.url.split('?')[0].split('/')[1];
        const config = this.localStorageService.get<BoardConfig>(this.currentKey);

        if (config?.remoteUrl === url) {
          return of(null);
        }

        return this.httpClient.get<{content: string}>(this.remoteServerAddress, {
          params: {
            short: url,
          }
        }).pipe(map(res => {
          console.warn(res);

          return JSON.parse(res.content);
        }),
          switchMap(config => this.httpClient.post<{
          content: string;
          url: string;
        }>(this.remoteServerAddress, config).pipe(map(c => ({...config, remoteUrl: c.url})))));
      }),
      filter(Boolean),
    )
    .subscribe((config) => {
      console.log('==========>', config);


      callback(config);

      // const data = JSON.parse(decompressFromEncodedURIComponent(decodeURIComponent(config)));
      // this._boardConfig$.next(data);
      //
      // this.httpClient.post('/create', {
      //   platform: key,
      //   config: data,
      // }).subscribe();
      // this.httpClient.get('/config', {params: {
      //     platform: key,
      //   }}).subscribe();
      // this.httpClient.put('/update', {
      //   config: data,
      // }, {
      //   params: {
      //     platform: key,
      //   }
      // }).subscribe();
      //
      // this.localStorageService.set(key, data);
    }).add(() => {
      console.log('DONE!');
      this.firstLoad = false;
    });

    this.interval$.pipe(
      takeUntil(this.destroy$),
      tap(() => console.log('TICK')),

      // map(() => this.router.url.split('?')[0].split('/')[1]),
      map((key) => {
        // this.currentKey = key;

        return this.localStorageService.get<BoardConfig>(this.currentKey);
      }),
      filter(Boolean),
      filter(() => !this.firstLoad),
      filter(config => !config.remoteUrl || !config.lastSyncTime || config.lastSyncTime < (config.lastChangedTime ?? 0)),
      switchMap((config) => {
        const removeConfigUrl = config.remoteUrl;

        if (removeConfigUrl) {
          console.warn('PUT');
          return this.httpClient.put<BoardConfig>(this.remoteServerAddress, config , {
            params: {
              short: removeConfigUrl,
            }
          }).pipe(map(() => config));
        }

        return this.httpClient.post<{
          content: string;
          url: string;
        }>(this.remoteServerAddress, config).pipe(map(c => ({...config, remoteUrl: c.url})));
      })
    ).subscribe((config) => {
      console.log(config);
      console.log();
      try {
        this.localStorageService.set(this.currentKey, { ...config, lastSyncTime: Date.now() });
      } catch {}

        const query = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {url: config.remoteUrl}}).toString();

        this.location.go(query);
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}