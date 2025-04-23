<script setup lang="ts">
const museums = [
    {
        name: '吉林市满族博物馆',
        address: '吉林市船营区德胜路47号',
        image: '/assets/museum/museum1.webp',
        website: 'http://www.jlsmzbwg.org.cn/index'
    },
    {
        name: '北京故宫博物馆',
        address: '北京市东城区景山前街4号',
        image: '/assets/museum/museum2.webp',
        website: 'https://www.dpm.org.cn/Home.html'
    },
    {
        name: '中华满族风情园',
        address: '辽宁省抚顺市新宾满族自治县',
        image: '/assets/museum/museum3.webp',
        website: 'http://www.xinbin.gov.cn/ins.asp?s=80&i=22'
    },
    {
        name: '齐齐哈尔博物馆',
        address: '齐齐哈尔市建华区中华路1号',
        image: '/assets/museum/museum4.webp',
        website: 'https://www.720yun.com/vr/eef20xiucbv'
    },
    {
        name: '沈阳故宫博物院',
        address: '辽宁省沈阳市沈河区沈阳路',
        image: '/assets/museum/museum5.webp',
        website: 'https://www.sypm.org.cn/'
    },
    {
        name: '恭王府博物馆',
        address: '北京市西城区前海西街17号',
        image: '/assets/museum/museum6.webp',
        website: 'https://www.pgm.org.cn/'
    },
    {
        name: '赫图阿拉城',
        address: '辽宁省新宾满族自治县永陵镇',
        image: '/assets/museum/museum7.webp',
        website: 'http://lnhtal.com/'
    },
];
</script>

<template>
    <div class="background">
        <div class="header">
            <RouterLink to="/map"><button class="return-button">返回地图</button></RouterLink>
            <h1 class="page-title">满族文化</h1>
            <div class="spacer"></div>
        </div>

        <div class="museum-container">
            <div class="museum-grid">
                <div v-for="museum in museums" :key="museum.name" class="museum-item">
                    <div class="museum-image">
                        <a :href="museum.website" target="_blank" rel="noopener noreferrer">
                            <img :src="museum.image" :alt="museum.name" />
                            <div class="image-overlay">
                                <span class="visit-text">访问官网</span>
                            </div>
                        </a>
                    </div>
                    <div class="museum-details">
                        <div class="museum-name">{{ museum.name }}</div>
                        <div class="museum-address">
                            <img src="/assets/location.webp" alt="位置" class="location-icon" />
                            <span>{{ museum.address }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-poetry">
            <p>雪沃松江骑射雄，旗袍织锦映霞红。
                三山鹿鼓云间彻，满汉交融鼎食风。</p>
        </div>
    </div>
</template>

<style scoped>
.background {
    background-image: url('/assets/background.webp');
    background-size: cover;
    background-attachment: fixed;
    min-height: 100vh;
    padding-bottom: 24px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
}

.return-button {
    background-color: #6b4226;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.return-button:hover {
    background-color: #8a5a30;
}

.page-title {
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
    color: #4a2c12;
    text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.7);
}

.spacer {
    width: 80px;
}

.museum-container {
    flex: 1;
    padding: 16px;
}

.museum-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;
}

.museum-item {
    background-color: rgba(255, 255, 255, 0.85);
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.museum-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.museum-image {
    width: 100%;
    height: 130px;
    overflow: hidden;
    position: relative;
}

.museum-image a {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.museum-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.visit-text {
    color: white;
    font-size: 0.9rem;
    font-weight: bold;
    padding: 6px 12px;
    border: 1px solid white;
    border-radius: 4px;
}

.museum-image a:hover img {
    transform: scale(1.05);
}

.museum-image a:hover .image-overlay {
    opacity: 1;
}

.museum-details {
    padding: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.museum-name {
    font-weight: bold;
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: #4a2c12;
}

.museum-address {
    font-size: 0.75rem;
    color: #666;
    display: flex;
    align-items: flex-start;
}

.location-icon {
    width: 10px;
    height: 10px;
    margin-right: 4px;
    margin-top: 3px;
}

.footer-poetry {
    margin-top: 20px;
    text-align: center;
    padding: 15px 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(3px);
    border-top: 1px solid rgba(106, 66, 38, 0.3);
}

.footer-poetry p {
    margin: 0;
    font-size: 0.95rem;
    color: #4a2c12;
    font-style: italic;
    letter-spacing: 1px;
    line-height: 1.6;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}
</style>