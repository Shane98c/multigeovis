import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev';
import { AboutPage } from '../about/about'
import { UnderService } from '../../shared/under.service'
import { LocService } from '../../shared/loc.service'
import { layers } from '../../shared/layers'

let geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "message": "Foo",
                "iconSize": [60, 60]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -66.324462890625,
                    -16.024695711685304
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Bar",
                "iconSize": [50, 50]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -61.2158203125,
                    -15.97189158092897
                ]
            }
        }
    ]
};
const accessToken = 'pk.eyJ1IjoiZmx5b3ZlcmNvdW50cnkiLCJhIjoiNDI2NzYzMmYxMzI5NWYxMDc0YTY5NzRiMzdlZDIyNTAifQ.x4T-qLEzRQMNFIdnkOkHKQ';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UnderService, LocService]
})
export class HomePage {
  public map : any;
  constructor(public underService: UnderService, public locService: LocService, public navCtrl: NavController, public loadingCtrl: LoadingController) {
    (mapboxgl as any).accessToken = accessToken;
  }
  ngOnInit(): void {
    this.mapCtrl();
  }

  mapCtrl(): void {
    this.map = new mapboxgl.Map({
      center: [-94.349742, 45.98909],
      zoom: 5,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9'
    });
    this.map.on('load', () => {
      console.log('map load');
    // create a DOM element for the marker
    let el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(https://placekitten.com/g/' + geojson.features[0].properties.iconSize.join('/') + '/)';
    el.style.width = geojson.features[0].properties.iconSize[0] + 'px';
    el.style.height = geojson.features[0].properties.iconSize[1] + 'px';

        // add marker to map
        new mapboxgl.Marker(el)
            .setLngLat(geojson.features[0].geometry.coordinates)
            .addTo(this.map);
    })
  }
  fabLocate(): void {
    console.log('fab press');
    document.getElementsByClassName('marker', (el) => {
      let els = el;
      els.style.width = '200 px';
      els.style.height = '200 px';
    });

  }
}
