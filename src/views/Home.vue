<template>
<Layout>
    <div id="mapContainer">
   
         <GoogleMap id="mapContainer"
            api-key="AIzaSyCG-k6UIxH8HXFQzZvuuya6S5hKuXhMP-c"
            :center="center"
            :zoom="16"
            :streetViewControl="false"
            :mapTypeControl="false"
            :disableDefaultUI="true"
            :styles="st"
            >
            <Marker :options="{ position: center }"/>

            <Marker 
                :key="index"
                v-for="(m, index) in posts"
                :options="{
                    position: m.coordinates,
                    icon: {
                        url: m.tag.icon,
                        scaledSize: {width: 25, height: 25},
  
                    },
                }"
                @click="view(m.id)"
            />
            
        </GoogleMap>
        <button @click="fetch()" class="btn btn-info  btn-md btn-icon" type="button" id="back-to-top" style="display: block; right: 10px; bottom: 110px;">
            <div class="btn-content"><i class="bx  bx bx-refresh"></i></div>
        </button>
        <button @click="geolocate()" class="btn btn-info btn-md btn-icon" type="button" id="back-to-top" style="display: block; right: 10px; bottom: 70px;">
            <div class="btn-content"><i class="ri-map-pin-fill"></i></div>
        </button>
    </div>
    
</Layout>
</template>
<script>
import axios from 'axios';
import { GoogleMap, Marker } from 'vue3-google-map';
import Layout from '../Layouts/Main.vue';
export default {
    components: { Layout, GoogleMap, Marker },
    data() {
        return {
            center: {lat: 6.9305836, lng: 122.0824712},
            st: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ],
            posts: [],
            currentPlace: null,
            markers: [],
            places: [],
        };
    },

    created(){
        this.fetch();
        this.geolocate();
    },

    methods: {
        setPlace(place) {
            this.currentPlace = place;
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                lat: this.currentPlace.geometry.location.lat(),
                lng: this.currentPlace.geometry.location.lng(),
                };
                this.markers.push({ position: marker });
                this.places.push(this.currentPlace);
                this.center = marker;
                this.currentPlace = null;
            }
        },
        fetch(){
            axios.get('/posts',{ params : {type : 'all'}})
            .then(response => {
                if(response){
                    this.posts = response.data.data;     
                }
            })
            .catch(err => console.log(err));
        },
        view(id){
            this.$router.push({ path: '/post/'+id })
        },
        geolocate() {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        },
        trackPosition() {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(this.successPosition, this.failurePosition, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
                })
            } else {
                alert(`Browser doesn't support Geolocation`)
            }
        },
        successPosition: function(position) {
            this.center = {lat: position.coords.latitude, lng: position.coords.longitude}
        },
        failurePosition: function(err) {
            console.log('Error Code: ' + err.code + ' Error Message: ' + err.message)
        },
    }
   
}
</script>
<style>
.container-fluid {
    padding-right: 0;
    padding-left: 0;
}
#mapContainer {
    height: calc(100vh - 132px); 
    margin-top: 70px;
}
.blinking2 {
  width: 200px;
  height: 200px;
    background-color: #fff;
  border-radius: 50px;
  animation: glow2 1s infinite alternate;
}
.blinking {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: #fff;
  animation: glow 1s infinite alternate;
}
@keyframes glow {
  from {
    box-shadow: 0 0 3px -3px #fff,
                0 0 6px -6px #f0f,
                0 0 9px -9px #0ff;
  }
  to {
    box-shadow: 0 0 3px 3px #fff,
                0 0 6px 6px #f0f,
                0 0 9px 9px #0ff;
  }
}
@keyframes glow2 {
  from {
    box-shadow: 0 0 3px -3px #211900,
                0 0 6px -6px #f0f,
                0 0 9px -9px #0ff;
  }
  to {
    box-shadow: 0 0 3px 3px #211900,
                0 0 6px 6px #f0f,
                0 0 9px 9px #0ff;
  }
}
.gmnoprint {
    display: none;
}
</style>

