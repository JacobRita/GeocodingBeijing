const TIANDITU_KEY = 'a1d75044bbf5cb769e6cfd852d65f544'; // 替换为真实密钥

export const Geocoder = {
    async search(query) {
        try {
            const params = new URLSearchParams({
                postStr: JSON.stringify({ keyWord: query }),
                type: 'geocode',
                tk: TIANDITU_KEY
            });
            
            const response = await fetch(
                `http://api.tianditu.gov.cn/geocoder?${params}`
            );
            const data = await response.json();
            return data?.location || null;
            
        } catch (error) {
            console.error('地理编码失败:', error);
            return null;
        }
    },

    async reverse(lnglat) {
        try {
            const params = new URLSearchParams({
                postStr: JSON.stringify({
                    lon: lnglat.lng,
                    lat: lnglat.lat,
                    ver: 1
                }),
                type: 'geocode',
                tk: TIANDITU_KEY
            });
            
            const response = await fetch(
                `http://api.tianditu.gov.cn/geocoder?${params}`
            );
            const data = await response.json();
            return data?.result?.formatted_address || '未知地址';
            
        } catch (error) {
            console.error('逆地理编码失败:', error);
            return '地址解析失败';
        }
    }
};