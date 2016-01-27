/* global Materialize */

(function ($) {
		$('.template').each(function () {
				var template = $(this).attr('data-template');
				if (template.length > 0) {
						if ($(this).attr('id') === 'navegacion') {
								var titulo = $(this).attr('data-titulo');
								$(this).load('templates/' + template, function () {
										$('.nav-wrapper > #titulo-pagina').html(titulo);
										$('.nav-wrapper > ul > li > a').filter(function () {
												return $(this).text() === titulo;
										}).parent().addClass('active');
										menusVisibles();
										iniciarSideNav();
										salir();
								});
						} else {
								$(this).load('templates/' + template);
						}
				}
		});
		var notificacion = localStorage.getItem('frontendPRnotificacion');
		if (notificacion) {
				Materialize.toast(notificacion, 3000, 'rounded');
				localStorage.removeItem('frontendPRnotificacion');
		}

		function menusVisibles() {
				var frontendPRSession = parseInt(localStorage.getItem('frontendPRSession'), 10);
				if (frontendPRSession) {
						$('.nav-wrapper > ul > li > a[data-session="false"]').parent().hide();
						$('a.guardar-id[data-session="true"]').attr('data-id', frontendPRSession);
				} else {
						$('.nav-wrapper > ul > li > a[data-session="true"]').parent().hide();
				}
				almacenarDatos();
		}

		function iniciarSideNav() {
				$('.button-collapse').sideNav();
		}

		function almacenarDatos() {
				$('a.guardar-id').click(function (event) {
						event.preventDefault();
						var tipo = $(this).attr('data-tipo');
						var id = $(this).attr('data-id');
						localStorage.setItem('frontendPRTipo', tipo);
						localStorage.setItem('frontendPRid', id);
						window.location = $(this).attr('href');
				});
		}

		function salir() {
				var url = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/usuarios/salir';
				$('.salir').click(function () {
						$.ajax({
								type: 'GET',
								url: url,
								dataType: "json",
								contentType: 'application/json',
								xhrFields: {
										withCredentials: true
								},
								success: function (data, status, jqXHR) {
										localStorage.clear()
										localStorage.setItem('frontendPRnotificacion', 'Su sesión ha finalizado');

										window.location = 'index.html';
								},
								error: function (data, status, jqXHR) {
										Materialize.toast(JSON.parse(data.responseText).error, 3000, 'rounded');
								}
						});
						return false;
				});
		}
}(jQuery));
