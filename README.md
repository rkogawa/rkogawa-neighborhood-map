# Japan House - Neighborhood Map

To get started, open `index.html` in your preferred browser.

# Functionalities

This application shows the neighborhood locations of a nice place in Sao Paulo - Brazil called Japan House (https://www.japanhouse.jp/saopaulo/).

The app shows a map and center in Japan House using Google Maps API (https://developers.google.com/maps/). 

In the top right of the app there's an input text to filter markers in map. The initial location is Japan House to show only this place, but you can try to find anything. Search locations is using Foursquare API (https://developer.foursquare.com/places-api) and in case this search fails for any reason, an alert will warn the user that a problem occurs.

When a marker is clicked, the icon starts to bounce and an info window opens with more information about the place. The first line is the name of the venue followed by the address of this location. In the bottom there's an image of the place using Google Street View API (https://developers.google.com/maps/documentation/streetview/). The icons used in the info window are provided by Fontawesome (https://fontawesome.com/).