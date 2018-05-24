# Japan House - Neighborhood Map

To get started, open `index.html` in your preferred browser.

# Functionalities

This application shows the 10 nearest shopping of a nice place in Sao Paulo - Brazil called Japan House (https://www.japanhouse.jp/saopaulo/).

The app shows a map and center in Japan House using Google Maps API (https://developers.google.com/maps/). 

The header of the app there's a menu created with Bootstrap (https://getbootstrap.com/). In the dropdown Shopping there's a list with the shoppings, based on the filter in the top right. Search locations is using Foursquare API (https://developer.foursquare.com/places-api) and in case this search fails for any reason, an alert will warn the user that a problem occurs.

When a marker or an item in dropdown is clicked, the icon starts to bounce and an info window opens with more information about the place. The content is the name of the venue followed by the address of this location. In the header there's an image of the place using Google Street View API (https://developers.google.com/maps/documentation/streetview/). The icons used in the info window are provided by Fontawesome (https://fontawesome.com/).