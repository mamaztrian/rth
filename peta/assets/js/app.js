var map, featureList, administrasiSearch = [], tamanSearch = [], hutanSearch = [],makamSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(administrasis.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});


$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through tamans layer and add only features which are in the map bounds */
  tamans.eachLayer(function (layer) {
    if (map.hasLayer(tamanLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icon1.png"></td><td class="feature-name">' + layer.feature.properties.TOPONIMI + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
	/* Loop through hutans layer and add only features which are in the map bounds */
  hutans.eachLayer(function (layer) {
    if (map.hasLayer(hutanLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icon7.png"></td><td class="feature-name">' + layer.feature.properties.TOPONIMI + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through makams layer and add only features which are in the map bounds */
  makams.eachLayer(function (layer) {
    if (map.hasLayer(makamLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icon8.png"></td><td class="feature-name">' + layer.feature.properties.TOPONIMI + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});


var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 25,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
maxZoom: 25,
subdomains:['mt0','mt1','mt2','mt3'],
attribution: 'Google Hybrid'
}); 



var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 15,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 19,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Aerial Imagery courtesy USGS"
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};


/*LAYER POLYGON ADMINISTRASI*/
var administrasisColors = {"Bojongsari":"#FFFF00", "Kaligondang":"#b3ffc6", "Padamara":"#DA70D6", "Purbalingga":"#FFDAB9", "Kalimanah":"#00e639"}; 
var administrasis = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: administrasisColors[feature.properties.KECAMATAN] ,
		fillOpacity: 0.2,	
	
      color: "black",
      fill: true,
      opacity: 1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
administrasis.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html("Kel. " + feature.properties.DESA);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.DESA,
      source: "administrasis",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/admin.geojson", function (data) {
  administrasis.addData(data);
});

/*LAYER POLYGON RTH JALAN*/

var jalans = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
jalans.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "jalans",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/jalan.geojson", function (data) {
  jalans.addData(data);
});

/*LAYER POLYGON RTH hutankota*/

var hutankotas = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
hutankotas.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "hutankotas",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/hutankota.geojson", function (data) {
  hutankotas.addData(data);
});

/*LAYER POLYGON RTH lapangan*/

var lapanganpolys = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
lapanganpolys.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "lapanganpolys",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/lapangan.geojson", function (data) {
  lapanganpolys.addData(data);
});

/*LAYER POLYGON RTH makam*/

var makampolys = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
makampolys.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "makampolys",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/makam.geojson", function (data) {
  makampolys.addData(data);
});


/*LAYER POLYGON RTH pekarangan*/

var pekarangans = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
pekarangans.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "pekarangans",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/pekarangan.geojson", function (data) {
  pekarangans.addData(data);
});

/*LAYER POLYGON RTH potensi*/

var potensis = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
potensis.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "potensis",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/potensi.geojson", function (data) {
  potensis.addData(data);
});

/*LAYER POLYGON RTH sempadan*/

var sempadans = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
sempadans.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "sempadans",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/sempadan.geojson", function (data) {
  sempadans.addData(data);
});

/*LAYER POLYGON RTH sungai*/

var sungais = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
sungais.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "sungais",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/sungai.geojson", function (data) {
  sungais.addData(data);
});

/*LAYER POLYGON RTH taman*/

var tamanpolys = L.geoJson(null, {
  style: function (feature) {
    return {
		fillColor: "#9ACD32" ,
		fillOpacity: 0.7,	
	
      color: "black",
      fill: true,
	  weight: 1,
      opacity: 0.1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	  
var content = "<table class='table table-striped table-bordered table-condensed'>" +
"<tr><th>RTH</th><td>" + feature.properties.RTHKP + "</td></tr>" +
"<tr><th>Kelurahan</th><td>" + feature.properties.DESA + "</td></tr>" +
"<tr><th>Kecamatan</th><td>" + feature.properties.KECAMATAN + " " + "</td></tr>" +
"</table>";  

layer.on({
mouseover: function (e) {  //KETIKA MOUSE MASUK KE LAYER ATAU POLYGON
var layer = e.target;
layer.setStyle({
weight: 2,
color: "#00FFFF",
opacity: 1,
fillColor: "yellow",
fillOpacity: 1
});

},

mouseout: function (e) {  //KETIKA MOUSE KELUAR KE LAYER ATAU POLYGON
tamanpolys.resetStyle(e.target);
map.closePopup();
},

click: function (e) {
$("#feature-title").html(feature.properties.RTHKP);
$("#feature-info").html(content);
$("#featureModal").modal("show");
        }
      });
	  	  
    administrasiSearch.push({
      name: layer.feature.properties.kosong,
      source: "tamanpolys",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/polygon/taman.geojson", function (data) {
  tamanpolys.addData(data);
});


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove tamans to markerClusters layer */
var tamanLayer = L.geoJson(null);
var tamans = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/icon1.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.RTH,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Jenis RTH</th><td>" + feature.properties.RTH + "<tr><th>Nama</th><td>" + feature.properties.TOPONIMI + "</td></tr>" + "<tr><th>Luas </th><td>" + feature.properties.LUAS + "</td></tr>" + "<tr><th>Keterangan</th><td>" + feature.properties.KETERANGAN + "</td></tr>" +  "<tr><th>Kelurahan </th><td>" + feature.properties.KELURAHAN + "<tr><th>Kecamatan </th><td>" + feature.properties.KECAMATAN + "<tr><th>Foto </th><td>" + "<img src='assets/img/foto/" + feature.properties.FOTO + "' width='200'>" + "</td></tr>" +"<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.TOPONIMI);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icon1.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      tamanSearch.push({
        name: layer.feature.properties.TOPONIMI,
        source: "tamans",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/taman.geojson", function (data) {
  tamans.addData(data);
  map.addLayer(tamanLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove hutans to markerClusters layer */
var hutanLayer = L.geoJson(null);
var hutans = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/icon7.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.RTH,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Jenis RTH</th><td>" + feature.properties.RTH + "<tr><th>Nama</th><td>" + feature.properties.TOPONIMI + "</td></tr>" + "<tr><th>Luas </th><td>" + feature.properties.LUAS + "</td></tr>" + "<tr><th>Keterangan</th><td>" + feature.properties.KETERANGAN + "</td></tr>" +  "<tr><th>Kelurahan </th><td>" + feature.properties.KELURAHAN + "<tr><th>Kecamatan </th><td>" + feature.properties.KECAMATAN + "<tr><th>Foto </th><td>" + "<img src='assets/img/foto/" + feature.properties.FOTO + "' width='200'>" + "</td></tr>" +"<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.TOPONIMI);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icon7.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      hutanSearch.push({
        name: layer.feature.properties.TOPONIMI,
        source: "hutans",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/hutan.geojson", function (data) {
  hutans.addData(data);
  map.addLayer(hutanLayer);
});


/* Empty layer placeholder to add to layer control for listening when to add/remove makams to markerClusters layer */
var makamLayer = L.geoJson(null);
var makams = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/icon8.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.TOPONIMI,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
	var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Jenis RTH</th><td>" + feature.properties.RTH + "<tr><th>Nama</th><td>" + feature.properties.TOPONIMI + "</td></tr>" + "<tr><th>Luas </th><td>" + feature.properties.LUAS + "</td></tr>" + "<tr><th>Keterangan</th><td>" + feature.properties.KETERANGAN + "</td></tr>" +  "<tr><th>Kelurahan </th><td>" + feature.properties.KELURAHAN + "<tr><th>Kecamatan </th><td>" + feature.properties.KECAMATAN + "<tr><th>Foto </th><td>" + "<img src='assets/img/foto/" + feature.properties.FOTO + "' width='200'>" + "</td></tr>" +"<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.TOPONIMI
		  );
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icon8.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      makamSearch.push({
        name: layer.feature.properties.TOPONIMI,
        source: "makams",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/makam.geojson", function (data) {
  makams.addData(data);
   map.addLayer(makamLayer);
});

map = L.map("map", {
  zoom: 13,
  center: [-7.396, 109.3690],
  layers: [cartoLight, administrasis, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === tamanLayer) {
    markerClusters.addLayer(tamans);
    syncSidebar();
  }
  if (e.layer === hutanLayer) {
    markerClusters.addLayer(hutans);
    syncSidebar();
  }
  if (e.layer === makamLayer) {
    markerClusters.addLayer(makams);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === tamanLayer) {
    markerClusters.removeLayer(tamans);
    syncSidebar();
  }
  if (e.layer === hutanLayer) {
    markerClusters.removeLayer(hutans);
    syncSidebar();
  }
  if (e.layer === makamLayer) {
    markerClusters.removeLayer(makams);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by DLH Kab. Purbalingga</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
	"Open Street Map": osm,	
	"Google Hybrid": hybrid,

 };

var groupedOverlays = {
  "Points of Interest": {
    "<img src='assets/img/icon1.png' width='24' height='28'>&nbsp;RTH Taman": tamanLayer,
	"<img src='assets/img/icon7.png' width='24' height='28'>&nbsp;RTH Hutan Kota": hutanLayer,
    "<img src='assets/img/icon8.png' width='24' height='28'>&nbsp;RTH Makam": makamLayer
  },
  "Reference": {
    "administrasi": administrasis,
	"RTH Hutan Kota": hutankotas,
	"RTH Taman": tamanpolys,
	"RTH Makam": makampolys,
	"RTH Lapangan": lapanganpolys,
	"RTH Rencana Potensi": potensis,
	"RTH Jalan": jalans,
	"RTH Sungai": sungais,
	"RTH Sempadan Sungai": sempadans,
	"RTH Pekarangan": pekarangans,

  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to administrasis bounds */


  var administrasisBH = new Bloodhound({
    name: "administrasis",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: administrasiSearch,
    limit: 10
  });

  var tamansBH = new Bloodhound({
    name: "tamans",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: tamanSearch,
    limit: 10
  });

  var hutansBH = new Bloodhound({
    name: "hutans",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: hutanSearch,
    limit: 10
  });
  
  
  var makamsBH = new Bloodhound({
    name: "makams",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: makamSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  administrasisBH.initialize();
  tamansBH.initialize();
  hutansBH.initialize();
  makamsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "administrasis",
    displayKey: "name",
    source: administrasisBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>administrasis</h4>"
    }
  }, {
    name: "tamans",
    displayKey: "name",
    source: tamansBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/icon1.png' width='24' height='28'>&nbsp;tamans</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
	}, {
    name: "hutans",
    displayKey: "name",
    source: hutansBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/icon7.png' width='24' height='28'>&nbsp;hutans</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "makams",
    displayKey: "name",
    source: makamsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/icon8.png' width='24' height='28'>&nbsp;makams</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "administrasis") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "tamans") {
      if (!map.hasLayer(tamanLayer)) {
        map.addLayer(tamanLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	if (datum.source === "hutans") {
      if (!map.hasLayer(hutanLayer)) {
        map.addLayer(hutanLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "makams") {
      if (!map.hasLayer(makamLayer)) {
        map.addLayer(makamLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
