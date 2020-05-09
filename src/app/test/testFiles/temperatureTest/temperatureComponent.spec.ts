import { TestBed, async } from '@angular/core/testing';
import { TemperatureComponent } from '../../../temperatureComponent/temperature.component';
import {ComponentFixture} from '@angular/core/testing';
import {AppModule} from '../../../app.module';
import {DebugElement} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { By } from '@angular/platform-browser';

describe('TemperatureComponent', () => 
{
  let temperatureComponent: TemperatureComponent;

  let fixture:ComponentFixture<TemperatureComponent>;

  let debugElement: DebugElement;

  beforeEach(async(() => 
  {
    TestBed.configureTestingModule(
      {
         imports: [
          AppModule,
          NoopAnimationsModule
        ]
       
      }).compileComponents()
      .then(()=>
      {
        fixture = TestBed.createComponent(TemperatureComponent);

        temperatureComponent = fixture.componentInstance;

        debugElement = fixture.debugElement;
      });

      
  }));

  it('should create the app', () => {
   
    expect(temperatureComponent).toBeTruthy();
    //const val =debugElement.query(By.css(".course-cards"));
    
    //expect(val.nativeElement.style.color = 'blue');
  });



});

