$(document).ready(function(){
var authorsArr = []

var getAuthors = document.getElementById('authors');
var elementChildren = getAuthors.children;
for (var i = 0; i < elementChildren.length; i++) {
    authorsArr.push(elementChildren[i].id);
    console.log(elementChildren[i].id);
}

var authorData = document.getElementById('author-data')
authorData.value = authorsArr



  $('#add-author').on('click', function() {
    var selected = $('#available-authors :selected').text()
    var selectedId = $('#available-authors :selected').attr('value');
    var el = document.getElementById('authors'),
    elChild = document.createElement('option');
    elChild.innerHTML = selected
    elChild.id = selectedId
    el.appendChild(elChild);

    authorsArr.push(selectedId)
    authorData.value = authorsArr
  })

  $('#delete-author').on('click', function() {
    $('#authors').empty()
    authorsArr = []
    authorData.value = authorsArr
    console.log(authorsArr);
  })
})
