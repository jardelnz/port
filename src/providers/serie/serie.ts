import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Config } from '../../config/config'


/*
  Generated class for the SerieProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SerieProvider {

  constructor(private http: HttpClient, public config: Config) {

  }

  historico(token, serie) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      this.http.get(this.config.urlApi() + "/serie/historico/" + serie + "", httpOptions)
        .subscribe(data => {
          resolve(data);
        });

    });
  }

  serieCompleta(token, serie) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      this.http.get(this.config.urlApi() + "/serie/seriecompleta/" + serie + "", httpOptions)
        .subscribe(data => {
          resolve(data);
        });

    });
  }

  statusMonitoramento(token, serie) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token,
          'serie': serie
        })
      };

      this.http.get(this.config.urlApi() + "/ndd/serie/", httpOptions)
        .subscribe(data => {
          resolve(data);
        });

    });
  }

}
