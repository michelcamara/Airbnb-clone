'use strict'
const Property = use('App/Models/Property');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({request}) {
    const {latitude, longitude } = request.all();
    //filtrar apenas os imóveis próximos
    const properties = Property.query()
      .with('images')
      .nearBy(latitude, longitude, 10)
      .fetch();

    return properties;
  }

  /**
   * Create/save a new property.
   * POST properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({auth, request, response }) {

    // buscamos o ID do usuário logado através do objeto auth embutido
    // automaticamente em todos métodos dos controllers
    const {id} = auth.user;
    //campos da requisição para criação do imóvel
    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ]);
    //criamos o imóvel com o método create utilizando todos campos da
    // requisição mais o ID do usuário.
    const property = await Property.create({...data, user_id: id});

    return property;
  }

  /**
   * Display a single property.
   * GET properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {

    const property = await Property.findOrFail(params.id);
    await property.load('images');

    return property;
  }

  /**
   * Update property details.
   * PUT or PATCH properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const property = await Property.findOrFail(params.id);

    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ]);

    property.merge(data);

    await property.save();

    return property;
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const property = await Property.findOrFail(params.id);

    if(property.user_id !== auth.user.id){
      return response.status(401).send({error: 'Nao autorizado!'});
    }

    await property.delete();
  }
}

module.exports = PropertyController
