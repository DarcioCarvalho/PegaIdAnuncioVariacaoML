var botaoCalcular = document.querySelector('.calcular');

var resultado = document.querySelector('.resultadoHtml');

var botaoBuscar = document.querySelector('.buscar');


function formarIdAnuncio() {


  var texto;

  var auxIdAnuncio = document.querySelector('#idAnuncio').value;

  //        window.alert('idAnuncio: ' + auxIdAnuncio);

  if (auxIdAnuncio.trim() != '') {
    texto = buscarIdVariacao(auxIdAnuncio);
  } else {
    window.alert('Digite o ID do Anúncio!!!');
  }




  //        resultado.value = texto;

}



function buscarIdVariacao(idAnuncio) {


  //      console.log('idAnuncio: ' + idAnuncio);

  resultado.value = '';

  fetch('https://api.mercadolibre.com/items/' + idAnuncio + '?include_attributes=all', {
    method: 'get'
  })
    .then(res => {
      return res.json()
    })
    .then((response) => {

      if ((response.status == 404) || (response.status == 400)) {
        window.alert('Item com id ' + idAnuncio + ' não encontrado!');
        return;
      }

      const anuncioId = response.id;
      const anuncioTitle = response.title;
      const variations = response.variations;


      //                resultado.value = JSON.stringify(response);

      resultado.value = 'ID do Anúncio: ' + anuncioId + '\n' + 'Título do Anúncio: ' + anuncioTitle + '\n\n';


      if (variations.length) {

        var respostaVariations = '';

        for (var i = 0; i < variations.length; i++) {

          variationId = variations[i].id;
          variationName = variations[i].attribute_combinations[0].name;
          variationValueName = variations[i].attribute_combinations[0].value_name;

          //                    resultado.value = anuncioId + '/variations/' + variationId;
          respostaVariations += '[' + variationName + ': ' + variationValueName + ']: ' + anuncioId + '/variations/' + variationId + '\n';

          // Pegar EAN (GTIN) e SKU
          ean = "";
          sku = "";
          for (var j = 0; j < variations[i].attributes.length; j++) {
            if (variations[i].attributes[j].id === "GTIN") {
              ean = variations[i].attributes[j].value_name;
            }

            if (variations[i].attributes[j].id === "SELLER_SKU") {
              sku = variations[i].attributes[j].value_name;
            }
          }

          respostaVariations += 'SKU: ' + sku + '       EAN: ' + ean + '\n';

          if (i < variations.length) {
            respostaVariations += '\n';
          }

        }

        //                  console.log('idCompleto: ' + anuncioId + '/variations/' + variationId);
        console.log(respostaVariations);
        resultado.value += respostaVariations;


      } else {
        window.alert('O Anúncio ' + anuncioId + ' não tem variação!!!');
        resultado.value += anuncioId;
      }



    });

}

botaoBuscar.onclick = formarIdAnuncio;
