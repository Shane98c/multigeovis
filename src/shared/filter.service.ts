import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
  constructor() { }

  public types: Array<string>;
  public stepNum: number;
  public processed:any;
  public typedData:any;

  formatData(rawData, stepNum, types) {
    //set initial data values
    this.processed = {};
    this.typedData = [];
    let data = rawData.data[0];
    this.types = types;
    this.stepNum = stepNum;
    this.processed.site = data.Site;
    this.processed.ID = data.DatasetID;
    this.processed.PI = data.DatasetPIs;
    //begin processing
    this.combineNames(data);
  }

  combineNames(data) {
    let samples = data.Samples;
    let procSamples = [];
    for (let j = 0; j < samples.length; j++) {
      let typedData = [];
      let combineDups = [];
      for (let i = 0; i < this.types.length; i++) {
        combineDups.push(0);
      }
      for (let k = 0; k < samples[j].SampleData.length; k++) {
        for (let i = 0; i < this.types.length; i++){
          if (samples[j].SampleData[k].TaxonName.indexOf(this.types[i]) >= 0) {
            combineDups[i] = combineDups[i] + samples[j].SampleData[k].Value;
          }
        }
      }
      for (let i = 0; i < this.types.length; i++) {
        typedData.push({
          taxonName: this.types[i],
          value: combineDups[i]
        });
      }
      procSamples.push({
        age: samples[j].SampleAges[1].AgeOlder,
        sampleData: typedData
      })
    }
    this.binAges(procSamples);
  }
  binAges(procSamples) {
    let ages: number[] = [];
    for (let i:number = 0; i < procSamples.length; i++) {
      ages.push(procSamples[i].age);
    };
    let maxAge = Math.max.apply(Math, ages);
    let minAge = Math.min.apply(Math, ages);
    let step: number = maxAge/this.stepNum;
    let ageBinData:any[] = [];
    for (let k = 1; k < this.stepNum + 1; k++) {
      let currentBin = k * step;
      let prevBin = k * step - step;
      let combinedVal = [];
      for (let j = 0; j < this.types.length; j++) {
        combinedVal.push(0);
      }
      for (let i = 0; i < procSamples.length; i++) {
        if (procSamples[i].age <= currentBin && procSamples[i].age >= prevBin) {
          for (let j = 0; j < this.types.length; j++) {
            combinedVal[j] = combinedVal[j] + procSamples[i].sampleData[j].value;
          }
        }
      }
      let binnedData = [];
      for (let i = 0; i < this.types.length; i++) {
        binnedData.push({
          taxonName: this.types[i],
          value: combinedVal[i]
        });
      }
      ageBinData.push({
        binAge: currentBin,
        sampleData: binnedData,
      });
    }
    this.processed.data = ageBinData;
    console.log(this.processed)
  }


    // let data = rawData.data[0].Samples;
    // let ages: number[] = [];
    // for (let i:number = 0; i < data.length; i++) {
    //   ages.push(data[i].SampleAges[1].AgeOlder);
    // };
    // let maxAge = Math.max.apply(Math, ages);
    // let minAge = Math.min.apply(Math, ages);
    // let step: number = maxAge/stepNum;
    // let ageBinData:any[] = [];
    // let binAge: number = undefined;
    // for (let i: number = 0; i < data.length; i++) {
    //   //loop through all sample points in the dataset
    //   for (let j: number = 0; j < stepNum; j++) {
    //     //break the data into bins based on specified step number
    //     let curAge = data[i].SampleAges[1].AgeOlder;
    //     if (curAge > step*j && curAge < step*(j+1)) {
    //       binAge = step*(j+1);
    //       let taxonNames = [];
    //       for (let k = 0; k < data[i].SampleData.length; k++) {
    //         taxonNames.push(data[i].SampleData[k].TaxonName);
    //       };
    //       ageBinData.push({
    //         SampleData: data[i].SampleData,
    //         names: taxonNames
    //       });
    //       let ageBin = {
    //         binAge: binAge,
    //         ageBinData: ageBinData
    //       }
    //     }
    //   }
    // }
    // for (let i:number = 0; i < ageBinData.length; i++){
    //   // console.log(_.intersection(ageBinData[i].names, ageBinData[i+1].names));
    //   // ageBinData[i].SampleData.sort((a, b) => {
    //   //   return  b.Value - a.Value;
    //   // });
    //   // ageBinData[i].SampleData = ageBinData[i].SampleData.slice(0, 10);
    // }
    // console.log(ageBinData);
    // this.combineNames(ageBinData)
}
