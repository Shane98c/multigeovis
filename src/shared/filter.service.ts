import { Injectable } from '@angular/core';
import { rawData } from './rawData';

@Injectable()
export class FilterService {
  constructor() { }
  formatData() {
    console.log(rawData);
  }


  // formatGeo(geo) {
  //   if(geo.geology) {
  //     var geology = geo.geology;
  //     geology.soilName = soils[geology.soils];
  //     var layers = ["mesozoic_cretaceous","mesozoic_jurassic","paleozoic_cambrian","paleozoic_devonian","paleozoic_ordovician","precambrian_archean", "precambrian_proterozoic"];
  //     var i = 0;
  //     var layerArr = [];
  //     for (i = 0; i < layers.length; i++) {
  //       if (geology.hasOwnProperty(layers[i])){
  //         var layerName = layers[i].replace("_", " ");
  //         layerArr.push(geology[layers[i]] + ': (' +layerName+')');
  //         geology.geolLayerContent = layerArr;
  //       }
  //     }
  //   }
  //   return geo;
  // }

}
