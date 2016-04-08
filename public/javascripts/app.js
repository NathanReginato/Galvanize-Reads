$(document).ready(function(){
var authorsArr = []

  $('#add-author').on('click', function() {
    var selected = $('#available-authors :selected').text()
    var selectedId = $('#available-authors :selected').attr('value');
    var el = document.getElementById('authors'),
    elChild = document.createElement('option');
    elChild.innerHTML = selected
    elChild.id = selectedId
    el.appendChild(elChild);

    authorData = document.getElementById('author-data')
    authorsArr.push(selectedId)
    authorData.value = authorsArr
  })

  $('#delete-author').on('click', function() {
    $('#authors').empty()
    authorsArr = []
  })

})
