<template>
<Layout>
    <div class="main-content">
        <div class="page-content">
            <b-container fluid>
                <b-row>
                     <b-col lg="12">
                        <b-card no-body>
                            <b-card-body>
                               <div class="table-responsive">
                                    <table class="table table-bordered align-middle table-nowrap mb-0">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Tag</th>
                                                <th class="text-center">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(list,index) in lists" v-bind:key="index">
                                                <td class="text-center">{{list.name}}</td>
                                                <td class="text-center">{{list.posts_count}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-card-body>
                        </b-card>
                    </b-col>
                    <b-col lg="12">
                        <b-card no-body>
                            <b-card-body>
                                <apexchart class="apex-charts" height="300" dir="ltr" :series="series"
                                :options="chartOptions"></apexchart>
                            </b-card-body>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</Layout>
</template>
<script>
import axios from 'axios';
import Layout from '../../Layouts/Main.vue';
export default {
    components : { Layout },
    data(){
        return {
            lists: [],
            series: [],
            chartOptions: {
                chart: {
                height: 300,
                type: "pie",
                },
                labels: [],
                legend: {
                position: "bottom",
                },
                dataLabels: {
                dropShadow: {
                    enabled: false,
                },
                },
                colors: this.getChartColorsArray('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'),
            },
        }
    },
    created(){
        this.fetch();
    },
    methods : {
        fetch(){
            this.load = false;
            axios.get('/tag')
            .then(response => {
                if(response){
                    this.lists = response.data.lists;
                    this.series = response.data.data.series;     
                    this.chartOptions = {
                        ...this.chartOptions,
                        ...{
                            labels: response.data.data.labels
                        }
                    }; 
                }
            })
            .catch(err => console.log(err));
        },
        getChartColorsArray(colors){
            colors = JSON.parse(colors);
            return colors.map(function (value) {
                var newValue = value.replace(" ", "");
                if (newValue.indexOf(",") === -1) {
                var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                    if (color) {
                    color = color.replace(" ", "");
                    return color;
                    }
                    else return newValue;
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
