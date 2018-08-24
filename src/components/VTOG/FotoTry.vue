<template>
    <div id="contentx" v-if="isAuthenticated">
     	<v-container align-center justify-center>
      	<v-layout align-center justify-center column fill-height mt-3 >
		<div id="containerx">
			<canvas id="image" width="160" height="240" ref="canvas"></canvas>
			<img id="glass" src=""/>
			<canvas id="overlay" width="160" height="240"></canvas>
		</div>
		<br/>
	 <v-btn
      color="blue-grey"
      class="white--text"
     @click="uploadA"
    >Upload
	<input  type="file"  id="files" name="files[]" style="display:none;" />
      <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
		<p id="convergence"></p>
		<p id="positions"></p>
    <v-flex md6  align-center justify-center>
		<swiper :options="swiperOption">
        <swiper-slide v-for="(item,i) in items"
        class="mb-5 px-5 align-center justify-space-between row fill-height"
      :key="i" >
    <v-flex xs6 offset-xs3>
    	  <v-card
    	  >
        <v-card-media
          :src="item.thumbnail_url"
          height="150px"
         contain
         @click="animateClean(item.thumbnail_url)"
        >
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <div class="headline">{{item.title }}</div>
            <span class="grey--text">{{item.title }}</span>
          </div>
        </v-card-title>
        <v-card-actions class="d-inline-block align-end align-content-end pl-5 ">
          <v-btn flat>Share</v-btn>
          <v-btn flat color="purple">Explore</v-btn>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="show">
            {{item.description}}
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
	</v-flex>
      </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
	</v-flex>
   	  </v-layout>
     	</v-container>
	</div>
</template>
<script>
	var $ = require('jquery');
	import clm from "clmtrackr";
	//var clm = require("../../assets/js/clmtrackr");
	require("../../assets/js/utils.js");
	require("../../assets/js/dat.gui.min.js");
	//require("../../assets/js/libs/Stats.js");
	var ploc = [];
	var ploca = [];
	var ploco = [];
	var plocv = [];
	var plocw = [];
	var ctrack = new clm.tracker({
		searchWindow: 5,
		stopOnConvergence: true,
		scoreThreshold: 0.01
	});
	ctrack.init();
	export default {
		name: 'foto',
		data() {
			return {
				items: [],
				show: false,
				swiperOption: {
					effect: 'coverflow',
					grabCursor: true,
					centeredSlides: true,
					slidesPerView: 'auto',
					coverflowEffect: {
						rotate: 50,
						stretch: 0,
						depth: 100,
						modifier: 1,
						slideShadows: false
					},
					pagination: {
						el: '.swiper-pagination'
					}
				}
			}
		},
		methods: {
			uploadA() {
				document.getElementById('files').click();
			},
			startMirror() {
				var canvas = document.getElementById('image');
				var cc = canvas.getContext('2d');
				var overlay = document.getElementById('overlay');
				var overlayCC = overlay.getContext('2d');
				var drawRequest;
				var canselDraw;
				this.oi = function animateClean(maskA) {
					var model = maskA;
					document.getElementById('glass').setAttribute('src', model);
					ctrack.start(document.getElementById('image'));
					//run();
					drawLoop();
					positionLoop();
				}

				function animate(box) {
					ctrack.start(document.getElementById('image'), box);
					drawLoop();
				}

				function drawLoop() {
					drawRequest = requestAnimFrame(drawLoop);
					overlayCC.clearRect(0, 0, 160, 240);
					if (ctrack.getCurrentPosition()) {
						//ctrack.draw(overlay);
					}
				}

				function positionLoop() {
					canselDraw = requestAnimFrame(positionLoop);
					var positions = ctrack.getCurrentPosition();
					// do something with the positions ...
					// print the positions
					var positionString = "";
					if (positions) {
						for (var p = 0; p < 71; p++) {
							ploc = positions[27];
							ploca = positions[32];
							ploco = positions[33];
							plocv = positions[0];
							plocw = positions[14];
							if (p === 70) {
								document.getElementById('glass').style.top = ploco[1].toFixed(2) - ((plocw[0] - plocv[0]) / 2).toFixed(2) + 0 + "px";
								document.getElementById('glass').style.left = ploco[0].toFixed(2) - ((plocw[0] - plocv[0]) / 2).toFixed(2) + "px";
								document.getElementById('glass').setAttribute('width', (plocw[0] - plocv[0]).toFixed(2) + "px");
							}
						}
					}
					var xx2 = Math.atan(((ploca[1] - ploc[1]).toFixed(2)) / ((ploca[0] - ploc[0]).toFixed(2))) * (180 / Math.PI);
					document.getElementById('glass').style.transform = "rotateZ(" + (xx2.toFixed(2)) + "deg)";
				}
				// detect if tracker fails to find a face
				document.addEventListener("clmtrackrNotFound", function(event) {
					ctrack.stop();
					console.log("Not Found.")
				}, false);
				// detect if tracker loses tracking of face
				document.addEventListener("clmtrackrLost", function(event) {
					ctrack.stop();
					console.log("lost.")
				}, false);
				// detect if tracker has converged
				document.addEventListener("clmtrackrConverged", function(event) {
					document.getElementById('convergence').innerHTML = "CONVERGED";
					document.getElementById('convergence').style.backgroundColor = "#FF0000";
					// stop drawloop
					cancelRequestAnimFrame(drawRequest);
					overlayCC.clearRect(0, 0, 160, 240);
					cancelRequestAnimFrame(canselDraw);
					//ctrack.reset();
				}, false);

				function selectBox() {
					overlayCC.clearRect(0, 0, 160, 240);
					document.getElementById('convergence').innerHTML = "";
					ctrack.reset();
					$('#overlay').addClass('hide');
					$('#image').imgAreaSelect({
						handles: true,
						onSelectEnd: function(img, selection) {
							// create box
							var box = [selection.x1, selection.y1, selection.width, selection.height];
							// do fitting
							animate(box);
							$('#overlay').removeClass('hide');
						},
						autoHide: true
					});
				}
				// function to start showing images
				function loadImage() {
					if (fileList.indexOf(fileIndex) < 0) {
						var reader = new FileReader();
						reader.onload = (function(theFile) {
							return function(e) {
								// check if positions already exist in storage
								// Render thumbnail.
								//var canvas = document.getElementById('image')
								//var cc = canvas.getContext('2d');
								var img = new Image();
								img.onload = function() {
									if (img.height > 240 || img.width > 160) {
										var rel = img.height / img.width;
										var neww = 160;
										var newh = neww * rel;
										if (newh > 240) {
											newh = 240;
											neww = newh / rel;
										}
										canvas.setAttribute('width', neww);
										canvas.setAttribute('height', newh);
										overlay.setAttribute('width', neww);
										overlay.setAttribute('height', newh);
										cc.drawImage(img, 0, 0, neww, newh);
									} else {
										canvas.setAttribute('width', img.width);
										canvas.setAttribute('height', img.height);
										overlay.setAttribute('width', img.width);
										overlay.setAttribute('height', img.height);
										cc.drawImage(img, 0, 0, img.width, img.height);
									}
								}
								img.src = e.target.result;
							};
						})(fileList[fileIndex]);
						reader.readAsDataURL(fileList[fileIndex]);
						overlayCC.clearRect(0, 0, 160, 240);
						document.getElementById('convergence').innerHTML = "";
						ctrack.reset();
					}
				}
				// set up file selector and variables to hold selections
				var fileList, fileIndex;
				if (window.File && window.FileReader && window.FileList) {
					function handleFileSelect(evt) {
						var files = evt.target.files;
						fileList = [];
						for (var i = 0; i < files.length; i++) {
							if (!files[i].type.match('image.*')) {
								continue;
							}
							fileList.push(files[i]);
						}
						if (files.length > 0) {
							fileIndex = 0;
						}
						loadImage();
					}
					document.getElementById('files').addEventListener('change', handleFileSelect, false);
				} else {
					$('#files').addClass("hide");
					$('#loadimagetext').addClass("hide");
				}
			},
			animateClean(maskA) {
				this.oi(maskA);
			},
		},
		mounted() {
			//console.log("Not Found.", this.$store.getters.isLoggedInAD );
			this.startMirror();
		},
		created() {
			this.items = this.$store.getters.products;
		},
		computed: {
			isAuthenticated() {
				return this.$store.getters.isLoggedIn
			}
		},
		components: {}
	}

</script>
<style scoped>
	@import url(https://fonts.googleapis.com/css?family=Lato:300italic,320italic,300,320);
	#overlay {
		position: absolute;
		top: 0px;
		left: 0px;
		margin: 0;
		-o-transform: scaleX(1);
		-webkit-transform: scaleX(1);
		transform: scaleX(1);
		-ms-filter: fliph;
		/*IE*/
		filter: fliph;
	}

	#image {
		margin: 0;
		top: 0px;
		left: 0px;
		-o-transform: scaleX(1);
		-webkit-transform: scaleX(1);
		transform: scaleX(1);
		-ms-filter: fliph;
		/*IE*/
		filter: fliph;
		/*IE*/
	}

	#containerx {
		position: relative;
		display: flex;
		/*width: 320px;*/
		/*margin : 0px auto;*/
	}

	#content1 {
		margin-top: 70px;
		margin-left: 5px;
		margin-right: 100px;
		max-width: 950px;
	}

	#convergence {
		display: inline;
	}

	h2 {
		font-weight: 400;
	}

	.btn {
		font-family: 'Lato';
		font-size: 16px;
	}

	.hide {
		display: none;
	}

	#mkm {
		margin: 0;
		position: absolute;
		width: 4px;
		height: 4px;
		background-color: deeppink;
		border-radius: 20px;
		display: flex;
		align-items: center;
	}

	#mkn {
		margin: 0;
		position: absolute;
		width: 4px;
		height: 4px;
		background-color: orangered;
		border-radius: 20px;
	}

	#mko {
		margin: 0;
		position: absolute;
		width: 4px;
		height: 4px;
		background-color: darkorchid;
		border-radius: 20px;
	}

	#glass {
		position: absolute;
		top: 0px;
		left: 0px;
		margin: 0;
		z-index: auto;
		/*-o-transform: scaleX(-1);
			-webkit-transform: scaleX(-1);
			transform: scaleX(-1);
			-ms-filter: fliph;
			filter: fliph;*/
	}

	.swiper-innerxxx {
		width: 50%;
		height: 400px;
		padding-top: 50px;
		padding-bottom: 50px;
	}

	.swiper-slide {
		background-position: center;
		background-size: cover;
	}

	/*input[type=file]{ 
        color:transparent;
    }*/

</style>
