/**
 * Se encarga de enviar la solicitud de registro
 */
(function($) {
    var url = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/usuarios';
    $('#contenerdor-formulario').on('submit', '#enviar-formulario', function() {
        var credenciales = JSON.stringify({
            "login": $('#login').val(),
            "password": $('#password').val()
        });
        $.ajax({
            type:        'POST',
            url:         url,
            dataType:    "json",
            contentType: 'application/json',
            data:        credenciales,
            xhrFields:   {
                withCredentials: true
            },
            success: function(data, status, jqXHR) {
                localStorage.setItem('frontendPRnotificacion', 'Se ha registrado exitosamente');
                window.location = 'login.html';
            },
            error: function(data, status, jqXHR) {
                Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
            },
        });
        return false;
    });
}(jQuery));
