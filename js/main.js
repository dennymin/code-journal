/* global data */
/* exported data */

// photo url and preview photo code
var $photoUrl = document.querySelector('.photoUrl');
var $previewPhoto = document.querySelector('.previewPhoto');
function updateSRC(event) {
  $previewPhoto.src = $photoUrl.value;
}

$photoUrl.addEventListener('input', updateSRC);

// save button interactions code
var $form = document.forms[0];
function retrieveData(event) {
  event.preventDefault();
  var dataEntry = {};
  dataEntry.title = $form.elements.title.value;
  dataEntry.pictureLink = $form.elements.photoUrl.value;
  dataEntry.notes = $form.elements.notes.value;
  dataEntry.nextEntryId = data.nextEntryId;
  data.entries.unshift(dataEntry);
  data.nextEntryId++;
  $form.reset();
  $previewPhoto.src = 'images/placeholder-image-square.jpg';
}
$form.addEventListener('submit', retrieveData);
