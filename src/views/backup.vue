<template>
<Layout>
    <div id="mapContainer">
        <l-map @ready="onReady" v-model:zoom="zoom" :center="centerPosition" @locationfound="onLocationFound" ref="mymap">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
            <l-marker :lat-lng="centerPosition" >
                <l-icon
                    :icon-size=" [5,5]"
                    icon-url="../src/assets/images/markers/dark.png"
                    class-name="blinking"
                /> 
            </l-marker>

            <l-marker v-for="(m, index) in posts" :key="index" :lat-lng="m.coordinates" @click="view(m.id)">
                <l-icon
                    :icon-size="[20,20]"
                    :icon-url="m.tag.icon"
                    class-name="blinking2"
                />
            </l-marker>
        </l-map>
    </div>
</Layout>
</template>
<script>
import Pusher from 'pusher-js';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon} from "@vue-leaflet/vue-leaflet";
import Layout from '../Layouts/Main.vue';
export default {
    components: { Layout, LMap, LTileLayer, LMarker, LIcon, Pusher },
    data() {
        return {
            centerPosition: {
                lat: 6.9305836,
                lng: 122.0824712,
                },
            zoom: 16,
            location: '',
            map: null,
            loc: {
                coords: ''
            }
        };
    },

    mounted() {
        this.trackPosition()
        this.fetch();
        this.subscribe();
    },

    methods : {
        subscribe() {
            let pusher = new Pusher('14287ee65fa2808ae890', { cluster: 'ap1' })
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
        onReady() {
        },
        onLocationFound(l) {
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
            this.centerPosition = {lat: position.coords.latitude, lng: position.coords.longitude}
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
</style>