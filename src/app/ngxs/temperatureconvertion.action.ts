export class ConvertTemperatureModel 
{
    static readonly type = '[Temperature] PostTemperatureValue';
    constructor(public tempData: any) {
    }
}
  
export class GetTemperatureListModel 
{
    static readonly type = '[Temperature] GetTemperatureList';
    
}




