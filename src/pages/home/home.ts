import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
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
  public timeSlice:any;
  public charts:any = [];
  public circles:any = [];
  constructor(public filterService: FilterService, public navCtrl: NavController, public loadingCtrl: LoadingController) {}
  ngOnInit(): void {
    this.mapCtrl();
    this.addGraph();
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
  addGraph(): void {
    // var myCircle = new L.CircleMarker(new L.LatLng(50.924480, 10.758276), 10).addTo(this.map);
    // myCircle.bindPopup("click").openPopup();
    var options = {
      data: [33,33,33],
      type:'polar-area',
      width:111,
      labels: ["sdf","sldkfj", "slkfj"]
    };
    var chartTest = new L.minichart([45.731253,-93.996139], options).addTo(this.map);
    chartTest.on("click",(e) => this.onMapClick(e));
    for (var i = 0; i < 10; i++) {
      var data = [33,33,33]
      var loc = [(45.731253+i*Math.random()+1), (-93.996139+i*Math.random()+1)];
      this.charts[i] = new L.minichart(loc, {data: data, type:'polar-area'}).addTo(this.map);
      this.circles[i] = new L.CircleMarker(loc, 30).addTo(this.map);
      this.circles[i].on('click',(e) => this.onMapClick(e));
      this.map.addLayer(this.charts[i]);
      // this.charts[i].on("click",(e) => this.onMapClick(e));
    }
  }
  updateGraphs(): void {
    console.log(this.timeSlice);
    for (var i = 0; i < this.charts.length; i++) {
      this.charts[i].setOptions({data:[Math.random()*this.timeSlice,this.timeSlice*Math.random(),this.timeSlice*Math.random()]})
    }
  }
  fabLocate(): void {
    var types = ['Pinus', 'Picea'];
    this.filterService.formatData(rawData, 20, types);
  }
  onMapClick(e):void {
    console.log(e);
  }
}
