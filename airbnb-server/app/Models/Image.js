'use strict'
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Image extends Model {
  //criamos um campo “computed” chamado url
  static get computed(){
    return['url']
  }
  //adicionamos seu valor com um método com prefixo get seguido do campo em camel
  //case. Utilizamos também o Env para recuperar a URL da nossa API.
  getUrl({path}){
    return `${Env.get('APP_URL')}/images/${path}`
  }

}

module.exports = Image
