
mapboxgl.accessToken = 'pk.eyJ1Ijoiam02MjQ0NjE4MDYiLCJhIjoiY2tzdGY2dGtyMHBocDJvcGoycWs2cGVmZyJ9._glECKhtshHvL1IcOhHjxw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campgrounds.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgrounds.title}</h3><p>${campgrounds.location}</p>`
            )
    )
    .addTo(map)

