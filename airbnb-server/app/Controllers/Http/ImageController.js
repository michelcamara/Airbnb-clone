'use strict';
const Helpers = use('Helpers');

const Image = use('App/Models/Image');
const Property = use('App/Models/Property');

class ImageController {

  async store({params, request}){
    const property = await Property.findOrFail(params.id);

    //trás um ou mais arquivos com o nome do primeiro parâmetro e ainda podemos
    // limitar para arquivos apenas do tipo de imagem com tamanho até 2mb.
    const images = request.file('image',{
      types: ['image'],
      size: '2mb'
    })
    //movendo TODAS imagens para uma pasta tmp/uploads no Adonis e para cada
    //arquivo estou alterando o nome do mesmo com o timestamp atual evitando arquivos duplicados.
    await images.moveAll(Helpers.tmpPath('uploads'), file =>({
      name: `${Date.now()}-${file.clientName}`
    }));
    //Caso aconteça qualquer erro no upload, o processo para por aí e nosso
    //front-end fica sabendo dos problemas.
    if(!images.movedAll()){
      return images.erros();
    }
    //estamos percorrendo todas imagens salvas e cadastrando dentro do imóvel,
    //isso só é possível pois dentro do nosso model de imóvel temos
    //um método images() que é o relacionamento de imóvel com imagens.
    await Promise.all(
      images
        .movedList()
        .map(image => property.images().create({path: image.fileName}))
    )
  }

  async show({params, response}){
    return response.download(Helpers.tmpPath(`uploads/${params.id}`));
  }
}

module.exports = ImageController
