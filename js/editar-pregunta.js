/**
	* Se encarga de traer la información de las preguntas
	*/
(function ($) {
		var urlBase = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas/';
		var tipoElementoGuardado = window.localStorage.frontendPRTipo;
		var idElementoGuardado = window.localStorage.frontendPRid;
		var $contenidoPregunta = $("#contenido-pregunta");
		obtenerPregunta();

		function obtenerPregunta() {
				if (localStorage.getItem('frontendPRSession')) {
						if ('pregunta' === tipoElementoGuardado && idElementoGuardado) {
								$.ajax({
										url: urlBase + idElementoGuardado,
										type: 'GET',
										dataType: 'json',
										xhrFields: {
												withCredentials: true
										},
										success: function (data) {
												$contenidoPregunta.append($('<div>').load('templates/formulario-pregunta.html', function () {
														$("#titulo").val(data.pregunta.titulo);
														$("#contenido").val(data.pregunta.contenido);
														$("#enviar-formulario").find('label').remove();
														editarPregunta();
												}));
										},
										error: function () {

										}
								});
						}
				} else {
						localStorage.setItem('frontendPRRedirect', 'editar-pregunta.html');
						localtorage.setItem('frontendPRnotificacion', 'Es necesario iniciar sesión');
						window.location = 'login.html';
				}

		}

		function editarPregunta() {
				$("#enviar-formulario").submit(function () {
						var contenidoRespuesta = JSON.stringify({
								"titulo": $('#titulo').val(),
								"contenido": $('#contenido').val(),
						});
						$.ajax({
								type: 'PUT',
								url: urlBase + idElementoGuardado,
								dataType: "json",
								contentType: 'application/json',
								data: contenidoRespuesta,
								xhrFields: {
										withCredentials: true
								},
								success: function (data) {
										localStorage.setItem('frontendPRnotificacion', 'Su contenido ha sido guardada');
										window.location = 'editar-pregunta.html';
								},
								error: function (data) {
										switch (data.status) {
												case 401:
														localStorage.setItem('frontendPRRedirect', 'editar-pregunta.html');
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
