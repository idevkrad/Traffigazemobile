<template>
    <Layout>
        <div class="main-content">
            <div class="page-content">
                <b-container fluid>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-sm flex-shrink-0"><span
                                                class="avatar-title bg-light text-primary rounded-circle fs-3"><i
                                                    class=" ri-message-3-fill  align-middle"></i></span></div>
                                        <div class="flex-grow-1 ms-3">
                                            <p class="text-uppercase fw-semibold fs-12 text-muted mb-1">Total Post</p>
                                            <h4 class="mb-0"><span class="counter-value">{{posts}}</span></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 mt-n2">
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-sm flex-shrink-0"><span
                                                class="avatar-title bg-light text-primary rounded-circle fs-3"><i
                                                    class="ri-account-circle-fill align-middle"></i></span></div>
                                        <div class="flex-grow-1 ms-3">
                                            <p class="text-uppercase fw-semibold fs-12 text-muted mb-1">Total Users</p>
                                            <h4 class="mb-0"><span class="counter-value">{{users}}</span></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <b-card no-body>
                        <b-card-header class="align-items-center d-flex">
                            <b-card-title class="mb-0 flex-grow-1">Post Statistic</b-card-title>
                            <div class="flex-shrink-0"></div>
                        </b-card-header>
                        <b-card-body class="pb-0">
                            <apexchart class="apex-charts" height="250" dir="ltr" :series="series" :options="chartOptions"></apexchart>
                        </b-card-body>
                    </b-card>
                </b-container>
            </div>
        </div>
    </Layout>
</template>
<script>
import axios from 'axios';
import Layout from '../../Layouts/Admin.vue';
export default {
    components : { Layout },
    data(){
        return {
            users: '',
            posts: '',
            s: [],
            series: [
            ],
            chartOptions: {
                chart: {
                    type: "bar",
                    height: 341,
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "65%",
                    },
                },
                stroke: {
                    show: true,
                    width: 5,
                    colors: ["transparent"],
                },
                xaxis: {
                    categories: [""],
                    axisTicks: {
                        show: false,
                        borderType: "solid",
                        color: "#78909C",
                        height: 6,
                        offsetX: 0,
                        offsetY: 0,
                    },
                },
                fill: {
                    opacity: 1,
                },
                legend: {
                    show: true,
                    position: "bottom",
                    horizontalAlign: "center",
                    fontWeight: 500,
                    offsetX: 0,
                    offsetY: -14,
                    itemMargin: {
                        horizontal: 8,
                        vertical: 0,
                    },
                    markers: {
                        width: 10,
                        height: 10,
                    },
                },
                colors: this.getChartColorsArray('["--vz-primary", "--vz-success", "--vz-danger"]'),
            }
        }
    },

    created(){
        this.fetch();
    },

    methods : {
        fetch(){
            this.load = false;
            axios.get('/admin')
            .then(response => {
                if(response){
                    this.users = response.data.data.users;  
                    this.posts = response.data.data.posts; 
                    this.series = response.data.data.series;      
                    // this.load = true;
                }
            })
            .catch(err => console.log(err));
        },
        getChartColorsArray(colors) {
            colors = JSON.parse(colors);
            return colors.map(function (value) {
                var newValue = value.replace(" ", "");
                if (newValue.indexOf(",") === -1) {
                var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                if (color) {
                    color = color.replace(" ", "");
                    return color;
                } else return newValue;
                } else {
                var val = value.split(',');
                if (val.length == 2) {
                    var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                    rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                    return rgbaColor;
                } else {
                    return newValue;
                }
                }
            });
        }
    }
}
</script>