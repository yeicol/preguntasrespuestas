(function($) {
    $("#contenido-dinamico").on('click', 'a.guardar-id', function(event) {
        event.preventDefault();
        var tipo = $(this).attr('data-tipo');
        var id = $(this).attr('data-id');
        localStorage.setItem('frontendPRTipo', tipo);
        localStorage.setItem('frontendPRid', id);
        window.location = $(this).attr('href');
    });
    var notificacion = localStorage.getItem('frontendPRnotificacion');
    if(notificacion) {
      Materialize.toast(notificacion, 3000, 'rounded');
      localStorage.removeItem('frontendPRnotificacion');
    }
}(jQuery));
