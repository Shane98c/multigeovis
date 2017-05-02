import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import * as c3 from 'c3';
import * as d3 from 'd3';

// import { UnderService } from '../../shared/under.service'
// import { LocService } from '../../shared/loc.service'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: []
})
export class AboutPage {
  public data: any;
  public colors:any;
  public legend:Array<number>;
  constructor(private navCtrl: NavController, private navParams: NavParams, private loadingCtrl: LoadingController) {
  }
  @ViewChild('chart') chart: ElementRef;

  ngOnInit(){
    this.data = this.navParams.get('data');
    this.colors = this.navParams.get('colors');
    this.legend = this.buildLegend();
  }
  ionViewDidEnter(): void {
    let chart = this.chart.nativeElement;
    let columns:any = [];
    for (let i = 0; i < this.data.types.length; i++) {
      let data = [this.data.types[i]];
      for (let j = 0; j < this.data.data.length; j++) {
        data.push(this.data.data[j].sampleData[i].value);
      }
      columns.push(data);
    }
    columns.push(this.legend);
    c3.generate({
      bindto: chart,
      data: {
        x: 'x',
        columns: columns,
        type: 'area-spline'
      },
      axis: {
        y: {
          label: {
            text: 'Abundance (binned counts)',
            position: 'inner-middle'
          }
        },
        x: {
          label: {
            text: 'Time (ka)',
            position: 'outer-top'
          }
        },
        rotated: true
      },
      color: {
        pattern: this.colors
      },
    })
  }
  buildLegend() {
    let legend:any = ['x'];
    for (let data of this.data.data) {
      legend.push(data.binAge);
    }
    return legend;
  }
}
