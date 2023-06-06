import { Injectable } from '@angular/core';

@Injectable()
export class Config {

    //public url = 'http://10.1.1.12:3000';
    //public server = 'Homologação';

    public url = 'http://201.49.222.4:3001';
    public server = 'Produção';

    //public url = 'http://localhost:3000';
    //public server = 'Homologação Local';

    public urlApi() {
        return this.url;
    }

    public versao = "2.4.0";

    public tokenA = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ0aXBvIjoiY2hhdmVwdWJsaWNhIn0.64Z6O_jy1_8wqWmTaj4FzaDx_J7u4xQ0lODP5vtIkyU"

}