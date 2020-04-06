import React from 'react';
import 'mapbox-gl';
import ReactMapboxGl, { Layer, Feature, ZoomControl,ScaleControl ,RotationControl,MapContext,Source     } from 'react-mapbox-gl';
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
        
        // state.eqMap.on('load', function() {
        //     // map.addSource('wms-test-source', {
        //     // 'type': 'raster',
        //     // 'tiles': [
        //     // 'http://map.eqfleetcmder.com/eq-map/wms?'+
        //     // 'bbox={bbox-epsg-3857}'+
        //     // '&format=image/png'+
        //     // '&service=WMS'+
        //     // '&version=1.1.1'+
        //     // '&request=GetMap'+
        //     // '&srs=EPSG:3857'+
        //     // '&transparent=true'+ 
        //     // '&zIndex=99999'+
        //     // '&layers=eq-map:eqmap'
        //     // ],
        //     // 'tileSize': 256
        //     // });
        //     state.eqMap.addLayer(
        //     {
        //     'id': 'wms-test-layer',
        //     'type': 'raster',
        //     'source': {
        //     'type': 'raster',
        //     'tiles': [
        //     'http://map.eqfleetcmder.com/eq-map/wms?'+
        //     'bbox={bbox-epsg-3857}'+
        //     '&format=image/png'+
        //     '&service=WMS'+
        //     '&request=GetMap'+
        //     '&srs=EPSG:3857'+
        //     '&maxZoom=22'+
        //     '&maxZoom=1'+
        //     '&transparent=true'+ 
        //     '&exceptions=application/vnd.ogc.se_inimage'+
        //     '&zIndex=99999'+
        //     '&layers="eq-map:eqmap"'
        //     ],
        //     'tileSize': 256
        //     },
        //     'paint': {}
        //     },
        //     'aeroway-line'
        //     );
        //     })
        // map.on('load', function() {  
        //   map.addLayer(
        //   {
        //     'id': 'wms_layer',// 图层ID
        //     'type': 'raster',// 图层类型
        //     'source': {
        //     'type': 'raster',// 数据源类型，因为wms返回图片数据，因此为该类型
        //    'tiles': [
        //    'http://map.eqfleetcmder.com/eq-map/wms?'// wms地图服务地址
        //     + 'version=1.3.0'// wms的版本，必须是这个值
        //    + '&request=getmap'// 调用的方法名称，获取地图必须是这个方法
        //      + '&BGCOLOR=ff00ff'// 生成的图片背景颜色
        //      // layers 使用ArcGIS进行发布的时候默认图层名称为0，1，2的索引值，在发布地图服务的时候可以勾选
        //     // “使用地图文档中的图层名称”，在访问的时候图层名称就是地图上图层名称，不然就是0，1，2，3的索引值
        //      + '&layers=eq-map:eqmap'// 要显示的图层名称，多个图层用,隔开；
        //      + '&styles='// 图层显示样式，同样多个样式名称间用，隔开；
        //       + '&crs=EPSG:3857'
        //     + '&bbox={bbox-epsg-3857}'// 使用map加载的wms的时候，使用这个标识来同步要获取地图的范围的坐标，必须为这个值
        //      + '&width=256'// 返回的图片的大小
        //      + '&height=256'// 返回的图片的大小
        //      + '&format=image/png'// 返回的图片格式
        //     + '&TRANSPARENT=TRUE'// 设置背景是不是可以透明，没有数据的地方就进行透明 
        //      ],
        //     'tileSize': 256 // 图片显示的大小，最好和上面大小保持一致
        //      },
        //     'paint': {
        //      "raster-opacity": 1,// 图层显示透明度
        //     // raster-hue-rotate 设置该值以后，显示的颜色就不会是图层样式里面设置的颜色，所以最好不要设置
        //      // "raster-hue-rotate": 60,//在色轮上旋转色相的角度
        //     } 
        //   }
        //   );
        //   })
      }}
    </MapContext.Consumer>
        <ScaleControl/>
        <ZoomControl
        position="top-right"
        />
        <RotationControl/>
         <DrawControl  
         />
         
        <Source id="source_id" tileJsonSource={RASTER_SOURCE} />
        <Layer type="raster" id="layerId"   sourceId="source_id">
          <Feature coordinates={[39.883722493,110.257771304]} />
        </Layer>
      </Map>
    </div>
  );
};
