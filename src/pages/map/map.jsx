import React from 'react';
import 'mapbox-gl';
import ReactMapboxGl, { Layer, Feature, ScaleControl ,MapContext,Source     } from 'react-mapbox-gl';
import{ RulerControl,StylesControl,CompassControl,  ZoomControl, InspectControl, AroundControl,TooltipControl } from 'mapbox-gl-controls';
import DrawControl from 'react-mapbox-gl-draw'; 
// import Script from 'react-load-script';
import styles from './map.less';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZ3VhbmdlNjYiLCJhIjoiY2s4bjA3N3NrMHA5YzNnbWkyaHpldWxyZCJ9.BGpot2POjUgsB_stwP1MeQ',
});
const state={
  eqMap:null
}
const RASTER_SOURCE_OPTIONS = {
  "type": "raster",
  "tiles": [
    "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali",
  ],
  "tileSize": 256
};
const RASTER_SOURCE = {
  "type": "raster",
  "tiles": [
    'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
    ],
  "tileSize": 256
};
const WMS_SOURCE={
            'id': 'wms-test-layer',
            'type': 'raster',  
            'tiles': [
            'http://map.eqfleetcmder.com/eq-map/wms?'+
            'bbox={bbox-epsg-3857}'+
            '&version=1.3.0'+
            '&format=image/png'+
            '&service=WMS'+
            '&request=GetMap'+
            '&srs=EPSG:3857'+
            '&maxZoom=22'+
            '&maxZoom=1'+
            '&transparent=true'+ 
            '&exceptions=application/vnd.ogc.se_inimage'+
            '&zIndex=99999'+
            '&layers="eq-map:eqmap"'
            ],
            'tileSize': 256
            } 
 
export default () => {
  return (
    <div>
      {/* <Script url="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.js"  /> */}
      <Map
        style="mapbox://styles/mapbox/streets-v11"
        className={styles.map}
        containerStyle={{
          height: '60vh',
          width: '100%',
        }} 
      >
        <MapContext.Consumer>
      {(map) => {
        // use `map` here
        state.eqMap=map
        state.eqMap.setCenter([-74.5447, 40.6892])
        state.eqMap.zoomTo(10)
        map.addControl(new StylesControl(), 'top-right');
        map.addControl(new RulerControl({
          units: 'miles',
          labelFormat: n => `${n.toFixed(2)*1000} 米`,
        }), 'top-left');
        map.addControl(new CompassControl(), 'top-left')
        // map.addControl(new InspectControl(), 'top-left'); 
        map.addControl(new ZoomControl(), 'top-left');
        map.addControl(new AroundControl(), 'top-left');
        map.addControl(new TooltipControl(), 'top-left');
        
      }}
    </MapContext.Consumer>
        <ScaleControl/>
          
         <DrawControl position="top-right"/>
         
        <Source id="source_id" tileJsonSource={RASTER_SOURCE} />
        <Layer type="raster" id="layerId"   sourceId="source_id">
          <Feature coordinates={[39.883722493,110.257771304]} />
        </Layer>
      </Map>
    </div>
  );
};
