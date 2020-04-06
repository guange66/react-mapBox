/** EQAPP-v1.0.0 MIT License By http://www.eq.com Author guanzongyi */
; "use strict";
APP.utilFuns.LMAP = function (e) {
    var t = {
        center: [116.29376, 39.95776],
        level: 4
    }
        , u = (new APP.Util.utilFuns,
            layui.element);
    return {
        map: null,
        layer: null,
        layers: new Array,
        layerGroup: null,
        animateIndex: [],
        pushRun: !1,
        isRuning: !1,
        speed: 1,
        aimateTime: null,
        maxLength: 0,
        RepeatGet: !1,
        pointMarkerObj: {},
        markerObj: {},
        markerLblObj: {},
        markerLockObj: {},
        markerTipObj: {},
        currentTipId: "",
        polyLineObj: {},
        rectObj: {},
        polygonObj: {},
        circleObj: {},
        ellipseObj: {},
        animateMarker: {},
        animateFns: {},
        animateStartTime: null,
        animatePushTime: null,
        lastAimateTime: null,
        markerIdCache: [],
        polylineIdCache: [],
        rectIdCache: [],
        polygonIdCache: [],
        circleIdCache: [],
        ellipseIdCache: [],
        startUTC: "",
        endUTC: "",
        IntervalTime: 300,
        quertTimeUTC: "",
        pathList: {},
        init: function (e) {
            (!(e = $.extend({}, t, e || {})).container || e.container.length < 1) && console.log("未定义地图容器");
            this.map = new L.map(e.container, {
                crs: e.crs ? e.crs : L.CRS.EPSG4326,
                trackResize: !e.trackResize || e.trackResize,
                minZoom: 4,
                maxZoom: 21,
                doubleClickZoom: !1,
                wheelDebounceTime: 100,
                attributionControl: !1
            }).setView(e.center, e.initZoom);
            new L.EX.Toolbar(this.map, {
                aoTools: [{
                    tool: "测距",
                    name: "range"
                }, {
                    tool: "清除",
                    name: "reset"
                }]
            });
            return new L.TileLayer.WMTS(APP.config.streetscapeServer, APP.config.streetscapeServerParam).addTo(this.map),
                e.scale && this.showScale(),
                e.baseLayers && this.baseLayers(),
                this.map.on("click", function (e) { }),
                this.map
        },
        customTranslationToolbar: function (e) {
            e.pm.setLang("customName", {
                tooltips: {
                    placeMarker: "单击以放置标记",
                    firstVertex: "单击以放置第一个顶点",
                    continueLine: "单击以继续绘图",
                    finishLine: "单击任何现有标记完成",
                    finishPoly: "单击第一个标记完成",
                    finishRect: "单击以完成",
                    startCircle: "单击以放置圆心",
                    finishCircle: "单击以完成圆"
                },
                actions: {
                    finish: "完成",
                    cancel: "取消",
                    removeLastVertex: "删除最后一个顶点"
                },
                buttonTitles: {
                    drawMarkerButton: "标记",
                    drawPolyButton: "多边形",
                    drawLineButton: "线",
                    drawCircleButton: "圆",
                    drawRectButton: "矩形",
                    editButton: "编辑",
                    dragButton: "拖动",
                    cutButton: "裁剪",
                    deleteButton: "删除"
                }
            }, "en")
        },
        mapAnimateResize: function () {
            var e = this;
            !e.pushRun && e.isRuning && (e.map.on("zoomstart", function () {
                L.Util.throttle(e.stopAnimat(), 1e3)
            }),
                e.map.on("zoomend", function () {
                    L.Util.throttle(e.continueRun(e.pathList), 1e3)
                }))
        },
        wmtsServerMap: function (e) {
            for (var t = [], a = 0; a < 22; ++a)
                t[a] = {
                    identifier: "" + a,
                    topLeftCorner: new L.LatLng(90, -180)
                };
            var n = new L.TileLayer.WMTS(e.url, {
                layer: e.layer,
                style: e.style,
                tilematrixSet: e.tilematrixSet,
                format: e.format,
                maxZoom: e.maxZoom,
                minZoom: e.minZoom,
                zIndex: e.zIndex,
                matrixIds: t
            });
            this.map.addLayer(n)
        },
        baseLayers: function (e) {
            var t = {
                OSM: L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map),
                "Google影像": L.layerGroup([L.tileLayer("http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali"), L.tileLayer("http://mt1.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil")])
            };
            new L.control.layers(t, {}, {
                position: "topright"
            }).addTo(this.map)
        },
        showScale: function (e) {
            new L.control.scale({
                position: "bottomleft",
                metric: !0,
                imperial: !1
            }).addTo(this.map)
        },
        miniMap: function (e) {
            var t = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                minZoom: 2,
                maxZoom: 13,
                attribution: "易控智驾"
            });
            new L.Control.MiniMap(t, {
                toggleDisplay: !0
            }).addTo(this.map)
        },
        addpolyLine: function (e) {
            this.polyLineObj || (this.polyLineObj = {});
            var t = {
                latlngs: e.latlngs,
                color: "red"
            };
            e = $.extend({}, t, e || {});
            var a = L.polyline(t.latlngs, {
                color: t.color,
                weight: 1
            }).addTo(this.map);
            this.map.fitBounds(a.getBounds());
            new L.imageOverlay("http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg", [[38.93791540887673, 116.94733315724136], [38.99791540887673, 116.84733315724137]]).addTo(this.map)
        },
        addMarker: function (e) {
            this.markerObj || (this.markerObj = {}),
                this.markerLblObj || (this.markerLblObj = {});
            var t = {
                location: e.location,
                iconUrl: "../../img/map/icon-m.png",
                iconW: 20,
                iconH: 20,
                anchor: [10, 10],
                labelAnchor: [0, 0],
                labelFontSize: 10,
                labelBgColor: "#545454",
                labelFontColor: "#FFFFFF",
                isDefaultTip: !0,
                isOpen: !1,
                isEdit: !1,
                isMultipleTip: !1,
                eventType: "click",
                vin: e.vin ? e.vin : "车辆id"
            }
                , a = null;
            (e = $.extend({}, t || {}, e || {})).iconW,
                e.iconH,
                e.iconUrl,
                L.divIcon({
                    className: "icon-my"
                });
            return this.markerIdCache[t.vin] ? this.markerIdCache[t.vin] : (a = new L.marker(t.location).addTo(this.map),
                this.markerIdCache.push(a),
                a.bindTooltip(t.vin.toString()),
                this.markerIdCache[t.vin] = a,
                t.zIndex && a.zIndexOffset(t.zIndex),
                this.markerObj = L.layerGroup(this.markerIdCache),
                this.addOverLay(this.markerObj),
                a)
        },
        setLocation: function (e) {
            var t = L.latLng(e.location);
            this.markerIdCache[e.vin].setLatLng(t)
        },
        addOverLay: function (e) {
            this.map.addLayer(e)
        },
        removeOverLay: function (e) {
            [e].clearLayers()
        },
        removeMarker: function (e) {
            if (!this.markerIdCache || !this.markerIdCache[e])
                return !1;
            this.markerIdCache[e].remove(),
                delete this.markerIdCache[e]
        },
        removeAllAnimateMarkers: function () {
            $.each(this.animateMarker, function (e, t) {
                t.remove()
            }),
                $.each(this.animateFns, function (e, t) {
                    t.stop()
                }),
                u.progress("playProgress", "0%"),
                this.pushRun = !1
        },
        removeAllMarkers: function () {
            this.markerObj.clearLayers()
        },
        addLayerMarker: function (e) {
            this.map.addLayer(e)
        },
        addMarkers: function (e) {
            var t = $.extend({
                icon: {},
                markAnchor: [.5, .96],
                markImage: "../../img/map/marker-icon.png"
            }, e);
            this.layer = new L.marker(t.location).addTo(this.map),
                this.layers.push(this.layer),
                this.layerGroup = L.layerGroup(this.layers),
                this.map.addLayer(this.layerGroup)
        },
        clearAll: function () {
            this.markerObj.clearLayers()
        },
        clickEvent: function () {
            this.map.on("click", function () {
                alert(123)
            })
        },
        chageSpeed: function (e) {
            this.speed = e
        },
        stopAnimat: function () {
            var a = this;
            this.pushRun = !0,
                a.isRuning = !1,
                a.animatePushTime = Date.now(),
                a.lastAimateTime = (a.animatePushTime - a.animateStartTime) / 1e3,
                $.each(a.animateFns, function (e, t) {
                    a.animateFns[e].stop()
                })
        },
        continueRun: function (e) {
            var n = this;
            n.pushRun = !1,
                $.each(e, function (e, t) {
                    var a;
                    a = n.animateMarker[t.vin],
                        n.animate(a, n.animateIndex[t.id], t.pathLine, t.id, n.lastAimateTime, t.markInfos)
                })
        },
        startRun: function (e, t) {
            console.log(e);
            var n, i = this, r = t || i.map;
            i.maxLength = e[0].pathLine.length,
                i.startUTC = e[0].start,
                i.quertTimeUTC = e[0].start,
                i.endUTC = e[0].end,
                i.RepeatGet = !1,
                i.pathList = e,
                i.animateMarker = {},
                i.animateIndex = [],
                i.animateFns = {},
                i.isRuning = !0;
            for (var a = 1; a < e.length; a++)
                i.maxLength < e[a].pathLine.length && (i.maxLength = e[a].pathLine.length);
            $.each(e, function (e, t) {
                var a;
                i.animateMarker[t.vin] ? a = i.animateMarker[t.vin] : (n = L.divIcon({
                    html: '<div class="rotateBox"><span class="iconfont icon-map-track rotate  f40"></span><i>' + t.vin + "</i></div>",
                    iconSize: [36, 36],
                    shadowSize: [0, 0]
                }),
                    a = new L.marker(t.pathLine[0], {
                        icon: n
                    }).addTo(r),
                    i.animateMarker[t.vin] = a,
                    r.fitBounds(t.pathLine)),
                    i.animate(a, 0, t.pathLine, t.id, null, t.markInfos)
            })
        },
        animate: function (t, a, n, i, r, o) {
            var e, s, l, m, c, h = this;
            if (h.animateStartTime = Date.now(),
                h.animateFns[i] = e,
                h.animateFns[i] ? e = h.animateFns[i] : (e = new L.PosAnimation,
                    h.animateFns[i] = e),
                a < n.length - 1) {
                if (!(l = h.map.latLngToLayerPoint(n[a + 1])))
                    return;
                if (m = o[a + 1].percent,
                    c = o[a + 1].angle,
                    "0" == i && u.progress("playProgress", m + "%"),
                    s = t._icon,
                    $(s).find(".rotate").css("-moz-transform", "rotate(" + c + "deg)"),
                    $(s).find(".rotate").css("transform", "rotate(" + c + "deg)"),
                    !s)
                    return void h.animateFns[i].stop();
                h.animateFns[i].run(s, l, r ? h.speed - r : h.speed, 1),
                    h.animateIndex[i] = a,
                    h.animateFns[i].on("end", function (e) {
                        r = 0,
                            h.isRuning = !1,
                            h.animateFns[i].stop(),
                            a++,
                            h.pushRun || h.animate(t, a, n, i, null, o)
                    })
            }
            .8 * h.maxLength < a && h.quertTimeUTC < h.endUTC && h.getNewData(),
                a == h.maxLength - 1 && (console.log("开始执行新的"),
                    h.newPlay())
        },
        getNewData: function () {
            var e = this;
            if (!e.RepeatGet) {
                console.log("执行获取");
                var t = {
                    query: e.quertTimeUTC,
                    end: e.quertTimeUTC + e.IntervalTime
                };
                APP.Model.history.getInstance().continueQuery(t),
                    e.quertTimeUTC = e.quertTimeUTC + e.IntervalTime
            }
            e.RepeatGet = !0
        },
        newPlay: function () {
            var e = this;
            e.RepeatGet = !1,
                console.log(e.quertTimeUTC);
            var t = {
                start: e.quertTimeUTC,
                end: e.quertTimeUTC + e.IntervalTime,
                query: e.quertTimeUTC
            };
            APP.Model.history.getInstance().runPath(t)
        },
        delayResize: function (e) {
            this.pushRun && (e.stop(),
                e.off("step"))
        },
        throttle: function (a, n) {
            var i = null;
            return function () {
                var e = this
                    , t = arguments;
                clearTimeout(i),
                    i = setTimeout(function () {
                        a.apply(e, t)
                    }, n)
            }
        },
        resizeMap: function () {
            this.map.invalidateSize(!0)
        }
    }
}
    ;
