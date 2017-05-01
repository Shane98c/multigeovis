import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { AboutPage } from '../about/about'
import { FilterService } from '../../shared/filter.service'
import { ReqData } from '../../shared/reqData.service'

// import { LocService } from '../../shared/loc.service'
// import { rawData } from '../../shared/data/rawData';
import "../../shared/leaflet.minichart.js";
import * as search from '../../shared/Search_12'

declare var L: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FilterService, ReqData]
})
export class HomePage {
  public map:any;
  public timeSlice:any = 0;
  public charts:any = [];
  public chartType = 'polar-area'
  public circles:any = [];
  public data:any = [];
  public types:Array<string> = [];
  constructor(public filterService: FilterService, public reqData: ReqData, public navCtrl: NavController, public loadingCtrl: LoadingController) {}
  ngOnInit(): void {
    this.mapCtrl();
    this.getData();
  }
  getData() {
    this.types = ['Pinus', 'Picea', 'Ambrosia'];
    let range = [0, 20000];
    let rawData = this.reqData.requestData(search)
    .then(response => {
      let rawReturns = [];
      for (let resp of response) {
        let respjson = JSON.parse(resp._body)
        if (respjson.data.length == 1) {
          rawReturns.push(respjson.data[0]);
        }
      }
      console.log(rawReturns)
      for (let raw of rawReturns) {
        console.log(raw)
        this.data.push(this.filterService.formatData(raw, 20, this.types, range));
      }
      this.addGraphs(this.data);
    });
  }
  mapCtrl(): void {
    this.map = new L.Map('map', {
      center: new L.LatLng(45.731253, -93.996139),
      zoom: 7
    });
    L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
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
        transitionTime: 250
      };
      this.charts[i] = new L.minichart(loc, chartOptions).addTo(this.map);
      this.circles[i] = new L.CircleMarker(loc, circleOptions).addTo(this.map);
      this.charts[i].ID = procSamples[i].ID;
      this.circles[i].ID = procSamples[i].ID;
      this.circles[i].on('click',(e) => this.onMapClick(e));
    }
  }
  updateGraphs(): void {
    for (let i = 0; i < this.charts.length; i++) {
      let data = [];
      let opac = 1;
      for (let j = 0; j < this.data[i].types.length; j++) {
        if (this.data[i].data[this.timeSlice].sampleData[j].value == 1) {
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
    console.log('find position');
  }
  onMapClick(e):void {
    let data = {};
    for (let i = 0; i < this.data.length; i++) {
      if (e.target.ID == this.data[i].ID) {
        data = this.data[i]
      }
    }
    this.navCtrl.push(AboutPage, {
      data: data
    });
  }
}
