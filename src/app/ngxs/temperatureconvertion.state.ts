import { Observable } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { Action, Selector, State, Store,StateContext } from '@ngxs/store';
import { ConvertTemperatureModel,GetTemperatureListModel } from './temperatureconvertion.action';
import {TemperatureService} from "../service/temperatureService";

export interface TemperatureStateModel 
{
    convert:any;
    getTemp: any;
}


@State<TemperatureStateModel>(
{
  name: "TemperatureState",
  defaults: 
  {
    convert: {},
    getTemp:[]
  },
})
export class TemperatureState
{
  _temperatureService:TemperatureService;
  _data:number;
  constructor(temperatureService:TemperatureService) 
  {
    this._temperatureService = temperatureService;

  }

  @Action(ConvertTemperatureModel)
  convertTemperature({ getState, setState }: StateContext<TemperatureStateModel >,{tempData}: ConvertTemperatureModel)
  {
    const state =  getState();
    return this._temperatureService.postTemperatureValue(tempData).pipe(
    tap((result) => 
    {
      setState(
      {
          ...state,
          convert: result
      });    
    }))
  }


  @Action(GetTemperatureListModel)
  getTemperatureListModel({ getState, setState }: StateContext<TemperatureStateModel >)
  {
    const state =  getState();
    return this._temperatureService.getTemperatureList().pipe
    (
      tap((result) => 
      {
        
        setState(
        {
          ...state,
          getTemp: result
        });
      })
    )
     
  }
  

}