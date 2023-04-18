import { GoogleMap } from "vue3-google-map";

export default GoogleMap({
  name: "directionsRenderer",

  ctr() {
    return window.google.maps.DirectionsRenderer;
  },

  events: [],

  mappedProps: {},

  props: {
    origin: { type: [Object, Array] },
    destination: { type: [Object, Array] },
    travelMode: { type: String },
    optimizeWaypoints: {type: Boolean}
  },

  afterCreate(directionsRenderer) {
    let directionsService = new window.google.maps.DirectionsService();

    this.$watch(
      () => [this.origin, this.destination, this.travelMode, this.waypoints, this.optimizeWaypoints],
      () => {
        let { origin, destination, travelMode, waypoints, optimizeWaypoints } = this;
        if (!origin || !destination || !travelMode || !waypoints) return;
        directionsService.route(
          {
            origin,
            destination,
            travelMode,
            waypoints,
            optimizeWaypoints,
          },
          (response, status) => {
            if (status !== "OK") return;
            directionsRenderer.setDirections(response);
          }
        );
      }
    );
  },
});