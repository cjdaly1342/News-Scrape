// Website URL
var baseURL = window.location.origin;

// Save to Local Storage
localStorage.setItem('first', $("#next").attr('data_id'));

// Next Button Listener
$(document).on('click', '#next', function() {
	var id = $(this).attr('data-id');
	$.get(baseURL + '/next/' + id, buttons);
}); // End $(document).on('click', '#next', function() {

// Previous Button Listener
$(document).on('click', '#prev', function() {
	var id = $(this).attr('data-id');
	$.get(baseURL + '/prev' + id, buttons);
}); // End $(document).on('click', '#prev', function() {

// Buttons Function
function buttons(res) {
	// Update
	$('#picture>img').attr('src', res[0].imgURL);
	$('#content>h2').text(res[0].title);
	$('#content>p').text(res[0].synopsis);
	$('a.articleURL').attr('href', res[0].articleURL);

	comments(res[0].comments);

	$buttons = $('#buttons');
	if ($buttons.children().length === 1) {
		var $but = $('<buttons>').text('Previous').attr('id', 'prev').attr('data-id', res[0]._id);
		$buttons.prepend($but);
	} else {
		if (res[0]._id === localStorage.getItem('first')) {
			$('#prev').remove();
		} else{
			$('#prev').attr('data-id', res[0]._id);
		}
	}

	$('#next').attr('data-id', res[0]._id);
	$('#post').attr('data-id', res[0]._id);
} // End function buttons(res) {

function comments(obj) {
	$('#comment-holder').remove();
	var $commentHolder = $('<div>').attr('id', 'comment-holder');
	for (var i = 0; i < obj.length; i++) {
		var $p = $('<p>').html('<span class="number">' + (i + 1) + '</span>' + obj[i].text + ' <a href="#" class="remove" data-id="' + obj[i]._id + '">X</a>');
		$commentHolder.append($p);
	}
	$('#arms2>div.comments').append($commentHolder);
} // End function comments(obj) {

$(document).on('click', '#post', function() {
	var id = $(this).attr('data-id');
	$comment = $("#comment");
	var comment = $comment.val().trim();
	$comment.val('');
	$.post(baseURL + '/comment' + id, {comment: comment}, function(res) {
		comments(res);
	}); // End $.post(baseURL + '/comment' + id, {comment: comment}, function(res) {
}); // End $(document).on('click', '#post', function() {

$(document).on('click', '.remove', function() {
	var id = $('#post').attr('data-id');
	var removeID = $(this).attr('data-id');
	$.post(baseURL + '/remove' + id, {id: removeID}, function(res) {
		comments(res);
	}); // End $.post(baseURL + '/remove' + id, {id: removeID}, function(res) {
	return false;
}); // End $(document).on('click', '.remove', function() {