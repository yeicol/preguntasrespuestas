(function($) {
    $('.template').each(function() {
        var template = $(this).attr('data-template');
        if (template.length > 0) {
            if ($(this).attr('id') === 'navegacion') {
                var titulo = $(this).attr('data-titulo');
                $(this).load('templates/' + template, function() {
                    $('.nav-wrapper > #titulo-pagina').innerHTML = titulo;
                    $('.nav-wrapper > ul > li > a:contains(' + titulo + ')').parent().addClass('active');
                });
            } else {
                $(this).load('templates/' + template);
            }
        }
    });

    $("#contenido-dinamico").on('click', 'a.guardar-id', function(event) {
        event.preventDefault();
        var tipo = $(this).attr('data-tipo');
        var id = $(this).attr('data-id');
        localStorage.setItem('frontendPRTipo', tipo);
        localStorage.setItem('frontendPRid', id);
        window.location = $(this).attr('href');
    });
    var notificacion = localStorage.getItem('frontendPRnotificacion');
    if (notificacion) {
        Materialize.toast(notificacion, 3000, 'rounded');
        localStorage.removeItem('frontendPRnotificacion');
    }
}(jQuery));
