/**
 * Se encarga de autenticar al usuario
 */
(function($) {
    var html;
    if (localStorage.getItem('frontendPRSession')) {
        html = '<a href="listar-preguntas.html"  class="btn-large waves-effect waves-light orange">Ver Preguntas</a>';
    } else {
        html = '<a href="login.html"  class="btn-large waves-effect waves-light light-blue darken-1">Login</a> ' +
            '   <a href="registro.html"  class="btn-large waves-effect waves-light orange">Registrarse</a>';
    }
    $("#opciones-inicio").append(html);

}(jQuery));
