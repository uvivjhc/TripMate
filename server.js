const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;

const APP_KEY = 'zc1vGNB3ue4m1CQqClgU48vxcWmHPE917JE1BjU2'; // sk open apikey

// 1. 사용자의 방문할 장소를 입력받음
// 2. 입력 받은 방문할 장소의 poi(데이터 조회가능한 관심장소) 검색 
// 3. 방문할 장소와 주변 장소의 poi를 통해 실시간 혼잡도 정보 검색
// 4. 혼잡도를 통해 낮은 혼잡도의 장소를 추천함
// ** 현재 실행은 안되는 이슈 **

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  try {
    // 1. 사용자 입력에서 장소 추출 (단순하게 처리)
    const keyword = userMessage.replace(/[^가-힣a-zA-Z0-9 ]/g, '');

    // 2. 장소명 → POI 검색
    const poiRes = await axios.get(`https://apis.openapi.sk.com/tmap/pois`, {
      headers: { 
        appKey: APP_KEY 
      },
      params: {
        version: 1,
        searchKeyword: keyword,
        resCoordType: 'WGS84GEO',
        reqCoordType: 'WGS84GEO',
        count: 3
      }
    });

    const pois = poiRes.data.searchPoiInfo?.pois?.poi || [];

    // 3. 혼잡도 정보 가져오기
    const congestionInfos = await Promise.all(
      pois.map(async (poi) => {
        const congestionRes = await axios.get(
          `https://apis.openapi.sk.com/puzzle/place/congestion/rltm/pois/${poi.id}`,
          {
            headers: { appKey: APP_KEY }
          }
        );
        const data = congestionRes.data.contents[0];
        return {
          name: data.name,
          address: data.address,
          congestion: data.congestionLevel,
          lat: data.lat,
          lon: data.lon
        };
      })
    );

    // 4. 혼잡도가 가장 낮은 장소 추천
    const recommended = congestionInfos.sort((a, b) => a.congestion - b.congestion)[0];

    // 5. 응답
    res.json({
      replyText: `"${keyword}" 관련 추천을 분석했어요! 👇`,
      recommendation: {
        title: recommended.name,
        type: '추천 장소',
        congestion: ['여유', '보통', '혼잡', '매우혼잡'][recommended.congestion] || '정보 없음',
        transport: `근처 위치: ${recommended.address}`,
        mapUrl: `https://maps.google.com/?q=${recommended.lat},${recommended.lon}`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '추천 실패 🥲' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
