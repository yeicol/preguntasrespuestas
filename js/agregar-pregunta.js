/**
	* Crea una pregunta
	*/
(function ($) {
		var url = 'http://preguntasrespuestas-yeicores72.rhcloud.com/api/preguntas';
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
						success: function (data, status, jqXHR) {
								window.location = 'agregar-pregunta.html';
						},
						error: function (data, status, jqXHR) {
								console.log(status);
						},
				});

				return false;
		});

}(jQuery));
