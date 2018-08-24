<template>
    <div id="content1">
	<v-container align-center justify-center>
      	<v-layout align-center justify-center column fill-height mt-3 >
		<div id="container1">
			<video id="videoel" width="300" height="400" preload="auto" loop playsinline autoplay>
				</video>
			<canvas id="overlay1" width="300" height="400"></canvas>
			<img id="glass1" src=""/>
		</div>
		<br/>
		<input class="btn" type="button" value="wait, loading video" disabled="disabled" @click="startVideo" id="startbutton" />
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
         @click="startVideo(item.thumbnail_url)"
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
			<div id="text1">
			<div id="gum" class="gum">
				<p>To try it out:
					<li>allow the page to use your webcamera</li>
					<li>make sure that your face is clearly visible in the video, and click start</li>
					<li>see the model fitted to your face</li>
				</p>
			</div>
			<div id="nogum" class="nogum">
				<p>
					There was some problem trying to capture your webcamera, please check that your browser supports WebRTC. Using a fallback video instead. To try it out:
					<li>click start</li>
					<li>see the model fitted to the face</li>
				</p>
			</div>
		</div>
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
	var ctrack = new clm.tracker();
				ctrack.init();
	export default {
		name: 'mirror',
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
			start() {
				
				var vid = document.getElementById('videoel');
				var vid_width = vid.width;
				var vid_height = vid.height;
				var overlay = document.getElementById('overlay1');
				var overlayCC = overlay.getContext('2d');
				/*********** Setup of video/webcam and checking for webGL support *********/
				function enablestart() {
					var startbutton = document.getElementById('startbutton');
					startbutton.value = "start";
					startbutton.disabled = null;
				}
				var insertAltVideo = function(video) {
					// insert alternate video if getUserMedia not available
					if (supports_video()) {
						if (supports_webm_video()) {
							video.src = "./media/cap12_edit.webm";
						} else if (supports_h264_baseline_video()) {
							video.src = "./media/cap12_edit.mp4";
						} else {
							return false;
						}
						return true;
					} else return false;
				}

				function adjustVideoProportions() {
					// resize overlay and video if proportions of video are not 4:3
					// keep same height, just change width
					var proportion = vid.videoWidth / vid.videoHeight;
					vid_width = Math.round(vid_height * proportion);
					vid.width = vid_width;
					overlay.width = vid_width;
				}

				function gumSuccess(stream) {
					// add camera stream if getUserMedia succeeded
					if ("srcObject" in vid) {
						vid.srcObject = stream;
					} else {
						vid.src = (window.URL && window.URL.createObjectURL(stream));
					}
					vid.onloadedmetadata = function() {
						adjustVideoProportions();
						vid.play();
					}
					vid.onresize = function() {
						adjustVideoProportions();
						if (trackingStarted) {
							ctrack.stop();
							ctrack.reset();
							ctrack.start(vid);
						}
					}
				}

				function gumFail() {
					// fall back to video if getUserMedia failed
					//insertAltVideo(vid);
					document.getElementById('gum').className = "hide";
					document.getElementById('nogum').className = "nohide";
					alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
				}
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
				if (navigator.mediaDevices === undefined) {
					navigator.mediaDevices = {};
				}
				// Some browsers partially implement mediaDevices. We can't just assign an object
				// with getUserMedia as it would overwrite existing properties.
				// Here, we will just add the getUserMedia property if it's missing.
				if (navigator.mediaDevices.getUserMedia === undefined) {
					navigator.mediaDevices.getUserMedia = function(constraints) {
						// First get ahold of the legacy getUserMedia, if present
						var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
						// Some browsers just don't implement it - return a rejected promise with an error
						// to keep a consistent interface
						if (!getUserMedia) {
							return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
						}
						// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
						return new Promise(function(resolve, reject) {
							getUserMedia.call(navigator, constraints, resolve, reject);
						});
					}
				}
				navigator.mediaDevices.getUserMedia({
						audio: true,
						video: true
					})
					.then(function(stream) {
						var video = document.querySelector('video');
						// Older browsers may not have srcObject
						if ("srcObject" in video) {
							video.srcObject = stream;
						} else {
							// Avoid using this in new browsers, as it is going away.
							video.src = window.URL.createObjectURL(stream);
						}
						video.onloadedmetadata = function(e) {
							video.play();
						};
					})
					.catch(function(err) {
						console.log(err.name + ": " + err.message);
					});
				// set up video
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia({
						video: true
					}).then(gumSuccess).catch(gumFail);
				} else if (navigator.getUserMedia) {
					navigator.getUserMedia({
						video: true
					}, gumSuccess, gumFail);
				} else {
					//insertAltVideo(vid);
					document.getElementById('gum').className = "hide";
					document.getElementById('nogum').className = "nohide";
					alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
				}
				vid.addEventListener('canplay', enablestart, false);
				/*********** Code for face tracking *********/
				/*	var ctrack = new clm.tracker({
						searchWindow: 5,
						stopOnConvergence: false,
						scoreThreshold: 0.06
					});*/
				
				var trackingStarted = false;
				this.startVideoR = function startVideo(maskB) {
					// start video
					var model = maskB;
					document.getElementById('glass1').setAttribute('src', model);
					vid.play();
					// start tracking
					ctrack.start(vid);
					trackingStarted = true;
					// start loop to draw face
					drawLoop();
					positionLoop();
				}

				function drawLoop() {
					requestAnimFrame(drawLoop);
					overlayCC.clearRect(0, 0, vid_width, vid_height);
					//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
					if (ctrack.getCurrentPosition()) {
						ctrack.draw(overlay);
					}
				}

				function positionLoop() {
					requestAnimFrame(positionLoop);
					//canselDraw = requestAnimFrame(positionLoop);
					var positions = ctrack.getCurrentPosition();
					// do something with the positions ...
					// print the positions
					var positionString = "";
					var higthGlass = document.getElementById('glass1');
					if (positions) {

						ploc = positions[27];
						ploca = positions[32];
						ploco = positions[33];
						plocv = positions[0];
						plocw = positions[14];

						document.getElementById('glass1').style.top = ploco[1].toFixed(2) - (higthGlass.height / 2) + "px";
						document.getElementById('glass1').style.left = ploco[0].toFixed(2) - ((plocw[0] - plocv[0]) / 2).toFixed(2) + "px";
						document.getElementById('glass1').setAttribute('width', (plocw[0] - plocv[0]).toFixed(2) + "px"); //ploc[0].toFixed(2) - ploca[0].toFixed(2) + "px";
						
						var xx2 = Math.atan(((ploca[1] - ploc[1]).toFixed(2)) / ((ploca[0] - ploc[0]).toFixed(2))) * (180 / Math.PI);
						document.getElementById('glass1').style.transform = "rotateZ(" + (xx2.toFixed(2)) + "deg)";
					}
				}
				
			
		},
			startVideo(maskB) {
					this.startVideoR(maskB);
				}
			
		},
		mounted() {
				this.start();
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
<style scoped="true">
	#overlay1 {
		position: absolute;
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

	#videoel {
		-o-transform: scaleX(1);
		-webkit-transform: scaleX(1);
		transform: scaleX(1);
		-ms-filter: fliph;
		/*IE*/
		filter: fliph;
		/*IE*/
	}

	#container1 {
		position: relative;
		width: auto;
		/*margin : 0px auto;*/
	}

	#content1 {
		margin-top: 70px;
		/*margin-left: 100px;*/
		margin-right: 100px;
		max-width: 950px;
	}

	h2 {
		font-weight: 400;
	}

	.nogum {
		display: none;
	}

	.btn {
		font-family: 'Lato';
		font-size: 16px;
	}

	.hide {
		display: none;
	}

	.nohide {
		display: block;
	}

	#glass1 {
		margin: 0;
		position: absolute;
	}
	.swiper-slide {
		background-position: center;
		background-size: cover;
	}

</style>
