function registration_form_regtype_onchange() {
	let is_selected = $('#regtype-simple').is(':checked')
	$('#registration-form-simple').toggle(is_selected)
	$('#registration-form-simple input').not("[name='telegram']").attr("required", is_selected)

	is_selected = $('#regtype-speaker').is(':checked')
	$('#registration-form-speaker').toggle(is_selected)
	$('#registration-form-speaker input').attr("required", is_selected)
}

function registration_form_file_onchange() {
	const regex = /^.+?\.(pdf|docx|doc|odt)$/
	let filename = $('#registration-form-file').val().replace(/.*(\/|\\)/, '');

	if (regex.test(filename)) {
		$('#registration-form-filename').text(filename)
		$('#registration-form-extension-error').hide()
	} else {
		$('#registration-form-file').val("")
		$('#registration-form-filename').text("Файл не выбран")
		$('#registration-form-extension-error').toggle(filename !== "")
	}
}

$('#regtype-simple').change(registration_form_regtype_onchange)
$('#regtype-speaker').change(registration_form_regtype_onchange)
$('#registration-form-file').change(registration_form_file_onchange)

registration_form_regtype_onchange()
registration_form_file_onchange()

$(document).on("formvalid.zf.abide", function(e,f){
	if (f.attr("id") === "registration-form-id") {
		$("#registration-form-id :input").prop("disabled", true);
		$("#registration-form-error").hide();

		let fd = new FormData()
		fd.append("type", f.find("input[name='type']:checked").val())
		fd.append("firstname", f.find("input[name='firstname']").val())
		fd.append("secondname", f.find("input[name='secondname']").val())
		fd.append("email", f.find("input[name='email']").val())
		fd.append("telephone", f.find("input[name='telephone']").val())
		fd.append("telegram", f.find("input[name='telegram']").val())
		if ($('#regtype-speaker').is(':checked')) {
			fd.append("doc-title", f.find("input[name='doc-title']").val())
			fd.append("doc-file", f.find("input[name='doc-file']")[0].files[0])
		}

		let req = $.ajax({
			url: '/api/user/',
			data: fd,
			processData: false,
  			method: 'POST',
  			contentType: false,
  			async: true,
  			timeout:30000
		})

		req.done(function(data){
			$('#registration-success').foundation('open')
			$('#registration-form-id').foundation('resetForm');
			$("#registration-form-id :input").prop("disabled", false);
		})
		.fail(function(data){
			$("#registration-form-id :input").prop("disabled", false);
			$("#registration-form-error-text").html(`${data.status} ${data.statusText}<br>${JSON.stringify(data.responseJSON)}`)
			$("#registration-form-error").show();
		})
	}
}).on('submit', function(event) {
	event.preventDefault()
})

$(document).foundation()