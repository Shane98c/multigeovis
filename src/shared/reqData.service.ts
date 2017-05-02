import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReqData {
  constructor(private http: Http) { }
  public data = [];
  parseSites(search) {
    let datasetIDs = [];
    for (let i = 0; i < search.sites.length; i++) {
      datasetIDs.push(search.sites[i].Datasets[0].DatasetID);
    }
    return datasetIDs;
  }
  requestData(search): Promise <any> {
    let datasetIDs = this.parseSites(search);
    let promises = [];
    for (let datasetID of datasetIDs) {
      const url = ['http://api.neotomadb.org/v1/data/downloads/', datasetID].join('');
      let promise = this.http.get(url).toPromise();
      promises.push(promise);
    }
    return Promise.all(promises)
  }
}
