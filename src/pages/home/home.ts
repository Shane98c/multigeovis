import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { FilterService } from '../../shared/filter.service';
import { ReqData } from '../../shared/reqData.service';

//import leaflet and minicharts (both share L.xxx)
declare var L: any;
import "../../shared/leaflet.min.js";
import "../../shared/leaflet.minichart.min.js";


//Neotoma search list to be requested.
import * as search from '../../shared/data/Search_10';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FilterService, ReqData]
})
export class HomePage {
  constructor(public filterService: FilterService, public reqData: ReqData, public navCtrl: NavController, public loadingCtrl: LoadingController) {}

  public map:any;
  public timeSlice:number = 0;
  public now:number = 0;
  public charts:any = [];
  public circles:any = [];
  public legend:Array<Object> = [];
  public data:any = [];

  //config
  public colors:Array<string> = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99'];
  public types:Array<string> = ['Pinus', 'Picea', 'Quercus', 'Ambrosia', 'Betula'];
  public commonNames: Array<string> = ['Pine', 'Spruce', 'Oak', 'Ragweed', 'Birch'];
  public range:Array<number> = [0, 18000];
  public timeStep:number = 20;
  public chartType:string = 'polar-area';

  ngOnInit(): void {
    this.mapCtrl();
    this.getData();
    this.createLegend();
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
    this.map.on('locationfound', (e) => this.onLocationFound(e));
    this.map.on('locationerror', (e) => this.onLocationError(e));
  }
  getData() {
    let loading = this.loadingCtrl.create();
    loading.present();
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
      this.addGraphs(this.data);
      loading.dismiss();
    });
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
  addGraphs(procSamples): void {
    for (let i = 0; i < procSamples.length; i++) {
      let data = [];
      for (let j = 0; j < procSamples[i].types.length; j++) {
        data.push(procSamples[i].data[this.timeSlice].sampleData[j].value);
      }
      let loc = [procSamples[i].site.Latitude, procSamples[i].site.Longitude];
      //adding transparent circles as workaround for minchart bug w/click handling.
      let circleOptions = {
        radius: 30,
        fillOpacity: 0,
        opacity: 0
      };
      let chartOptions = {
        data: data,
        type: this.chartType,
        labels: this.commonNames,
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
      this.circles[i].on('click',(e) => this.onGraphClick(e));
    }
    this.updateGraphs();
  }
  onLocationFound(e) {
    let radius = e.accuracy / 2;
    L.circle(e.latlng, radius).addTo(this.map);
  }
  onLocationError(e) {
    alert(e.message);
  }
  fabLocate():void {
    this.map.locate({setView: true, maxZoom: 8});
  }
  updateGraphs(): void {
    //get current time for display
    this.now = (this.range[1]/this.timeStep)*this.timeSlice;
    for (let i = 0; i < this.charts.length; i++) {
      let data = [];
      let opac = 0.9;
      let missingData = 0;
      for (let j = 0; j < this.data[i].types.length; j++) {
        if (this.data[i].data[this.timeSlice].sampleData[j].value == 1) {
          missingData++;
        }
        //check if data is missing (1), and set to transparent if it is.
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
  onGraphClick(e):void {
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
