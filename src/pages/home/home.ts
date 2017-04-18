import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
// import { AboutPage } from '../about/about'
import { FilterService } from '../../shared/filter.service'
// import { LocService } from '../../shared/loc.service'
// import "leaflet";
// declare var minichart: any;
import { rawData } from '../../shared/rawData';
import "../../shared/leaflet.minichart.min.js";

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
  }
  addGraph(): void {
    for (var i = 0; i < 10; i++) {
      var data = [33,33,33]
      var loc = [(45.731253+i*Math.random()+1), (-93.996139+i*Math.random()+1)];
      this.charts[i] = L.minichart(loc, {data: data, type:'polar-area'});
      this.map.addLayer(this.charts[i]);
    }
  }
  updateGraphs(): void {
    console.log(this.timeSlice);
    for (var i = 0; i < this.charts.length; i++) {
      this.charts[i].setOptions({data:[Math.random()*this.timeSlice,this.timeSlice*Math.random(),this.timeSlice*Math.random()]})
    }
  }
  fabLocate(): void {
    this.filterService.formatData(rawData, 20);
  }
}
