/**
 * Se encarga de traer la información de las preguntas
 */
(function($) {
    var urlBase = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas/';
    var tipoElementoGuardado = window.localStorage.frontendPRTipo;
    var idElementoGuardado = window.localStorage.frontendPRid;
    var $contenidoPregunta = $("#contenido-pregunta");
    obtenerPregunta();

    function obtenerPregunta() {
        if ('pregunta' === tipoElementoGuardado && idElementoGuardado) {
            $.ajax({
                url: urlBase + idElementoGuardado,
                type: 'GET',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    var html = '<div class="row">' +
                        '           <div class="col s12">' +
                        '              <h4 class="orange-text">Ejemplo de título de pregunta</h4>' +
                        '              <div class="divider"></div>' +
                        '              <div class="section">' +
                        '                  <p>' + data.pregunta.contenido + '</p>' +
                        '              </div>' +
                        '              <div class="row">' +
                        '                  <div class="col s7 offset-s5 m6 offset-m6 l5 offset-l7">' +
                        '                      <div class="card grey lighten-3">' +
                        '                          <div class="card-content">' +
                        '                              <span class="datos-pregunta">Preguntado cerca de Pereira</span>' +
                        '                          </div>' +
                        '                      </div>' +
                        '                  </div>' +
                        '              </div>' +
                        '           </div>' +
                        '       </div>';
                    $contenidoPregunta.append(html);
                    obtenerRespuestas();

                },
                error: function() {

                }
            });
        }
    }

    function obtenerRespuestas() {
        $.ajax({
            url: urlBase + idElementoGuardado + '/respuestas',
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                var frontendPRSession = parseInt(localStorage.getItem('frontendPRSession'), 10);
                var cantidadRespuestas = data.respuestas.length;
                var multiplicidad = (cantidadRespuestas === 1) ? 'respuesta' : 'respuestas';
                var html = '<h5>' + cantidadRespuestas + ' ' +  multiplicidad + '</h5>' +
                            '<div class="divider"></div>';
                    $.each(data.respuestas, function(posicion, respuesta) {
                        var usuarioRespuestaId = parseInt(respuesta.usuario_id);
                        var removerRespuesta = (frontendPRSession === usuarioRespuestaId) ? '<a href="eliminar-respuesta.html" class="secondary-content red-text"><i class="material-icons mdi-action-delete"></i></a>' : '';
                        html +=
                            '<div class="section respuesta"><p>' + respuesta.contenido + removerRespuesta + '</p></div>';
                    });
                    html+='<br>';

                $contenidoPregunta.append(html);
                if (localStorage.getItem('frontendPRSession')) {
                    $contenidoPregunta.append($('<div class="section">').load('templates/responder-pregunta.html', responderPregunta));
                } else {
                    localStorage.setItem('frontendPRRedirect', 'ver-pregunta.html');
                    $contenidoPregunta.append('<a href="login.html" class="btn-large waves-effect waves-light light-blue darken-1">Debes iniciar sessión para dar un respuesta</a>');
                }
            },
            error: function() {

            }
        });
    }

    function responderPregunta() {
        $("#contenido-dinamico").on('submit', '#enviar-formulario-respuesta', function() {
            var contenidoRespuesta = JSON.stringify({
                "contenido": $('#respuesta').val(),
            });
            $.ajax({
                type: 'POST',
                url: urlBase + idElementoGuardado + '/respuestas',
                dataType: "json",
                contentType: 'application/json',
                data: contenidoRespuesta,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    localStorage.setItem('frontendPRnotificacion', 'Su respuesta ha sido guardada');
                    window.location = 'ver-pregunta.html';
                },
                error: function(data) {
                    switch (data.status) {
                        case 401:
                            localStorage.setItem('frontendPRRedirect', 'ver-pregunta.html');
                            if (localStorage.getItem('frontendPRSession')) {
                                localStorage.removeItem('frontendPRSession');
                                localStorage.setItem('frontendPRnotificacion', 'Su sesión ha expirado');
                            } else {
                                localStorage.setItem('frontendPRnotificacion', 'Es necesario iniciar sesión');
                            }
                            window.location = 'login.html';
                            break;
                        default:
                            Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
                    }
                },
            });
            return false;
        });
    }
}(jQuery));
