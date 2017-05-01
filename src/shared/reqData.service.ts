import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReqData {
  constructor(private http: Http) { }
  public data = [];
  // get(search): Promise <any> {
  //   console.log(search);
  //   this.requestData(this.parseSites(search))
  //   .then(data => {
  //     return this.data as any;
  //   });
  //   return this.data as any;;
  // }
  parseSites(search) {
    let siteIds = [];
    for (let i = 0; i < search.sites.length; i++) {
      siteIds.push(search.sites[i].SiteID);
    }
    return siteIds;
  }
  requestData(search): Promise <any> {
    let siteIds = this.parseSites(search);
    let promises = [];
    let rawResponse = [];
    console.log(siteIds)
    for (let siteId of siteIds) {
      const url = ['http://api.neotomadb.org/v1/data/downloads/', siteId].join('');
      let promise = this.http.get(url).toPromise();
      promises.push(promise);
    }
    return Promise.all(promises)
  }
}

// for (let resp of response) {
//   if (resp._body.length == 1) {
//     this.data.push(resp._body.data);
//   }
// }
