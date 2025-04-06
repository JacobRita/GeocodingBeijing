import { MapManager } from './mapManager.js';
import { Geocoder } from './geocoder.js';
import { ResultManager } from './resultManager.js';

// 挂载到全局对象以便HTML事件调用
window.MapManager = MapManager;
window.Geocoder = Geocoder;
window.ResultManager = ResultManager;

// 初始化应用
window.onload = () => {
    MapManager.init();
    ResultManager.initSearch();
};