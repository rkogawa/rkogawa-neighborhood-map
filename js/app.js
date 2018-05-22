var map;
var markers = [];

/** Neighborhood lat/long to centralize map and search locations based in this location. */
let neighborhoodLat = -23.570664;
let neighborhoodLng = -46.644500;

/** Initialize the map based on initial lat/lng, create markers and filter. */
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: neighborhoodLat, lng: neighborhoodLng },
        zoom: 18,
    });

    searchMarkers('Japan House São Paulo');

    createMarkerFilterModel();
}

/** Make a request to Foursquare and search locations near the neighborhood, based on the query passed as parameter. */
function searchMarkers(query) {

    $.ajax({
        url: `https://api.foursquare.com/v2/venues/search?ll=${neighborhoodLat},${neighborhoodLng}&client_id=QMKGZH03TVTVEKQ0E1YFX43GU3TUBD1IGJJV1JL5RK33U4HV&client_secret=3Y1AGL4W34OLCKD2LCHM2NK51XSUMIKNH55BTP1F1X5K0B32&query=${query}&v=20180521`,
        type: 'GET',
        success: function (data) {
            data.response.venues.forEach(venue => {
                createMarker(venue);
            });
        },
        error: function (data) {
            alert('Fail to retrieve information on Foursquare to create markers.');
        }
    });
}

/** Create a marker using the venue found on Foursquare's request. */
function createMarker(venue) {
    var marker = new google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: map,
        animation: google.maps.Animation.DROP,
        title: venue.name
    });

    let infowindow = createInfoWindow(venue, marker);
    marker.addListener('click', function () {
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
    markers.push(marker);
}

/** Create an info window with venue's name and address. In addition, add an image based on its lat/lng, using street view API. */
function createInfoWindow(venue, marker) {
    let infoWindowContent = `<h3>${venue.name}</h3>`;
    infoWindowContent += `<h4><i class="fas fa-map-marker"></i> Location:</h4>`;
    venue.location.formattedAddress.forEach(address => {
        infoWindowContent += `<p>${address}</p>`
    })
    infoWindowContent += `<p><i class="fab fa-foursquare"> Information provided by Foursquare.</i></p>`;
    infoWindowContent += `<img class="info-window-image" src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${venue.location.lat},${venue.location.lng}&key=AIzaSyAQxelamEHII2I9tYxyCRB__teIQojuTWM" >`;
    var infowindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    infowindow.addListener('closeclick', function () {
        marker.setAnimation(null);
    })
    return infowindow;
}

/** Clear all markers on the map when user change the filter marker. */
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

/** Model to filter markers using Knockout. */
var MarkerFilterModel = function (markerFilter) {
    this.markerFilter = ko.observable(markerFilter);
};

/** Create filter model and add behavior to clear markers and make a new search.*/
function createMarkerFilterModel() {
    let filterModel = new MarkerFilterModel();
    filterModel.markerFilter.subscribe(function (newFilter) {
        clearMarkers();

        searchMarkers(newFilter);
    });
    ko.applyBindings(filterModel);
}
