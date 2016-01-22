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
                    html = '<div class="row">' +
                        '       <div class="col s12">' +
                        '           <div class="card grey lighten-4">' +
                        '               <div class="card-content grey-text text-darken-2">' +
                        '                   <p>' + data.pregunta.contenido + '</p>' +
                        '               </div>' +
                        '           </div>' +
                        '       </div>' +
                        '     </div>' +
                        '     <h4>Respuestas</h4>';
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
                $.each(data.respuestas, function(posicion, respuesta) {
                    html = '<div class="row respuestas">' +
                        '       <div class="col s12">' +
                        '           <div class="card grey lighten-5">' +
                        '               <div class="card-content grey-text text-darken-2">' +
                        '                   <p>' + respuesta.contenido + '</p>' +
                        '               </div>' +
                        '           </div>' +
                        '        </div>' +
                        '     </div>';
                    $contenidoPregunta.append(html);
                });
                if (localStorage.getItem('frontendPRSession')) {
                    $contenidoPregunta.append($("<div>").load('responder-pregunta.html', responderPregunta));
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
