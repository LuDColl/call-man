import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { provideClientHydration } from '@angular/platform-browser';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideBrowserGlobalErrorListeners(),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
    }),
    importProvidersFrom(
      LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG,
      }),
    ),
  ],
};
