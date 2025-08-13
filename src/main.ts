import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Bootstraps the Angular application.
 * Initializes the application with the root component (AppComponent) and the application configuration (appConfig).
 */
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
