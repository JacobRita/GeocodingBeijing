import { state } from './state.js';

export const MapManager = {
    init() {
        try {
            // 初始化地图核心实例
            state.map = new T.Map('map', {
                center: new T.LngLat(116.4074, 39.9042), // 北京坐标
                zoom: 12,  // 初始缩放级别
                minZoom: 3,
                maxZoom: 18,
                projection: 'EPSG:4326' // 使用WGS84坐标系
            });

            // 添加默认矢量底图
            this.addBaseLayer('vec');
            
            // 添加地图控件
            this.addMapControls();

            // 初始化事件监听
            this.initEventListeners();

        } catch (error) {
            console.error('地图初始化失败:', error);
            this.showErrorFallback();
        }
    },

    // 添加基础图层
    addBaseLayer(layerType) {
        const baseLayer = new T.TileLayer(layerType, {
            tileSize: 256,
            transparent: true
        });
        state.map.addLayer(baseLayer);
    },

    // 添加地图控件
    addMapControls() {
        // 比例尺控件
        const scaleCtrl = new T.Control.Scale({
            position: 'bottomleft',
            metric: true,
            imperial: false
        });
        state.map.addControl(scaleCtrl);

        // 地图类型切换控件
        const mapTypeCtrl = new T.Control.MapType({
            baseMaps: [
                {
                    title: '矢量地图',
                    layer: new T.TileLayer('vec')
                },
                {
                    title: '影像地图',
                    layer: new T.TileLayer('img')
                }
            ],
            position: 'bottomright'
        });
        state.map.addControl(mapTypeCtrl);
    },

    // 事件监听初始化
    initEventListeners() {
        // Shift键状态跟踪
        document.addEventListener('keydown', (e) => {
            state.shiftPressed = e.shiftKey;
        });
        document.addEventListener('keyup', (e) => {
            state.shiftPressed = e.shiftKey;
        });

        // 地图点击事件（Shift+点击添加标记）
        state.map.addEventListener('click', async (e) => {
            if (!state.shiftPressed) return;

            try {
                const lnglat = state.map.containerPointToLngLat(e.containerPoint);
                const address = await window.Geocoder.reverse(lnglat);
                
                this.addMarker(lnglat);
                window.ResultManager.add({
                    lng: lnglat.lng.toFixed(6),
                    lat: lnglat.lat.toFixed(6),
                    address: address
                });

            } catch (error) {
                console.error('标记添加失败:', error);
            }
        });
    },

    // 添加标记方法
    addMarker(lnglat) {
        const marker = new T.Marker(lnglat, {
            icon: new T.Icon({
                iconUrl: 'http://api.tianditu.gov.cn/img/map/marker.png',
                iconSize: new T.Point(25, 34),
                iconAnchor: new T.Point(12, 34)
            })
        });
        
        marker.addTo(state.map);
        state.markers.push(marker);
        
        // 添加点击弹窗
        marker.addEventListener('click', () => {
            new T.Popup()
                .setLngLat(lnglat)
                .setHTML(`坐标：<br>经度 ${lnglat.lng.toFixed(6)}<br>纬度 ${lnglat.lat.toFixed(6)}`)
                .addTo(state.map);
        });
    },

    // 视图定位方法
    panTo(lnglat) {
        state.map.panTo(lnglat);
        this.addMarker(lnglat);
    },

    // 错误降级处理
    showErrorFallback() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div class="map-error">
                <h3>地图加载失败</h3>
                <p>可能原因：</p >
                <ul>
                    <li>网络连接异常</li>
                    <li>API密钥失效</li>
                    <li>浏览器兼容性问题</li>
                </ul>
                <button onclick="location.reload()">刷新页面</button>
            </div>
        `;
    }
};