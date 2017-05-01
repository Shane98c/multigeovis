import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
  constructor() { }

  public types: Array<string>;
  public stepNum: number;
  public range: Array<number>;
  public processed:any;
  public typedData:any;

  formatData(rawData, stepNum, types, range) {
    //set initial data values
    let data = rawData.data[0];
    this.processed = {};
    this.types = types;
    this.stepNum = stepNum;
    this.range = range;
    this.processed.types = types;
    this.processed.site = data.Site;
    this.processed.ID = data.DatasetID;
    this.processed.PI = data.DatasetPIs;
    //begin processing
    this.combineNames(data);
    return this.processed;
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
    let maxAge = this.range[1];
    let minAge = this.range[0];
    // let maxAge = Math.max.apply(Math, ages);
    // let minAge = Math.min.apply(Math, ages);
    let step: number = maxAge/this.stepNum;
    this.processed.stepSize = step;
    let ageBinData:any[] = [];
    for (let k = 1; k < this.stepNum + 1; k++) {
      let currentBin = k * step;
      let prevBin = k * step - step;
      let combinedVal = [];
      for (let j = 0; j < this.types.length; j++) {
        //this is one instead of zero to avoid bug in leaflet minichart when values are zero...
        combinedVal.push(1);
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
  }
}
