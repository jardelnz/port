import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from '../../config/config'
import { AgendaLocalProvider } from '../agenda-local/agenda-local';


@Injectable()
export class OsProvider {

  data: any;
  dados: any;
  produtos: any;
  arrayDeDados: any;
  selecao: any;

  constructor(public http: HttpClient, public config: Config, public agendaLocalProvider: AgendaLocalProvider,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

    /*
  load(token) {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };
    });
  }
  */
  agendaTecnico(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };


      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box">Carregando agenda...</div>
      </div>`,
        //content: 'Carregando agenda...'
      });

      loading.present();


      this.http.get(this.config.urlApi() + "/os/agenda/" + codusu + "", httpOptions).finally(
        () => {
          loading.dismiss();
        }
      )
        .subscribe(
          data => {
            resolve(data);
          },
          erro => {
            this.alertCtrl.create({
              title: 'Sem resposta do servidor.',
              subTitle: 'Não conseguimos conectar com o servidor, por favor, entre em contato com o suporte.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();
            console.log(erro);
          }
        );

    });
  };

  agendaTecnicoFiltro(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };


      this.http.get(this.config.urlApi() + "/os/agenda/" + codusu + "", httpOptions)
        .subscribe(
          data => {
            resolve(data);
          },
          erro => {
            console.log(erro);
          }
        );

    });
  };

  estoqueTecnico(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando o estoque...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/estoque/" + codusu + "", httpOptions)
        .subscribe(
          data => {

            resolve(data);
            loading.dismiss();

          },
          erro => {

            console.log(erro);
            loading.dismiss();

            this.alertCtrl.create({
              title: 'Falha na conexão',
              subTitle: 'Não foi possível carregar o seu estoque. Tente novamente mais tarde.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();

          }
        );

    });
  };

  estoqueTecnicoFiltro(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Pesquisando no estoque...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/estoque/" + codusu + "", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();

            this.alertCtrl.create({
              title: 'Falha na conexão',
              subTitle: 'Não foi possível carregar o seu estoque. Tente novamente mais tarde.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();

          }
        );

    });
  };

  retornaDadosProduto(token, codusu, codprod) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Pesquisando no estoque...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/estoque/" + codusu + "/" + codprod, httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();

            this.alertCtrl.create({
              title: 'Falha na conexão',
              subTitle: 'Não foi possível carregar o seu estoque. Tente novamente mais tarde.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();

          }
        );

    });
  };


  extrato(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando o extrato...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/estoque/movimentacoes/" + codusu + "", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();
          }
        );

    });
  };

  retornaNunotas(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/nunota/" + codusu + "", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();

            this.alertCtrl.create({
              title: 'Falha na conexão',
              subTitle: 'Não foi possível carregar as notas para recebimento. Tente novamente mais tarde.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();
          }
        );

    });
  };

  detalhaItens(token, nunota) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando o itens...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/nunota/detalhes/" + nunota + "", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();
            this.alertCtrl.create({
              title: 'Falha na conexão',
              subTitle: 'Não foi possível carregar os itens da nota. Tente novamente mais tarde.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();

          }
        );

    });
  };

  criarRota(token, endereco) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "endereco": "'" + endereco + "'"
      }

      let loading = this.loadingCtrl.create({
        content: 'Carregando o endereço...'
      });

      loading.present();
      console.log('Endereço pesquisado: ' + body.endereco);

      this.http.post(this.config.urlApi() + "/os/rota", body, httpOptions).subscribe(
        data => {
          resolve(data);
          loading.dismiss();
        },
        error => {
          console.log(error);
          reject(error);
          loading.dismiss();
        });


    });
  };

  converteLatLong(token, lat, long) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "latitude": + lat + ',' +
          "longitude: " + long
      }

      let loading = this.loadingCtrl.create({
        content: 'Carregando o endereço...'
      });

      loading.present();

      console.log('Endereço pesquisado: ' + body);

      this.http.post(this.config.urlApi() + "/os/converteLatLong", body, httpOptions).subscribe(
        data => {
          resolve(data);
          loading.dismiss();
        },
        error => {
          console.log(error);
          reject(error);
          loading.dismiss();
        });


    });
  };

  agendaFuturaTecnico(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando agenda...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/agendafutura/" + codusu + "", httpOptions).finally(() => {
        loading.dismiss();
      })
        .subscribe(
          data => {
            this.dados = data;
            if (this.dados == '' || this.dados == undefined) {
              this.alertCtrl.create({
                title: 'Não encontramos agendamentos para você.',
                subTitle: 'Se existe alguma divergência, entre em contato com a sua supervisão.',
                buttons: [
                  { text: 'OK' }
                ]
              }).present();
            } else {
              resolve(data);
            }
          },
          erro => {
            this.alertCtrl.create({
              title: 'Sem resposta do servidor.',
              subTitle: 'Não conseguimos conectar com o servidor, por favor, entre em contato com o suporte.',
              buttons: [
                { text: 'OK' }
              ]
            }).present();
            console.log(erro);
          }
        );

    });
  };

  agendaSuprimento(token, codusu) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando agenda...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/suprimento/agenda/" + codusu + "", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();
          }
        );

    });
  };

  retornaSubsistema(token) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando subsistemas...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/subsistema/", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();
          }
        );

    });

  };

  retornaEntregadores(token) {

    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando entregadores...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/entregadores/", httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();
          }
        );

    });

  };

  retornaCausas(token, subsistemas) {
    return new Promise(resolve => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      let loading = this.loadingCtrl.create({
        content: 'Carregando causas...'
      });

      loading.present();

      this.http.get(this.config.urlApi() + "/os/causas/" + subsistemas, httpOptions)
        .subscribe(
          data => {
            resolve(data);
            loading.dismiss();
          },
          erro => {
            console.log(erro);
            loading.dismiss();
          }
        );

    });

  };

  atualizaStatusOS(token, numos, numitem) {
    return new Promise(
      (resolve, reject) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token,
            'numos': numos

          })
        };

        var body = {
          numos: numos,
          numitem: numitem,
          salva: true
        }

        let loading = this.loadingCtrl.create({
          content: 'Alterando o stauts da OS...'
        });

        loading.present();

        this.http.put(this.config.urlApi() + "/os/salva", body, httpOptions)
          .subscribe(
            data => {
              loading.dismiss();
              return resolve(data);
            },
            erro => {
              console.log(erro);
              loading.dismiss();
              return reject(erro);
            }
          );

      }
    )
  }

  atualizaOS(token, numos, numitem, situacao, dataExecucao, horaInicial, horaFinal, causas, medpb,
    medcor, duplex, nomeCliente, matricula, email, telefone, statusEquip, preventiva, consumoestoque, solucao,
    otimizarToner, configurarDuplex, justificarOtimizacaoToner, novoEndereco) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token,
          'numos': numos

        })
      };

      var body = {
        numos: numos,
        numitem: numitem,
        situacao: situacao,
        dataExecucao: dataExecucao,
        horaInicial: horaInicial,
        horaFinal: horaFinal,
        causas: causas,
        medpb: medpb,
        medcor: medcor,
        duplex: duplex,
        nomeCliente: nomeCliente,
        matricula: matricula,
        email: email,
        telefone: telefone,
        statusEquip: statusEquip,
        preventiva: preventiva,
        consumoestoque: consumoestoque,
        solucao: solucao,
        otimizarToner: otimizarToner,
        configurarDuplex: configurarDuplex,
        justificarOtimizacaoToner: justificarOtimizacaoToner,
        novoEndereco: novoEndereco
      }

      let loading = this.loadingCtrl.create({
        content: 'Salvando os dados da ordem de serviço...'
      });

      loading.present();

      this.http.put(this.config.urlApi() + "/os", body, httpOptions)
        .subscribe(
          data => {
            loading.dismiss();
            return resolve(data);
          },
          erro => {
            console.log(erro);
            loading.dismiss();
            return reject(erro);
          }
        );

    });
  };

  novoAtualizaOS(token, os, listagem, codusu, estoque) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "os": os,
        "listagem": listagem,
        "codusu": codusu,
        "estoque": estoque
      }

      let loading = this.loadingCtrl.create({
        content: 'Salvando os dados da ordem de serviço...'
      });

      loading.present();

      this.http.put(this.config.urlApi() + "/os/atualiza", body, httpOptions)
        .subscribe(
          data => {
            loading.dismiss();
            return resolve(data);
          },
          erro => {
            console.log(erro.message);
            loading.dismiss();
            return reject(erro);
          }
        );

    });
  };

  atualizaPedido(token, nunota, status, dataExecucao, hora, responsavel, telefone, ocorrencia) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        nunota: nunota,
        status: status,
        dataExecucao: dataExecucao,
        hora: hora,
        responsavel: responsavel,
        telefone: telefone,
        ocorrencia: ocorrencia
      }

      let loading = this.loadingCtrl.create({
        content: 'Atualizando o pedido...'
      });

      loading.present();

      this.http.put(this.config.urlApi() + "/suprimento", body, httpOptions)
        .subscribe(
          data => {
            loading.dismiss();
            return resolve(data);
          },
          erro => {
            console.log(erro);
            loading.dismiss();
            return reject(erro);
          }
        );

    });
  };

  atualizaPedidoNew(token, nunota, status, dataExecucao, hora, responsavel, matricula, ocorrencia) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        nunota: nunota,
        status: status,
        dataExecucao: dataExecucao,
        hora: hora,
        responsavel: responsavel,
        matricula: matricula,
        ocorrencia: ocorrencia
      }

      let loading = this.loadingCtrl.create({
        content: 'Atualizando o pedido...'
      });

      loading.present();

      this.http.put(this.config.urlApi() + "/suprimento/novo", body, httpOptions)
        .subscribe(
          data => {
            loading.dismiss();
            return resolve(data);
          },
          erro => {
            console.log(erro);
            loading.dismiss();
            return reject(erro);
          }
        );

    });
  };

  atualizaPedidoEntregador(token, nunota, status, dataExecucao, hora, responsavel, matricula, ocorrencia, entregador) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        nunota: nunota,
        status: status,
        dataExecucao: dataExecucao,
        hora: hora,
        responsavel: responsavel,
        matricula: matricula,
        ocorrencia: ocorrencia,
        entregador: entregador
      }

      let loading = this.loadingCtrl.create({
        content: 'Atualizando o pedido...'
      });

      loading.present();

      this.http.put(this.config.urlApi() + "/suprimento/entregador", body, httpOptions)
        .subscribe(
          data => {
            loading.dismiss();
            return resolve(data);
          },
          erro => {
            console.log(erro);
            loading.dismiss();
            return reject(erro);
          }
        );

    });
  };

  receberItens(token, estoqueDoTecnico, nunota, tecnico) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        nunota: nunota,
        estoqueDoTecnico: estoqueDoTecnico,
        tecnico: tecnico
      }

      let loading = this.loadingCtrl.create({
        content: 'Recebendo itens...'
      });

      loading.present();

      this.http.put(this.config.urlApi() + "/os/receberitens", body, httpOptions)
        .subscribe(
          data => {
            loading.dismiss();
            return resolve(data);
          },
          erro => {
            console.log(erro);
            loading.dismiss();
            return reject(erro);
          }
        );

    });
  };

  baixarPecas(produtosSelecionados, token, os, codusu, estoqueVolante) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      //console.log('EMP: ' + os.CODEMP + 'CODPARC: ' + os.CODPARC + 'NUITEM: ' + os.NUMITEM);

      var body = {
        "codemp": os.CODEMP,
        "codparc": os.CODPARC,
        "numos": os.NUMOS,
        "numitem": os.NUMITEM,
        "codusu": codusu,
        "estoque": estoqueVolante,
        "listagem": produtosSelecionados
      }

      let loading = this.loadingCtrl.create({
        content: 'Realizando baixa do estoque...'
      });

      loading.present();

      this.http.post(this.config.urlApi() + "/os/baixarpecas", body, httpOptions)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
            loading.dismiss();
          },
          error => {
            reject(error);
            loading.dismiss();
          });
    })
  }

  enviarFoto(token, os, photoString, descricao) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "os": os,
        "stringFoto": photoString,
        "descricao": descricao,
      }

        this.http.post(this.config.urlApi() + "/os/enviarFoto", body, httpOptions)
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
          }
        );

    });

  }

  enviarFotoPedido(token, nunota, photoString, descricao) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "nunota": nunota,
        "stringFoto": photoString,
        "descricao": descricao,
      }

      let loading = this.loadingCtrl.create({
        content: 'Salvando foto na nuvem...'
      });

      loading.present();


      this.http.post(this.config.urlApi() + "/os/enviarFotoPedido", body, httpOptions)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
            loading.dismiss();
          },
          error => {
            reject(error);
            loading.dismiss();
          }
        );

    });

  }

  enviarFoto2(token, os) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "os": os,
      }

      let loading = this.loadingCtrl.create({
        content: 'Salvando foto na nuvem...'
      });

      loading.present();


      this.http.post(this.config.urlApi() + "/os/enviarFoto", body, httpOptions)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
            loading.dismiss();
          },
          error => {
            reject(error);
            loading.dismiss();
          }
        );

    });

  }

  salvarContadores(token, pedido, dataexecucao) {
    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "dataexecucao": dataexecucao,
        "pedido": pedido
      }

      let loading = this.loadingCtrl.create({
        content: 'Salvando os contadores...'
      });

      loading.present();

      this.http.post(this.config.urlApi() + "/os/salvarcontadores", body, httpOptions)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
            loading.dismiss();
          },
          error => {
            reject(error);
            loading.dismiss();
          }
        );

    });
  }

  concluiOsTotal(token, os, status, listagem, codusu, estoque) {


    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "os": os,
        "status": status,
        "listagem": listagem,
        "codusu": codusu,
        "estoque": estoque
      }

      this.http.post(this.config.urlApi() + "/os/osTotal", body, httpOptions)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          error => {
            reject(error);
          }
        );

    });

  }

  concluiOsParcial(token, os, status) {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };

      var body = {
        "os": os,
        "status": status
      }

      this.http
        .post(this.config.urlApi() + "/os/osParcial", body, httpOptions)
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });

  }


}

