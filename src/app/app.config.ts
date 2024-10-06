import { provideHttpClient, withFetch, withJsonpSupport } from '@angular/common/http'
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideRouter, withPreloading } from '@angular/router'
import { QuicklinkStrategy } from 'ngx-quicklink'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

import { routes } from './app.routes'
import { provideAuth } from './core/auth/auth.provider'
import { registerLocaleData } from '@angular/common'
import { provideIcons } from './core/icons/icons.provider'
import localeVi from '@angular/common/locales/vi'
registerLocaleData(localeVi)

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withPreloading(QuicklinkStrategy)),
		provideClientHydration(),
		provideHttpClient(withJsonpSupport(), withFetch()),
		provideAnimationsAsync(),
		provideIcons(),
		provideAuth(),
		{ provide: LOCALE_ID, useValue: 'vi' },
		provideAnimationsAsync(),
	],
}
