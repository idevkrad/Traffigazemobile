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
            @click="mark"
            >
            <Marker :options="{ position: destination }"/>
            <Marker :options="{ position: center, icon: {
                url:'https://traffigaze.info/images/icons/marker.png',
                scaledSize: {width: 25, height: 25},
            }, }"/>
            <Polyline :options="routepath" /> 
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
                @click="view(m.id,m.is_near)"
            />
              <Circle
                :key="index"
                v-for="(post,index) in posts"
                :options="{
                    center: post.coordinates,
                    radius: 300,
                    strokeColor: (post.is_near) ? '#FF0000' : '#ffffff',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: (post.is_near) ? '#FF0000' : '#ffffff',
                    fillOpacity: 0.35,
                    clickable: false
                }"
            />
            
        </GoogleMap>
      
          <!-- <button @click="getRoute()" class="btn btn-info  btn-md btn-icon" type="button" id="back-to-top" style="display: block; right: 10px; bottom: 150px;">
            <div class="btn-content"><i class="bx  bx bx-refresh"></i></div>
        </button> -->
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
import { GoogleMap, Marker, Polyline, Circle } from 'vue3-google-map';
import Layout from '../Layouts/Main.vue';
export default {
    components: { Layout, GoogleMap, Marker, Pusher, Polyline, Circle },
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
            routepath : {
            },
            posts: [],
            currentPlace: null,
            markers: [],
            places: [],
            directionsService: '',
            directionsDisplay: '',
            destination: {},
            options: {
                radius: 300,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                clickable: false
            },
            diameter: 500

        };
    },

    created(){
        this.fetch();
        this.geolocate();
        this.subscribe();
        this.trackPosition();
    },

    methods: {
        mark(event){
            const marker = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            this.destination = marker;
            this.getRoute();

            var n = this.arePointsNear(this.center, marker, this.diameter);
            console.log(n);
            
        },
        arePointsNear(checkPoint, centerPoint, km) { 
            var km = km/1000;
            var ky = 40000 / 360;
            var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
            var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
            var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
            return Math.sqrt(dx * dx + dy * dy) <= km;
        },
        getRoute: function () {
            // var noPoi = [
            // {
            //     featureType: "poi",
            //     stylers: [
            //     { visibility: "off" }
            //     ]   
            // }
            // ];

            // let map = new google.maps.Map(document.getElementById("mapContainer"),{
            //     zoom: 16,
            //     streetViewControl: false,
            //     mapTypeControl: false,
            //     disableDefaultUI: true,
            //     styles: noPoi
            // });
            this.directionsService = new google.maps.DirectionsService()
            this.directionsDisplay = new google.maps.DirectionsRenderer()
            // this.directionsDisplay.setMap(map)
            // this.$refs.mapy.$mapObject
            var vm = this
            vm.directionsService.route({
                origin: this.center, // Can be coord or also a search query
                destination: this.destination,
                travelMode: 'DRIVING',
            }, function (response, status) {
                if (status === 'OK') {
                    // vm.directionsDisplay.setDirections(response) // draws the polygon to the map
                    // console.log(google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline));

                    const routePath = {
                        path: google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline),
                        geodesic: true,
                        strokeColor: '#0c8fbb',
                        strokeOpacity: 1.0,
                        strokeWeight: 4,
                    }
                    vm.routepath = routePath;
                    // let last = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);
                    // console.log(response);
                    // this.destination = last[last.length-1];
                    // console.log(last[last.length-1])
                    // console.log(vm.routepath);
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
        view(id,is_near){
            if(is_near){
                this.$router.push({ path: '/post/'+id+'/'+is_near })
            }
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
                timeout: 40000,
                maximumAge: 0,
                })
            } else {
                alert(`Browser doesn't support Geolocation`)
            }
        },
        successPosition: function(position) {
            this.center = {lat: position.coords.latitude, lng: position.coords.longitude};
            for (let i = 0; i < this.posts.length; i++) {
                this.posts[i].is_near = this.arePointsNear(this.center,this.posts[i].coordinates,this.diameter);
            } 
            console.log(this.posts);
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

