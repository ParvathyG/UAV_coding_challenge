var map, polyLine, infoWindow;

function initMap() {
    // Initialise Map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 12.89223, lng: 74.85578 },
        zoom: 15
    });
    //Initialise Polyline
    polyLine = new google.maps.Polyline({
        strokeColor: 'gray',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    polyLine.setMap(map);

    // Initialise info window
    infoWindow = new google.maps.InfoWindow({});
}

// Returns formatted Time
function displayTime() {
    var format = d3.time.format('%e %b %I:%M:%S %p');
    return format(new Date());
}