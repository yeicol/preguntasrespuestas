/* global Materialize */

/**
	* Se encarga de traer la información de las preguntas
	*/
(function ($) {

		var url;
		var opciones;
		var tipoElementoGuardado = window.localStorage.frontendPRTipo;
		var idElementoGuardado = window.localStorage.frontendPRid;
		var frontendPRSession = localStorage.getItem('frontendPRSession');
		var urlBase = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/';
		if (frontendPRSession && tipoElementoGuardado === 'usuario' && idElementoGuardado) {
				url = urlBase + 'usuarios/' + idElementoGuardado + '/preguntas';
		} else {
				url = urlBase + 'preguntas';
		}
		var html;
		$.ajax({
				url: url,
				type: 'GET',
				dataType: 'json',
				success: function (data) {
						$.each(data.preguntas, function (posicion, pregunta) {
								if (pregunta.usuario_id === parseInt(frontendPRSession, 10)) {
										opciones = '<a class="guardar-id orange-text" data-tipo="pregunta" data-id="' + pregunta.id + '" href="editar-pregunta.html"><i class="material-icons">mode_edit</i></a>' +
														'          <a href="#modal" data-target="#modal" data-id="' + pregunta.id + '" class="secondary-content red-text eliminar-pregunta-modal modal-trigger"><i class="material-icons mdi-action-delete"></i></a>';
								} else {
										opciones = '';
								}
								html = '<div class="row">' +
												'       <div class="col s12">' +
												'           <div class="card grey lighten-4">' +
												'               <div class="card-content grey-text text-darken-2">' +
												'                   <p class="truncate">' + pregunta.titulo + '</p>' +
												'                </div>' +
												'                <div class="card-action">' +
												'                   <a class="guardar-id orange-text" data-tipo="pregunta" data-id="' + pregunta.id + '" href="ver-pregunta.html"><i class="material-icons mdi-action-visibility"></i></a>' +
												'										' + opciones +
												'               </div>' +
												'           </div>' +
												'       </div>' +
												'   </div>';
								$("#contenedor-preguntas").append(html);
						});
						configurarModal();
				},
				error: function (data) {
						Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
				}
		});

		function configurarModal() {

				$('.eliminar-pregunta-modal').click(function () {
						$("#eliminar-pregunta-aceptar").attr('data-id', $(this).attr('data-id'));
				}).leanModal({
						out_duration: 300,
						complete: function () {
								$("#eliminar-pregunta-aceptar").removeAttr('data-id');
						}
				});
				eliminarPregunta();
		}

		function eliminarPregunta() {
				$('#eliminar-pregunta-aceptar').click(function () {
						var idPregunta = $("#eliminar-pregunta-aceptar").attr('data-id');
						$.ajax({
								type: 'DELETE',
								url: urlBase + 'preguntas/' + idPregunta,
								dataType: "json",
								contentType: 'application/json',
								xhrFields: {
										withCredentials: true
								},
								success: function (data) {
										$('.eliminar-pregunta-modal[data-id="' + idPregunta + '"]').parent().parent().parent().parent().remove();
										Materialize.toast('Su pregunta fue eliminada', 3000, 'rounded');
								},
								error: function (data) {
										switch (data.status) {
												case 401:
														localStorage.setItem('frontendPRRedirect', 'listar-preguntas.html');
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
}(jQuery));
