import 'zone.js';
import 'reflect-metadata';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {CalendarModule} from './calendar-module';

platformBrowserDynamic().bootstrapModule(CalendarModule);
