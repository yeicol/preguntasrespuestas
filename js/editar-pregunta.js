/**
	* Verifica si existe la pregunta a editar e imprime su información en el formulario
	*/
(function ($) {
		var urlBase = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas/';
		var tipoElementoGuardado = window.localStorage.frontendPRTipo;
		var idElementoGuardado = window.localStorage.frontendPRid;
		var $contenidoPregunta = $("#contenido-pregunta");
		var frontendPRSession = localStorage.getItem('frontendPRSession');
		obtenerPregunta();

		function obtenerPregunta() {
				if (frontendPRSession) {
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
										error: function (data) {
												switch (data.status) {
														case 404:
																window.location = '404.html';
																break;
														case 500:
																window.location = '500.html';
														default:
																Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
												}
										}
								});
						}
				} else {
						localStorage.setItem('frontendPRRedirect', 'editar-pregunta.html');
						localStorage.setItem('frontendPRnotificacion', 'Es necesario iniciar sesión');
						window.location = 'login.html';
				}

		}

		/**
			* Envia la nueva información de la pregunta a editar
			* @returns
			*/
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
										localStorage.setItem('frontendPRnotificacion', 'Su Pregunta ha sido guardada');
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
												case 403:
														window.location = '403.html';
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
		}
}(jQuery));
