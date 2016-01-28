/**
	* Se encarga de traer la información de las preguntas
	*/
(function ($) {
		var urlBase = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas/';
		var tipoElementoGuardado = window.localStorage.frontendPRTipo;
		var idPregunta = window.localStorage.frontendPRid;
		var $contenidoPregunta = $("#contenido-pregunta");
		obtenerPregunta();

		function obtenerPregunta() {
				if ('pregunta' === tipoElementoGuardado && idPregunta) {
						$.ajax({
								url: urlBase + idPregunta,
								type: 'GET',
								dataType: 'json',
								xhrFields: {
										withCredentials: true
								},
								success: function (data) {
										var html = '<div class="row">' +
														'           <div class="col s12">' +
														'              <h4 class="orange-text">' + data.pregunta.titulo + '</h4>' +
														'              <div class="divider"></div>' +
														'              <div class="section">' +
														'                  <p>' + data.pregunta.contenido + '</p>' +
														'              </div>' +
														'              <div class="row">' +
														'                  <div class="col s7 offset-s5 m6 offset-m6 l5 offset-l7">' +
														'                      <div class="card grey lighten-3">' +
														'                          <div class="card-content">' +
														'                              <span class="datos-pregunta">' +
														'																		Preguntado cerca de ' + data.pregunta.ciudad + '<br>' +
														'																		' + data.pregunta.latitud + ',' +data.pregunta.longitud +
														'															</span>' +
														'                          </div>' +
														'                      </div>' +
														'                  </div>' +
														'              </div>' +
														'           </div>' +
														'       </div>';
										$contenidoPregunta.append(html);
										obtenerRespuestas();

								},
								error: function () {

								}
						});
				}
		}

		function obtenerRespuestas() {
				$.ajax({
						url: urlBase + idPregunta + '/respuestas',
						type: 'GET',
						dataType: 'json',
						xhrFields: {
								withCredentials: true
						},
						success: function (data) {
								var frontendPRSession = parseInt(localStorage.getItem('frontendPRSession'), 10);
								window.frontendPRCantidadRespuestas = data.respuestas.length;
								var iniciarModal = false;
								var textoRespuestas = getTextoRespuestas(window.frontendPRCantidadRespuestas);
								var html = '<h5 id="cantidad-respuestas">' + textoRespuestas + '</h5>' +
												'<div class="divider"></div>';
								$.each(data.respuestas, function (posicion, respuesta) {
										var usuarioRespuestaId = parseInt(respuesta.usuario_id);
										if (frontendPRSession === usuarioRespuestaId) {
												html += '<div class="section respuesta">' +
																'       <p>' + respuesta.contenido +
																'           <a href="#modal" data-target="#modal" data-id="' + respuesta.id + '" class="secondary-content red-text eliminar-respuesta-modal modal-trigger"><i class="material-icons mdi-action-delete"></i></a>' +
																'       </p>' +
																'    </div>';
												iniciarModal = true;
										} else {
												html += '<div class="section respuesta">' +
																'       <p>' + respuesta.contenido + '</p>' +
																'   </div>';
										}
								});
								html += '<br>';
								eliminarRespuesta();
								if (iniciarModal) {
										configurarModal();
								}
								$contenidoPregunta.append(html);
								if (localStorage.getItem('frontendPRSession')) {
										$contenidoPregunta.append($('<div class="section">').load('templates/responder-pregunta.html', responderPregunta));
								} else {
										localStorage.setItem('frontendPRRedirect', 'ver-pregunta.html');
										$contenidoPregunta.append('<a href="login.html" class="btn-large waves-effect waves-light light-blue darken-1">Debes iniciar sessión para dar un respuesta</a>');
								}
						},
						error: function () {

						}
				});
		}

		function responderPregunta() {
				$("#enviar-formulario-respuesta").submit(function () {
						var contenidoRespuesta = JSON.stringify({
								"contenido": $('#respuesta').val(),
						});
						$.ajax({
								type: 'POST',
								url: urlBase + idPregunta + '/respuestas',
								dataType: "json",
								contentType: 'application/json',
								data: contenidoRespuesta,
								xhrFields: {
										withCredentials: true
								},
								success: function (data) {
										localStorage.setItem('frontendPRnotificacion', 'Su pregunta ha sido guardada');
										window.location = 'ver-pregunta.html';
								},
								error: function (data) {
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

		function configurarModal() {
				$contenidoPregunta.append($('<div id="modal" class="modal">').load('templates/eliminar-respuesta-modal.html', function () {
						$('.eliminar-respuesta-modal').click(function () {
								$("#eliminar-respuesta-aceptar").attr('data-id', $(this).attr('data-id'));
						}).leanModal({
								out_duration: 300,
								ready: function () {},
								complete: function () {
										$("#eliminar-respuesta-aceptar").removeAttr('data-id');
								}
						});
				}));
		}

		function eliminarRespuesta() {
				$('#contenido-pregunta').on('click', '#eliminar-respuesta-aceptar', function () {
						var idRespuesta = $("#eliminar-respuesta-aceptar").attr('data-id');
						$.ajax({
								type: 'DELETE',
								url: urlBase + idPregunta + '/respuestas/' + idRespuesta,
								dataType: "json",
								contentType: 'application/json',
								xhrFields: {
										withCredentials: true
								},
								success: function (data) {
										$('.eliminar-respuesta-modal[data-id="' + idRespuesta + '"]').parent().parent().remove();
										window.frontendPRCantidadRespuestas--;
										$("#cantidad-respuestas").html(getTextoRespuestas(window.frontendPRCantidadRespuestas));
										Materialize.toast('Su respuesta fue eliminada', 3000, 'rounded');
								},
								error: function (data) {
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
				});
		}
		function getTextoRespuestas(cantidadRespuestas) {
				var multiplicidad = (cantidadRespuestas === 1) ? 'respuesta' : 'respuestas';
				return cantidadRespuestas + ' '  + multiplicidad;
		}
}(jQuery));
