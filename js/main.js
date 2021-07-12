/* global data */
/* exported data */
var $photoURL = document.querySelector('.photoURL');
var $previewPhoto = document.querySelector('.previewPhoto');
function updateSRC(event) {
  $previewPhoto.src = $photoURL.value;
}

$photoURL.addEventListener('input', updateSRC);
