import { InjectionToken } from '@angular/core';

export interface AppConfigInterface 
{
  GETAPI_ENDPOINT: string;
  
}

export const APP_CONFIG = new InjectionToken('app.config');
export const AppConfig: AppConfigInterface = 
{
 
   GETAPI_ENDPOINT: 'http://3.12.209.219/'
  
  
};