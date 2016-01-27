/**
	* Se encarga de autenticar al usuario
	*/
(function ($) {
		var url = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/usuarios/autenticar';
		$('#contenerdor-formulario').on('submit', '#enviar-formulario', function () {
				var credenciales = JSON.stringify({
						"login": $('#login').val(),
						"password": $('#password').val()
				});
				$.ajax({
						type: 'POST',
						url: url,
						dataType: "json",
						contentType: 'application/json',
						data: credenciales,
						xhrFields: {
								withCredentials: true
						},
						success: function (data, status, jqXHR) {
								var redirect = localStorage.getItem('frontendPRRedirect');
								localStorage.setItem('frontendPRSession', data.usuario.id);
								localStorage.setItem('frontendPRnotificacion', 'Bienvenido');
								if (redirect) {
										localStorage.removeItem('frontendPRRedirect');
										window.location = redirect;
								} else {
										window.location = 'listar-preguntas.html';
								}
						},
						error: function (data, status, jqXHR) {
								Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
						},
				});
				return false;
		});
}(jQuery));