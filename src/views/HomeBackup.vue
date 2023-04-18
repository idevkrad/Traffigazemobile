<template>
<Layout>
    <div >
   
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
          <button @click="getRoute()" class="btn btn-info  btn-md btn-icon" type="button" id="back-to-top" style="display: block; right: 10px; bottom: 150px;">
            <div class="btn-content"><i class="bx  bx bx-refresh"></i></div>
        </button>
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
import Pusher from 'pusher-js';
import axios from 'axios';
import { GoogleMap, Marker } from 'vue3-google-map';
import Layout from '../Layouts/Main.vue';
export default {
    components: { Layout, GoogleMap, Marker, Pusher },
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
            directionsService: '',
            directionsDisplay: '',
            destination: {lat: 6.9301867, lng: 122.08967},

        };
    },

    created(){
        this.fetch();
        this.geolocate();
        // this.subscribe();
    },

    methods: {
        getRoute: function () {
            let map = new google.maps.Map(document.getElementById("mapContainer"));
            this.directionsService = new google.maps.DirectionsService()
            this.directionsDisplay = new google.maps.DirectionsRenderer()
            this.directionsDisplay.setMap(map)
            // this.$refs.mapy.$mapObject
            var vm = this
            vm.directionsService.route({
                origin: this.center, // Can be coord or also a search query
                destination: this.destination,
                travelMode: 'DRIVING',
            }, function (response, status) {
                if (status === 'OK') {
                vm.directionsDisplay.setDirections(response) // draws the polygon to the map
              

                } else {
                console.log('Directions request failed due to ' + status)
                }
            })
        },
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
        subscribe() {
            let pusher = new Pusher('f9960142a530c321b7e6', { cluster: 'ap1' })
            pusher.subscribe('posts')
            pusher.bind('App\\Events\\PostBroadcast', data => {
                // console.log(data);
                switch(data.type){
                    case 'post':
                        this.posts.unshift(data.post);
                    break;
                }
            })
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

