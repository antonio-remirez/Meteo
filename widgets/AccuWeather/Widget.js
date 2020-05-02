define(['dojo/_base/declare', 'jimu/BaseWidget', 'dojo/_base/lang', 'dojo/dom', 'dojo/dom-construct', 'dojo/dom-attr', 'esri/geometry/webMercatorUtils', 'esri/request', 'esri/symbols/PictureMarkerSymbol', 'esri/graphic'], function (declare, BaseWidget, lang, dom, domConstruct, domAttr, webMercatorUtils, esriRequest, PictureMarkerSymbol, Graphic) {
  return declare([BaseWidget], {

    baseClass: 'accu-weather',
    postCreate: function postCreate() {},
    startup: function startup() {
      var pointGraphicsLayers = this.map.graphicsLayerIds.map(lang.hitch(this, function (graphicsLayerId) {
        var graphicsLayer = this.map.getLayer(graphicsLayerId);
        if (graphicsLayer.geometryType && graphicsLayer.geometryType === 'esriGeometryPoint') {

          var parentDiv = domConstruct.create("div");
          domAttr.set(parentDiv, "id", "parent_" + graphicsLayerId);

          var divNode = domConstruct.create("div");
          domAttr.set(divNode, "class", "botonFiltro");
          domAttr.set(divNode, "id", graphicsLayerId);
          domAttr.set(divNode, "innerHTML", graphicsLayer.arcgisProps.title);
          var _map = this.map;
          var _api_key = this.config.api_key;

          divNode.addEventListener("click", function () {

            var getWeatherIconForGraphic = function getWeatherIconForGraphic(graphic) {

              var lngLat = webMercatorUtils.xyToLngLat(graphic.geometry.x, graphic.geometry.y);
              console.log(lngLat);

              var locationKeyRequest = esriRequest({
                url: "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
                content: { "apikey": _api_key, "q": lngLat[0] + ',' + lngLat[1] },
                handleAs: "json"
              });

              var _gr = graphic;

              locationKeyRequest.then(function (response) {
                var locationKey = response.Key;

                var currentConditionsRequest = esriRequest({
                  url: "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey,
                  content: { "apikey": _api_key },
                  handleAs: "json"
                });

                currentConditionsRequest.then(function (responseConditions) {
                  var formattedIconNumber = ("0" + responseConditions[0].WeatherIcon).slice(-2);
                  var imgUrl = "https://developer.accuweather.com/sites/default/files/" + formattedIconNumber + "-s.png";
                  var imgSymbol = new PictureMarkerSymbol(imgUrl, 75, 45);
                  var graphic = new Graphic(_gr.geometry, imgSymbol);
                  _map.graphics.add(graphic);
                });
              }, function (error) {
                console.log("Error: ", error.message);
              });
            };

            var layer = _map.getLayer(this.id);
            var graphics = layer._graphicsVal.map(function (graphic) {
              return graphic;
            });

            var j = graphics.length;
            if (graphics.length > 4) {
              j = 4;
            }
            for (var i = 0; i < j; i++) {
              getWeatherIconForGraphic(graphics[i]);
            }

            // layer._graphicsVal.map(function(graphic){
            //   getWeatherIconForGraphic(graphic);
            // });
          });

          domConstruct.place(parentDiv, dom.byId("bloqueFiltros"));
          domConstruct.place(divNode, parentDiv);
        }
      }));
    },
    _onClick: function _onClick() {
      console.log("click");
      // var query = termometricasLayer.createQuery();
      // 		var results = termometricasLayer.queryFeatures(query).then(function(response) {
      // 			var geometries = response.features.map(function(feature) {
      // 			  return feature.geometry;
      // 			});

      // 			var lngLat = webMercatorUtils.xyToLngLat(geometries[0].x, geometries[0].y);

      // 		});
    },
    _onClickRestaurar: function _onClickRestaurar() {
      console.log("click");
    }
  }

  // onOpen() {
  //   console.log('AccuWeather::onOpen');
  // },
  // onClose(){
  //   console.log('AccuWeather::onClose');
  // },
  // onMinimize(){
  //   console.log('AccuWeather::onMinimize');
  // },
  // onMaximize(){
  //   console.log('AccuWeather::onMaximize');
  // },
  // onSignIn(credential){
  //   console.log('AccuWeather::onSignIn', credential);
  // },
  // onSignOut(){
  //   console.log('AccuWeather::onSignOut');
  // }
  // onPositionChange(){
  //   console.log('AccuWeather::onPositionChange');
  // },
  // resize(){
  //   console.log('AccuWeather::resize');
  // }
  );
});
//# sourceMappingURL=Widget.js.map
