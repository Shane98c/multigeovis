import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { AboutPage } from '../about/about'
import { FilterService } from '../../shared/filter.service'
import { ReqData } from '../../shared/reqData.service'
// import { LocService } from '../../shared/loc.service'
import "../../shared/leaflet.min.js";
import "../../shared/leaflet.minichart.min.js";
declare var L: any;

import * as search from '../../shared/Search_10'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FilterService, ReqData]
})
export class HomePage {
  constructor(public filterService: FilterService, public reqData: ReqData, public navCtrl: NavController, public loadingCtrl: LoadingController) {}

  public map:any;
  //need to handle timeslice math here somehow using range and timestep
  public timeSlice:number = 0;
  public now:number = 0;
  public timeStep:number = 10;
  public range:Array<number> = [];
  public charts:any = [];
  public chartType:string = 'polar-area';
  public circles:any = [];
  public data:any = [];
  public types:Array<string> = [];
  public colors:Array<string> = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99']
  public legend:Array<Object> = [];
  public commonNames: Array<string>;

  ngOnInit(): void {
    this.mapCtrl();
    this.getData();
    this.createLegend();
  }
  createLegend() {
    let i = 0;
    for (let type of this.commonNames) {
      this.legend.push({
        type: type,
        color: this.colors[i]
      })
      i++;
    }
  }
  getData() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.types = ['Pinus', 'Picea', 'Quercus', 'Ambrosia', 'Betula'];
    this.commonNames = ['Pine', 'Spruce', 'Oak', 'Ragweed', 'Birch'];
    this.range = [0, 5000];
    // this.timeSlice = this.range[1]/this.timeStep
    this.reqData.requestData(search)
    .then(response => {
      let rawReturns = [];
      for (let resp of response) {
        let respjson = JSON.parse(resp._body)
        if (respjson.data.length == 1) {
          rawReturns.push(respjson.data[0]);
        }
      }
      for (let raw of rawReturns) {
        this.data.push(this.filterService.formatData(raw, this.timeStep, this.types, this.range));
      }
      loading.dismiss();
      this.addGraphs(this.data);
    });
  }
  mapCtrl(): void {
    this.map = new L.Map('map', {
      center: new L.LatLng(45.731253, -93.996139),
      zoom: 7,
      zoomControl:false
    });
    L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
        maxZoom: 18,
    }).addTo(this.map);
  }
  addGraphs(procSamples): void {
    for (let i = 0; i < procSamples.length; i++) {
      let data = [];
      for (let j = 0; j < procSamples[i].types.length; j++) {
        data.push(procSamples[i].data[this.timeSlice].sampleData[j].value);
      }
      let loc = [procSamples[i].site.Latitude, procSamples[i].site.Longitude];
      let circleOptions = {
        radius: 30,
        fillOpacity: 0,
        opacity: 0
      };
      let chartOptions = {
        data: data,
        type: this.chartType,
        labels: this.types,
        labelMinSize: 1,
        transitionTime: 250,
        width: 100,
        opacity: 0.9,
        colors: this.colors
      };
      this.charts[i] = new L.minichart(loc, chartOptions).addTo(this.map);
      this.circles[i] = new L.CircleMarker(loc, circleOptions).addTo(this.map);
      this.charts[i].ID = procSamples[i].ID;
      this.circles[i].ID = procSamples[i].ID;
      this.circles[i].on('click',(e) => this.onMapClick(e));
    }
    this.updateGraphs();
    this.map.on('locationfound', (e) => this.onLocationFound(e));
    this.map.on('locationerror', (e) => this.onLocationError(e));
  }
  onLocationFound(e) {
    let radius = e.accuracy / 2;
    L.circle(e.latlng, radius).addTo(this.map);
  }
  onLocationError(e) {
    alert(e.message);
  }
  updateGraphs(): void {
    this.now = (this.range[1]/this.timeStep)*this.timeSlice;
    for (let i = 0; i < this.charts.length; i++) {
      let data = [];
      let opac = 0.9;
      let missingData = 0
      for (let j = 0; j < this.data[i].types.length; j++) {
        if (this.data[i].data[this.timeSlice].sampleData[j].value == 1) {
          missingData++;
        }
        if (missingData == this.data[i].types.length) {
          opac = 0;
        }
        data.push(this.data[i].data[this.timeSlice].sampleData[j].value);
      }
      this.charts[i].setOptions({
        data: data,
        type: this.chartType,
        opacity: opac
      })
    }
  }
  toggleGraphType(): void {
    if (this.chartType == 'bar') {
      this.chartType = 'polar-area'
    } else {
      this.chartType = 'bar';
    }
    this.updateGraphs();
  }
  fabLocate():void {
    this.map.locate({setView: true, maxZoom: 8});
  }
  onMapClick(e):void {
    let data = {};
    for (let i = 0; i < this.data.length; i++) {
      if (e.target.ID == this.data[i].ID) {
        data = this.data[i]
      }
    }
    this.navCtrl.push(AboutPage, {
      colors: this.colors,
      data: data
    });
  }
}
