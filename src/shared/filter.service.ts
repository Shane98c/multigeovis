import { Injectable } from '@angular/core';
import { dataSet } from './dataSet';

@Injectable()
export class FilterService {
  constructor() { }
  formatData(rawData, stepNum) {
    var data = rawData.data[0].Samples;
    var ages: number[] = [];
    for (var i:number = 0; i < data.length; i++) {
      ages.push(data[i].SampleAges[1].AgeOlder);
    };
    let maxAge = Math.max.apply(Math, ages);
    let minAge = Math.min.apply(Math, ages);
    let step: number = maxAge/stepNum;
    let ageBinData:any[] = [];
    let binAge: number = undefined;
    for (var i: number = 0; i < data.length; i++) {
      for (var j: number = 0; j < stepNum; j++){
        var curAge = data[i].SampleAges[1].AgeOlder;
        if (curAge > step*j && curAge < step*(j+1)) {
          binAge = step*(j+1);
          ageBinData.push({
            binAge: binAge,
            SampleData: data[i].SampleData
          });
        }
      }
    }
    for (var i:number = 0; i < ageBinData.length; i++){
      ageBinData[i].SampleData.sort((a, b) => {
        return  b.Value - a.Value;
      });
      ageBinData[i].SampleData = ageBinData[i].SampleData.slice(0, 4);
    }
    console.log(ageBinData);
  }
}
