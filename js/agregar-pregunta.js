/**
	* Crea una pregunta
	*/
(function ($) {
		var url = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas';
		var frontendPRSession = localStorage.getItem('frontendPRSession');
		if (frontendPRSession) {
				$('#contenedor-formulario').on('submit', '#enviar-formulario', function () {
						var contenido = JSON.stringify({
								"titulo": $('#titulo').val(),
								"contenido": $('#contenido').val()
						});
						$.ajax({
								type: 'POST',
								url: url,
								dataType: "json",
								contentType: 'application/json',
								data: contenido,
								xhrFields: {
										withCredentials: true
								},
								success: function (data) {
										localStorage.setItem('frontendPRnotificacion', 'Su Pregunta ha sido guardada');
										localStorage.setItem('frontendPRTipo', 'pregunta');
										localStorage.setItem('frontendPRid', data.pregunta.id);
										window.location = 'editar-pregunta.html';
								},
								error: function (data) {
										switch (data.status) {
												case 401:
														localStorage.setItem('frontendPRRedirect', 'agregar-pregunta.html');
														if (localStorage.getItem('frontendPRSession')) {
																localStorage.removeItem('frontendPRSession');
																localStorage.setItem('frontendPRnotificacion', 'Su sesión ha expirado');
														} else {
																localStorage.setItem('frontendPRnotificacion', 'Es necesario iniciar sesión');
														}
														window.location = 'login.html';
														break;
												case 404:
														window.location = '404.html';
														break;
												case 500:
														window.location = '500.html';
												default:
														Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
										}
								},
						});

						return false;
				});
		} else {
				localStorage.setItem('frontendPRRedirect', 'agregar-pregunta.html');
				localStorage.setItem('frontendPRnotificacion', 'Es necesario iniciar sesión');
				window.location = 'login.html';
		}

}(jQuery));
