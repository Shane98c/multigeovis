import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
// import { AboutPage } from '../about/about'
import { FilterService } from '../../shared/filter.service'
// import { LocService } from '../../shared/loc.service'
// import "leaflet";
// declare var minichart: any;
import { rawData } from '../../shared/rawData';
import "../../shared/leaflet.minichart.js";

declare var L: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FilterService]
})
export class HomePage {
  public map:any;
  public timeSlice:any = 0;
  public charts:any = [];
  public circles:any = [];
  public data:any = [];
  constructor(public filterService: FilterService, public modalCtrl: ModalController, public navCtrl: NavController, public loadingCtrl: LoadingController) {}
  ngOnInit(): void {
    this.mapCtrl();
    // this.addGraphs();
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
    // this.map.on('click', this.onMapClick);
  }
  addGraphs(procSamples): void {
    for (let i = 0; i < procSamples.length; i++) {
      let data = [];
      for (let j = 0; j < procSamples[i].types.length; j++) {
        data.push(procSamples[i].data[this.timeSlice].sampleData[j].value);
      }

      console.log(procSamples);
      let loc = [procSamples[i].site.Latitude, procSamples[i].site.Longitude];
      let circleOptions = {
        radius: 30,
        fillOpacity: 0,
        opacity: 0
      };
      this.charts[i] = new L.minichart(loc, {data: data, type:'polar-area'}).addTo(this.map);
      this.circles[i] = new L.CircleMarker(loc, circleOptions).addTo(this.map);
      this.charts[i].ID = procSamples[i].ID;
      this.circles[i].ID = procSamples[i].ID;
      this.circles[i].on('click',(e) => this.onMapClick(e));
    }
  }
  updateGraphs(): void {
    console.log(this.timeSlice);
    for (let i = 0; i < this.charts.length; i++) {
      let data = [];
      for (let j = 0; j < this.data[i].types.length; j++) {
        data.push(this.data[i].data[this.timeSlice].sampleData[j].value);
      }
      console.log(this.data);
      console.log(data);
      this.charts[i].setOptions({
        data: data
      })
    }
  }
  fabLocate(): void {
    var types = ['Pinus', 'Picea', 'Ambrosia'];
    this.data.push(this.filterService.formatData(rawData, 20, types));
    this.addGraphs(this.data);
  }
  onMapClick(e):void {
    console.log(e);
  }
}
// var options = {
//   data: [33,33,33],
//   type:'polar-area',
//   width:111,
//   labels: ["sdf","sldkfj", "slkfj"]
// };
// var chartTest = new L.minichart([45.731253,-93.996139], options).addTo(this.map);
// chartTest.on("click",(e) => this.onMapClick(e));
