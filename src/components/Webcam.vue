<template>
    <!-- <div class="camera-button">
        <button type="button" class="button is-rounded"
            :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
            <span v-if="!isCameraOpen">Open Camera</span>
            <span v-else>Close Camera</span>
        </button>
    </div> -->

    <!-- <div v-show="isCameraOpen && isLoading" class="camera-loading">
        <ul class="loader-circle">
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div> -->

    <div v-if="isCameraOpen" v-show="!isLoading" :class="{ 'flash' : isShotPhoto }">
        <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>

        <video v-show="!isPhotoTaken" ref="camera" class="fullscreen1" style="width: 100%; margin-top: 70px;" autoplay></video>

        <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="500" :height="500"></canvas>
      
    </div>
    
    <div v-if="isCameraOpen && !isLoading" class="customizer-setting  d-md-block">
        <div @click="takePhoto" class="btn-soft-light btn-rounded shadow-lg btn btn-icon btn-lg p-2" id="mdi-cog">
            <i class="bx bxs-camera fs-22"></i>
        </div>
    </div>

    <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">
        <a id="downloadPhoto" download="my-photo.jpg" class="button" role="button" @click="downloadImage">
            Download
        </a>
    </div>
   
</template>
<script>
export default {
    data() {
        return {
            isCameraOpen: false,
            isPhotoTaken: false,
            isShotPhoto: false,
            isLoading: false,
            link: '#',
            wdth: window.innerWidth
        }
    },

    methods: {
    toggleCamera() {
      if(this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },
    
    createCameraElement() {
      this.isLoading = true;
      
      const constraints = (window.constraints = {
				audio: false,
				video: true
			});


			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(stream => {
          this.isLoading = false;
					this.$refs.camera.srcObject = stream;
				})
				.catch(error => {
          this.isLoading = false;
					alert("May the browser didn't support or there is some errors.");
				});
    },
    
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

			tracks.forEach(track => {
				track.stop();
			});
    },
    
    takePhoto() {
      if(!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }
      this.isPhotoTaken = !this.isPhotoTaken;
      
      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
    },
    
    downloadImage() {
      const download = document.getElementById("downloadPhoto");
      const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
    .replace("image/jpeg", "image/octet-stream");
      download.setAttribute("href", canvas);
    }
  }
}
</script>
<style>
#camContainer {
    height: calc(100vh - 132px); 
    margin-top: 70px;
}
.fullscreen {
    position: fixed;
    margin-top:70px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: black;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    height: calc(100vh - 72px);
}
.customizer-setting {
  position: fixed;
  bottom: 20px;
  left: 44%;
  z-index: 1000;
}
</style>