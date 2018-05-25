var map;
var markers = [];

/** Neighborhood lat/long to centralize map and search locations based in this location. */
let neighborhoodLat = -23.570664;
let neighborhoodLng = -46.644500;

let infowindow;

/** Initialize the map based on initial lat/lng, create markers and filter. */
window.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: neighborhoodLat, lng: neighborhoodLng },
        zoom: 13,
    });

    infowindow = new google.maps.InfoWindow({});

    searchMarkers('Shopping');
}

/** Make a request to Foursquare and search locations near the neighborhood, based on the query passed as parameter. */
function searchMarkers(query) {
    $.ajax({
        url: `https://api.foursquare.com/v2/venues/search?ll=${neighborhoodLat},${neighborhoodLng}&client_id=QMKGZH03TVTVEKQ0E1YFX43GU3TUBD1IGJJV1JL5RK33U4HV&client_secret=3Y1AGL4W34OLCKD2LCHM2NK51XSUMIKNH55BTP1F1X5K0B32&query=${query}&limit=10&v=20180521`,
        type: 'GET'
    }).done(function (data) {
        data.response.venues.forEach(createMarker);

        createMarkerFilterModel();
    }).fail(function (xhr, status, errorThrown) {
        alert(`Fail to retrieve information on Foursquare to create markers. Error: ${errorThrown}`);
    });
}

/** Create a marker using the venue found on Foursquare's request. */
function createMarker(venue) {
    var marker = new google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: map,
        animation: google.maps.Animation.DROP,
        title: venue.name,
        formattedAddress: venue.location.formattedAddress
    });

    marker.addListener('click', function () {
        showInfoWindow(marker);
    });
    markers.push(marker);
}

/** Show info window when marker or list item has clicked. */
function showInfoWindow(marker) {
    markers.forEach(marker => {
        marker.setAnimation(null);
    });

    infowindow.setContent(createContentInfoWindow(marker));
    infowindow.open(map, marker);

    infowindow.addListener('closeclick', function () {
        marker.setAnimation(null);
    })
    marker.setAnimation(google.maps.Animation.BOUNCE);
}

/** Create content of info window with venue's name and address. In addition, add an image based on its lat/lng, using street view API. */
function createContentInfoWindow(marker) {
    let infoWindowContent = '<div class="card" style="width: 18rem;">';
    infoWindowContent += `<img class="card-img-top" src="https://maps.googleapis.com/maps/api/streetview?size=150x150&location=${marker.internalPosition.lat()},${marker.internalPosition.lng()}&key=AIzaSyAQxelamEHII2I9tYxyCRB__teIQojuTWM" alt="Shopping Google Street View">`;
    infoWindowContent += '<div class="card-body">';
    infoWindowContent += `<h5 class="card-title">${marker.title}</h5>`;
    marker.formattedAddress.forEach(address => {
        infoWindowContent += `<p class="card-text">${address}</p>`;
    });
    infoWindowContent += '</div></div>';
    return infoWindowContent;
}

/** Clear all markers on the map when user change the filter marker. */
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    })
}

/** Model to filter markers using Knockout. */
var MarkerFilterModel = function () {
    this.markerFilter = ko.observable();
    this.markers = ko.observableArray();
};

/** Show info window when click an item on the list. */
function openMarker() {
    showInfoWindow(this);
}

/** Create filter model and add behavior to clear markers and make a new search.*/
function createMarkerFilterModel() {
    let filterModel = new MarkerFilterModel();
    filterModel.markers = ko.observable(this.markers);

    filterModel.filteredMarkers = ko.computed(function () {
        infowindow.close();
        if (!filterModel.markerFilter()) {
            return resetMarkers(filterModel);
        } else {
            return filterMarkers(filterModel);
        }
    }, filterModel)

    ko.applyBindings(filterModel);
}

/** Reset markers in case a search with an empty string happens. */
function resetMarkers(filterModel) {
    filterModel.markers().forEach(marker => {
        if (!marker.getMap()) {
            marker.setMap(map);
        }
        marker.setAnimation(google.maps.Animation.DROP);
    })
    return filterModel.markers();
}

/** Filter marker by input. */
function filterMarkers(filterModel) {
    var filter = filterModel.markerFilter().toLowerCase();
    return ko.utils.arrayFilter(filterModel.markers(), function (marker) {
        if (marker.title.toLowerCase().indexOf(filter) > -1) {
            marker.setMap(this.map);
            marker.setAnimation(google.maps.Animation.DROP);
            return true;
        } else {
            marker.setMap(null);
            return false;
        }
    })
}

/** Give feedback to user if a problem in Google request happens. */
function googleError() {
    alert('Fail to retrieve information on Google to create map.');
}