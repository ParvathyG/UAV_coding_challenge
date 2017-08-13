(function() {
    'use strict';

    /**
     * Main Module
     */

    angular.module('uav', ['ngMaterial'])
        .controller('main', ['$scope', function($scope) {
            var data; // a global

            var infoContent = '',
                result, i = 0,
                initMarkerTimer;

            var colorScale = d3.scale.linear()
                .range(['#ce0404', '#f1f10a', '#009200']);


            $scope.d = { highlight: 'altitude', markers: [] };
            $scope.d.altitude = {
                unit: 'm'
            };
            $scope.d.speed = {
                unit: 'km/hr'
            };

            d3.json("/asteria_data.json", function(error, json) {
                if (error) return console.warn(error);
                data = json;

                $scope.d.altitude.range = d3.extent(data, function(d) {
                    return +d.altitude;
                });
                $scope.d.speed.range = d3.extent(data, function(d) {
                    return +d.speed;
                });
                colorScale.domain([$scope.d[$scope.d.highlight].range[0], ($scope.d[$scope.d.highlight].range[0] + $scope.d[$scope.d.highlight].range[1]) / 2, $scope.d[$scope.d.highlight].range[1]]);

                // Start initialising markers after the Google map initialisation
                var checkMapObject = setInterval(function() {
                    try {
                        result = Object.keys(map).length;
                        $scope.init();
                    } catch (e) {}
                    if (result) {
                        clearInterval(checkMapObject);
                    }
                }, 500);
            });




            // Returns the InfoWindow dynamic content
            $scope.getInfoContent = function(data) {
                infoContent = '<table>' +
                    '<tr>' +
                    '<td>Latitude</td>' +
                    '<td>:</td>' +
                    '<td>' + data.latitude + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Longitude</td>' +
                    '<td>:</td>' +
                    '<td>' + data.longitude + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Altitude</td>' +
                    '<td>:</td>' +
                    '<td>' + data.altitude + ' m</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Speed</td>' +
                    '<td>:</td>' +
                    '<td>' + data.speed + ' km/hr</td>' +
                    '</tr>' +
                    '</table>';
                return infoContent;
            };


            // Initialise the markers and update polyline
            $scope.init = function() {
                initMarkerTimer = setInterval(function() {
                    var item, marker, path;

                    try {
                        item = Object.keys(data[i]).length;

                        path = polyLine.getPath();
                        path.push(new google.maps.LatLng(+data[i].latitude, +data[i].longitude));

                        marker = new google.maps.Marker({
                            position: { lat: +data[i].latitude, lng: +data[i].longitude },
                            map: map,
                            data: data[i],
                            title: $scope.d.highlight + ' : ' + data[i][$scope.d.highlight] + ' ' + $scope.d[$scope.d.highlight].unit,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 3,
                                fillColor: colorScale(data[i][$scope.d.highlight]),
                                fillOpacity: 0.5,
                                strokeColor: colorScale(data[i][$scope.d.highlight]),
                                strokeWeight: 2,
                                strokeOpacity: 0.5
                            }
                        });

                        marker.addListener('click', function(event) {
                            infoWindow.setContent($scope.getInfoContent(this.data));
                            infoWindow.open(map, this);

                        });

                        $scope.d.markers.push(marker);

                        document.getElementById('lastSyncTime').innerHTML = 'Last updated on ' + displayTime();

                        i = i + 1;
                    } catch (e) {

                    }
                    if (!item) {
                        clearInterval(initMarkerTimer);
                    }

                }, 500);

            };


            // Update marker color based on highlight selection
            $scope.changeHighlight = function() {
                clearInterval(initMarkerTimer);

                colorScale.domain([$scope.d[$scope.d.highlight].range[0], ($scope.d[$scope.d.highlight].range[0] + $scope.d[$scope.d.highlight].range[1]) / 2, $scope.d[$scope.d.highlight].range[1]]);

                $scope.d.markers.forEach(function(point, idx) {
                    point.setIcon({
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 3,
                        fillColor: colorScale(data[idx][$scope.d.highlight]),
                        fillOpacity: 0.5,
                        strokeColor: colorScale(data[idx][$scope.d.highlight]),
                        strokeWeight: 2,
                        strokeOpacity: 0.5
                    });
                    point.setTitle($scope.d.highlight + ' : ' + data[idx][$scope.d.highlight] + ' ' + $scope.d[$scope.d.highlight].unit);
                });

                $scope.init();
            };
        }]);

}());