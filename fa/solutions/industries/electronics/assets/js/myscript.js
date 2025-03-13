const thumbnail = document.getElementsByClassName("video-box-thumbnail");
const thumbnail_num = thumbnail.length;
const modal = document.getElementsByClassName("video-box-modal");
const closebtn = document.getElementsByClassName("video-box-modal-close");


for(let i = 0; i < thumbnail_num; i++) {
	thumbnail[i].addEventListener('click', function() {
		this.nextElementSibling.classList.remove("video-box-modal-hide");
	});
	closebtn[i].addEventListener('click', function() {
		this.closest(".video-box-modal").classList.add("video-box-modal-hide");
		this.nextElementSibling.pause();
	});
}
