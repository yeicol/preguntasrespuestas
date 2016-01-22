/**
 * Se encarga de traer la información de las preguntas
 */
(function($) {
    var url = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas';
    var limiteContenido = 80;
    var finalContenido = '...';
    var html;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $.each(data.preguntas, function(posicion, pregunta) {
                html = '<div class="row">' +
                    '       <div class="col s12">' +
                    '           <div class="card grey lighten-4">' +
                    '               <div class="card-content grey-text text-darken-2">' +
                    '                   <p class="truncate">' + pregunta.contenido + '</p>' +
                    '                </div>' +
                    '                <div class="card-action">' +
                    '                   <a class="guardar-id" data-tipo="pregunta" data-id="' + pregunta.id + '" href="ver-pregunta.html">Ver Pregunta</a>' +
                    '                   <a class="guardar-id" data-tipo="pregunta" data-id="' + pregunta.id + '"  href="responder-pregunta.html">Responder</a>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>';
                $("#contenedor-preguntas").append(html);
            });
        },
        error: function() {}
    });
}(jQuery));
