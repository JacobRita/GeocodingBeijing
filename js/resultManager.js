import { state } from './state.js';

export const ResultManager = {
    add(result) {
        state.results.unshift(result);
        this.render();
    },

    remove(index) {
        state.results.splice(index, 1);
        this.render();
    },

    render() {
        const container = document.getElementById('results');
        container.innerHTML = state.results.map((item, index) => `
            <div class="result-item">
                <p>${item.address}</p >
                <p class="coordinates">经度: ${item.lng}<br>纬度: ${item.lat}</p >
                <button onclick="window.ResultManager.remove(${index})">删除</button>
            </div>
        `).join('');
    },

    initSearch() {
        document.getElementById('search-btn').addEventListener('click', async () => {
            const query = document.getElementById('search').value.trim();
            if (!query) return;

            const location = await window.Geocoder.search(query);
            if (location) {
                const lnglat = new T.LngLat(location.lng, location.lat);
                window.MapManager.panTo(lnglat);
            }
        });
    }
};