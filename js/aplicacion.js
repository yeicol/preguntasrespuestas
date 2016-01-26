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
				});
			} else {
				$(this).load('templates/' + template);
			}
		}
	});

	function menusVisibles() {
		var frontendPRSession = parseInt(localStorage.getItem('frontendPRSession'), 10);
		if (frontendPRSession) {
			$('.nav-wrapper > ul > li > a[data-session="false"]').parent().hide();
			$('a.guardar-id').attr('data-id', frontendPRSession);
		} else {
			$('.nav-wrapper > ul > li > a[data-session="true"]').parent().hide();
		}
	}

	$("#contenido-dinamico").on('click', 'a.guardar-id', function (event) {
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
