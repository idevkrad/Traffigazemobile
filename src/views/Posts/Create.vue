<template>
<Layout>
    <div>
    <!-- <h1>Geolocation</h1>
    <p>Your location is:</p>
    <p>
      Latitude: <span v-if="loc">{{ loc.coords.latitude }}</span>
    </p>
    <p>
      Longitude: <span v-if="loc">{{ loc.coords.longitude }}</span>
    </p>
    <v-btn block elevation="2" @click="getCurrentPosition">Get Current Location</v-btn> -->
    
    <b-card no-body style="height: calc(100vh - 138px); margin-top: 74px;">
        <b-card-body >
            <!-- <img src="@/assets/images/small/img-2.jpg" class="img-fluid" alt="Responsive image" /> -->
            <form action="javascript:void(0);">
                <span class="badge bg-outline-danger badge-outline-danger" style="width: 100%;" v-if="this.post.coordinates == ''">GPS not found</span>
                 <div class="mt-2">
                    <label for="employeeName" class="form-label" style="font-size: 10px; margin-bottom: -5px;">Location</label>
                    <input type="text" v-model="post.location" class="form-control" placeholder="loading.." readonly/>
                </div>
                <div class="mt-2">
                    <label for="employeeName" class="form-label" style="font-size: 10px; margin-bottom: -5px;">Barangay</label>
                    <select v-model="post.barangay_id" class="form-select mb-3" aria-label="Default select example">
                        <option value="" selected>Select Barangay</option>
                        <option :value="b.id" v-for="(b,index) in barangays" v-bind:key="index">{{b.name}}</option>
                    </select>
                </div>
                 <div class="mt-n2">
                    <label for="employeeName" class="form-label" style="font-size: 10px; margin-bottom: -5px;">Tag</label>
                    <select v-model="post.tag_id" class="form-select mb-3" aria-label="Default select example">
                        <option value="" selected>Select Tag</option>
                        <option :value="t.id" v-for="(t,index) in tags" v-bind:key="index">{{t.name}}</option>
                    </select>
                </div>
                <div class="mt-n2">
                    <label class="form-label" style="font-size: 10px; margin-bottom: -5px;">Information</label>
                    <textarea class="form-control" v-model="post.information" rows="3" placeholder="Enter your message"></textarea>
                </div>
                <div class="d-grid gap-2 mt-2">
                    <button class="btn btn-light btn-sm" @click="ClickImage()" type="button" block="">
                        <div class="btn-content">Take Picture</div>
                    </button>
                </div>
                <div class="d-grid gap-2 mt-2">
                    <button class="btn btn-primary btn-sm" @click="create()" type="button" block="">
                        <div class="btn-content">Submit</div>
                    </button>
                </div>
            </form>
        </b-card-body>
    </b-card>

  </div>
</Layout>
</template>
<script>
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import axios from 'axios';
import Layout from '../../Layouts/Main.vue';
export default {
    components : { Layout },
    data(){
        return {
            loc: null,
            post: {
                user_id: this.$store.state.auth.user.data.id,
                tag_id: '',
                barangay_id: '',
                location: '',
                information: '',
                coordinates: ''
            },
            barangays: [],
            tags: [],
            imageUrl: '',
            render: false,
            processing: false
        }
    },

    watch : {
        "post.barangay_id"(){
            this.fetchAddress();
        },
        "post.tag_id"(){
            this.fetchAddress();
        },
    },

    created(){
        this.trackPosition();
        this.fetch();
    },
    methods: {
        async Clear() {
            this.imageUrl = '';
            this.render = false;
        },
        async ClickImage() {
            await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                source: CameraSource.Camera,
                resultType: CameraResultType.Base64,
                }).then((image) => {
                this.render = true;
                this.imageUrl = String(image.base64String)
                this.imageUrl = 'data:image/jpeg;base64,'+this.imageUrl;
            });
        },
        fetch(){
            axios.get('/lists')
            .then(response => {
                if(response){
                    this.barangays = response.data.data.barangays;   
                    this.tags = response.data.data.tags;    
                }
            })
            .catch(err => console.log(err));
        },
        fetchAddress(){
            axios.get('/location',{params : {lat: this.post.coordinates.lat,lng: this.post.coordinates.lng}})
            .then(response => {
                if(response){
                    this.post.location = response.data.data;
                }
            })
            .catch(err => console.log(err));
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
            this.post.coordinates = {lat: position.coords.latitude, lng: position.coords.longitude}
            // this.fetchAddress();
        },
        failurePosition: function(err) {

            console.log('Error Code: ' + err.code + ' Error Message: ' + err.message)
        },
        async create(){
            this.processing = true
            let data = new FormData()
            data.append('user_id', this.post.user_id);
            data.append('tag_id', this.post.tag_id);
            data.append('barangay_id', this.post.barangay_id);
            data.append('location', this.post.location);
            data.append('information', this.post.information);
            data.append('coordinates', JSON.stringify(this.post.coordinates))
            data.append('image', this.imageUrl)
            
            let config = {
                header : {
                'Content-Type' : 'multipart/form-data'
                }
            }

            await axios.post('create',data,config).then(({data})=>{
                this.$router.push('/posts');
            }).catch(({response})=>{
                if(response.status===422){
                    this.validationErrors = response.data.errors
                }else{
                    this.validationErrors = {}
                    alert(response.data.message)
                }
            }).finally(()=>{
                this.processing = false
            })
        },
        
    }
}
</script>
