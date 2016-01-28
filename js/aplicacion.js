/* global Materialize */

(function ($) {

		/**
			* Carga porciones de html dentro de la página
			*/
		$('.template').each(function () {
				var template = $(this).attr('data-template');
				if (template.length > 0) {
						if ($(this).attr('id') === 'navegacion') {
								var titulo = $(this).attr('data-titulo');
								$(this).load('templates/' + template, function () {
										$('.nav-wrapper > #titulo-pagina').html(titulo);
										$('.nav-wrapper > ul > li > span').filter(function () {
												return $(this).text() === titulo;
										}).parent().addClass('active');
										menusVisibles();
										iniciarSideNav();
										salir();
										$('a.guardar-id').click(function (event) {
												event.preventDefault();
												var tipo = $(this).attr('data-tipo');
												var id = $(this).attr('data-id');
												localStorage.setItem('frontendPRTipo', tipo);
												localStorage.setItem('frontendPRid', id);
												window.location = $(this).attr('href');
										});
								});
						} else {
								$(this).load('templates/' + template);
						}
				}
		});

		/*
			* Muestra las notificaciones almacenadas en localestorage
			*/
		var notificacion = localStorage.getItem('frontendPRnotificacion');
		if (notificacion) {
				Materialize.toast(notificacion, 3000, 'rounded');
				localStorage.removeItem('frontendPRnotificacion');
		}

		/**
			*  Obtiene los menús visibles dependiendo si hay o no un usuario logueado
			* @returns
			*/
		function menusVisibles() {
				var frontendPRSession = parseInt(localStorage.getItem('frontendPRSession'), 10);
				if (frontendPRSession) {
						$('.nav-wrapper > ul > li > a[data-session="false"]').parent().hide();
						$('a.guardar-id[data-session="true"]').attr('data-id', frontendPRSession);
				} else {
						$('.nav-wrapper > ul > li > a[data-session="true"]').parent().hide();
				}
		}

		/**
			*  Inicia la barra de navegación lateral para moviles
			* @returns
			*/
		function iniciarSideNav() {
				$('.button-collapse').sideNav();
		}

		/**
			* Almacena en localstorage los id de los elementos
			* que deben verse en otras páginas
			*/
		$('#contenido-dinamico').on('click', 'a.guardar-id', function (event) {
				event.preventDefault();
				var tipo = $(this).attr('data-tipo');
				var id = $(this).attr('data-id');
				localStorage.setItem('frontendPRTipo', tipo);
				localStorage.setItem('frontendPRid', id);
				window.location = $(this).attr('href');
		});

		/**
			* Finaliza la sesión de usuario
			* @returns
			*/
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
