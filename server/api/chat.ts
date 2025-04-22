import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

function needsPOIRecommendation(question: string): boolean {
  const actionKeywords = [
    '推荐', '附近', '哪里有', '参观', '游览', '去哪', '博物馆', '景点',
    '地点', '地方', '场所', '位置', '去处', '可以去', '有没有', '在哪', 
    '怎么去', '如何前往', '观光', '旅游', '拜访', '游玩', '打卡', 
    '导览', '展览', '展示', '文物', '古迹'
  ];
  
  const themeKeywords = [
    '满族', '清朝', '文化', '历史', '八旗', '皇家', '皇族', '皇室',
    '皇宫', '紫禁城', '故宫', '清史', '满清', '满汉', '东北', '民族',
    '传统', '风俗', '习俗', '服饰', '宫廷', '建筑', '园林', '陵墓'
  ];
  
  return actionKeywords.some(keyword => question.includes(keyword)) && 
         themeKeywords.some(keyword => question.includes(keyword));
}

// 位置关键词检测函数
function needsLocationBasedSearch(question: string): boolean {
  const locationKeywords = ['附近', '周围', '周边', '身边', '就近', '旁边', '边上', '不远', '近处'];
  return locationKeywords.some(keyword => question.includes(keyword));
}

function extractLocation(question: string): { city: string, province: string } {
  const provinceMap = {
    '华北': ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区'],
    '东北': ['辽宁省', '吉林省', '黑龙江省'],
    '华东': ['上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省'],
    '华中': ['河南省', '湖北省', '湖南省'],
    '华南': ['广东省', '广西壮族自治区', '海南省'],
    '西南': ['重庆市', '四川省', '贵州省', '云南省', '西藏自治区'],
    '西北': ['陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区']
  };
  
  const provinceCapitals = {
    '北京': '北京', '天津': '天津', '上海': '上海', '重庆': '重庆',
    '河北': '石家庄', '山西': '太原', '内蒙古': '呼和浩特',
    '辽宁': '沈阳', '吉林': '长春', '黑龙江': '哈尔滨',
    '江苏': '南京', '浙江': '杭州', '安徽': '合肥', '福建': '福州',
    '江西': '南昌', '山东': '济南', '河南': '郑州', '湖北': '武汉',
    '湖南': '长沙', '广东': '广州', '广西': '南宁', '海南': '海口',
    '四川': '成都', '贵州': '贵阳', '云南': '昆明', '西藏': '拉萨',
    '陕西': '西安', '甘肃': '兰州', '青海': '西宁', '宁夏': '银川',
    '新疆': '乌鲁木齐'
  };
  
  const cities = [
    '北京', '上海', '广州', '深圳', '成都', '重庆', '大连', '东莞',
    '佛山', '福州', '杭州', '合肥', '济南', '昆明', '南京', '宁波',
    '青岛', '苏州', '天津', '武汉', '西安', '厦门', '长沙', '郑州',
    '长春', '哈尔滨', '沈阳', '石家庄', '太原', '呼和浩特', '南昌', '南宁',
    '海口', '贵阳', '拉萨', '兰州', '西宁', '银川', '乌鲁木齐', '开封',
    '洛阳', '扬州', '绍兴', '泉州', '景德镇', '遵义', '丽江', '大理', '敦煌'
  ];

  const normalizedCities = [...new Set(cities)].map(c => c.replace('市', ''));
  
  let detectedCity = null;
  let detectedProvince = null;
  
  for (const city of normalizedCities) {
    if (question.includes(city)) {
      detectedCity = city;
      break;
    }
  }
  
  const provinceAliases = {
    '内蒙古': ['内蒙'],
    '黑龙江': ['黑龙'],
    '新疆': ['新疆维吾尔'],
    '宁夏': ['宁夏回族'],
    '广西': ['广西壮族']
  };
  
  for (const [region, provinceList] of Object.entries(provinceMap)) {
    for (const province of provinceList) {
      const shortProvince = province.replace(/省|市|自治区/g, '');
      
      let aliases = [province, shortProvince];
      for (const [key, values] of Object.entries(provinceAliases)) {
        if (key === shortProvince || values.includes(shortProvince)) {
          aliases = [...aliases, key, ...values];
          break;
        }
      }
      
      if (aliases.some(alias => question.includes(alias))) {
        detectedProvince = shortProvince;
        if (!detectedCity) {
          detectedCity = provinceCapitals[shortProvince] || '北京';
        }
        break;
      }
    }
    if (detectedProvince) break;
  }
  
  return {
    city: detectedCity || '北京',
    province: detectedProvince || '北京'
  };
}

function extractPOIKeywords(question: string): string {
  if (question.includes('满族博物馆')) return '满族博物馆';
  if (question.includes('满族') && question.includes('文化') && question.includes('博物馆')) 
    return '满族文化博物馆';
  if (question.includes('满族') && question.includes('历史') && question.includes('博物馆'))
    return '满族历史博物馆';
  if (question.includes('清朝') && question.includes('博物馆'))
    return '清朝博物馆';
  
  if (question.includes('满族')) {
    if (question.includes('博物馆')) return '满族博物馆';
    if (question.includes('文化')) return '满族文化';
    if (question.includes('历史')) return '满族历史';
    if (question.includes('服饰')) return '满族服饰';
    if (question.includes('美食')) return '满族美食';
    if (question.includes('商店') || question.includes('店铺')) return '满族文化商店';
    return '满族';
  }
  
  if (question.includes('清朝')) {
    if (question.includes('博物馆')) return '清朝博物馆';
    if (question.includes('历史')) return '清朝历史';
    if (question.includes('文化')) return '清朝文化';
    return '清朝';
  }
  
  if (question.includes('博物馆')) return '博物馆';
  return '满族博物馆';
}

function generateNonce(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function buildQueryString(params) {
  return Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

function generateSignature(appId, appKey, method, uri, queryParams) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce(8);
  const canonicalQueryString = buildQueryString(queryParams);
  const signedHeadersString = `x-ai-gateway-app-id:${appId}\nx-ai-gateway-timestamp:${timestamp}\nx-ai-gateway-nonce:${nonce}`;
  const signingString = `${method.toUpperCase()}\n${uri}\n${canonicalQueryString}\n${appId}\n${timestamp}\n${signedHeadersString}`;
  
  const signature = crypto.createHmac('sha256', appKey)
    .update(Buffer.from(signingString, 'utf-8'))
    .digest('base64');
  
  return {
    timestamp,
    nonce,
    signature,
    signedHeaders: "x-ai-gateway-app-id;x-ai-gateway-timestamp;x-ai-gateway-nonce"
  };
}

function escapeSSEText(text: string): string {
  return text
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r');
}

// 添加坐标支持
async function searchVivoPOI(keywords: string, city: string, province?: string, coords?: { latitude: number, longitude: number }) {
  try {
    const appId = process.env.VIVO_APP_ID || '2025432539';
    const appKey = process.env.VIVO_APP_KEY || 'GJmWCkkwVdqtjLPj';
    const uri = '/search/geo';
    const method = 'GET';
    
    // 基本参数
    const queryParams: any = {
      keywords,
      page_num: '1',
      page_size: '5'
    };
    
    // 如果有坐标，优先使用坐标进行周边搜索
    if (coords) {
      console.log("使用坐标搜索POI:", coords);
      queryParams.location = `${coords.longitude},${coords.latitude}`;
      queryParams.radius = '20000';
    } else {
      // 否则使用城市名称搜索
      const searchArea = city || province || '北京';
      queryParams.city = searchArea;
      console.log("使用城市搜索POI:", searchArea);
    }
    
    const { timestamp, nonce, signature, signedHeaders } = generateSignature(
      appId, appKey, method, uri, queryParams
    );
    
    const queryString = buildQueryString(queryParams);
    const url = `https://api-ai.vivo.com.cn${uri}?${queryString}`;
    
    const headers = {
      "Content-Type": "application/json",
      "X-AI-GATEWAY-APP-ID": appId,
      "X-AI-GATEWAY-TIMESTAMP": timestamp,
      "X-AI-GATEWAY-NONCE": nonce,
      "X-AI-GATEWAY-SIGNED-HEADERS": signedHeaders,
      "X-AI-GATEWAY-SIGNATURE": signature
    };
    
    console.log("VIVO POI API 请求:", url);
    
    const response = await fetch(url, { method, headers });
    
    if (!response.ok) {
      throw new Error(`VIVO POI API 错误: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data && data.pois && data.pois.length > 0) ? data.pois : [];
  } catch (error) {
    console.error("搜索POI失败:", error);
    return [];
  }
}

async function callVivoLLM(question: string, chatid: string) {
  const appId = process.env.BLUEHEART_APP_ID || '2025432539';
  const appKey = process.env.BLUEHEART_APP_KEY || 'GJmWCkkwVdqtjLPj';
  const requestId = uuidv4();
  const params = { requestId };
  const uri = '/vivogpt/completions/stream';
  const method = 'POST';
  
  const { timestamp, nonce, signature, signedHeaders } = generateSignature(
    appId, appKey, method, uri, params
  );

  const queryStr = buildQueryString(params);
  const url = `https://api-ai.vivo.com.cn${uri}?${queryStr}`;
  const headers = {
    "Content-Type": "application/json",
    "X-AI-GATEWAY-APP-ID": appId,
    "X-AI-GATEWAY-TIMESTAMP": timestamp,
    "X-AI-GATEWAY-NONCE": nonce,
    "X-AI-GATEWAY-SIGNED-HEADERS": signedHeaders,
    "X-AI-GATEWAY-SIGNATURE": signature
  };

  return await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt: question,
      model: "vivo-BlueLM-TB-Pro",
      sessionId: chatid,
      extra: {
        temperature: 0.9,
        top_p: 0.7
      }
    })
  });
}

function formatPOIRecommendations(pois) {
  return pois.map((poi, index) => 
    `${index + 1}. ${poi.name}\n   地址：${poi.address || '未提供'}\n   电话：${poi.phone || '未提供'}\n   所在区域：${poi.city}${poi.district}`
  ).join('\n\n');
}

// 修改generatePOIIntroduction，支持位置搜索情况
function generatePOIIntroduction(question: string, city: string, province?: string, isNearbySearch: boolean = false) {
  const area = isNearbySearch ? '您附近' : (city || province || '北京');
  
  if (question.includes('满族')) {
    return `为您找到${area}的以下与满族文化相关的地点：`;
  } else if (question.includes('清朝')) {
    return `以下是${area}的一些与清朝历史相关的推荐地点：`;
  } else if (question.includes('博物馆')) {
    return `为您推荐${area}的以下可以参观的博物馆：`;
  }
  return `根据您的需求，为您找到${area}的以下相关地点：`;
}

function processChunk(line, res) {
  line = line.trim();
  if (!line) return;

  if (line.startsWith('event:')) {
    res.write(`${line}\n`);
    return;
  }

  if (line.startsWith('data:')) {
    try {
      const content = line.substring(5).trim();

      if (content === '[DONE]') {
        res.write(`${line}\n\n`);
        return;
      }

      const data = JSON.parse(content);

      if (data.message !== undefined) {
        res.write(`data: {"answer": ${JSON.stringify(data.message)}}\n\n`);
      } else if (data.reply !== undefined) {
        res.write(`data: {"answer": ${JSON.stringify(data.reply)}}\n\n`);
      } else {
        res.write(`${line}\n\n`);
      }
    } catch (e) {
      console.error('解析数据出错:', e);
      res.write(`${line}\n\n`);
    }
    return;
  }

  res.write(`${line}\n`);
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.chatid || !body.question) {
    return createError({
      statusCode: 400,
      statusMessage: '缺少必要参数 chatid 或 question'
    });
  }
  
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  
  if (needsPOIRecommendation(body.question)) {
    try {
      // 检查是否需要基于位置的搜索
      const useLocationBasedSearch = needsLocationBasedSearch(body.question);
      
      // 从请求体中获取位置信息（由前端传入）
      const userCoords = body.coords || null;
      
      // 提取问题中的城市和省份
      const { city, province } = extractLocation(body.question);
      
      // 如果问题中明确指定了城市/省份，则优先使用问题中的位置
      // 否则如果是基于位置的搜索，使用用户位置
      const searchCity = city !== '北京' ? city : useLocationBasedSearch ? null : city;
      console.log('最终搜索城市:', searchCity, '省份:', province);
      console.log('是否使用位置搜索:', useLocationBasedSearch);
      console.log('用户坐标:', userCoords);
      
      const keywords = extractPOIKeywords(body.question);
      console.log('POI 搜索关键词:', keywords);
      
      // 使用坐标或城市进行POI搜索
      const poiResults = await searchVivoPOI(
        keywords, 
        searchCity, 
        province, 
        (useLocationBasedSearch && userCoords) ? userCoords : undefined
      );
      
      if (poiResults && poiResults.length > 0) {
        console.log('成功获取 POI 结果! 共找到:', poiResults.length, '条记录');
        
        // 确定是否使用"附近"作为位置描述
        const isNearbySearch = useLocationBasedSearch && userCoords;
        const introduction = generatePOIIntroduction(body.question, city, province, isNearbySearch);
        const poiRecommendations = formatPOIRecommendations(poiResults);
        
        const escapedIntro = escapeSSEText(introduction);
        const escapedResults = escapeSSEText(poiRecommendations);
        
        event.node.res.write(`data: {"answer": "${escapedIntro}"}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 300));
        event.node.res.write(`data: {"answer": "\\n\\n${escapedResults}"}\n\n`);
        
        event.node.res.write('event: close\ndata: [DONE]\n\n');
        event.node.res.end();
        return;
      }
      
      console.log('POI 搜索无结果，回退到大模型回答');
    } catch (error) {
      console.error('POI 推荐处理失败:', error);
    }
  }
  
  try {
    const response = await callVivoLLM(body.question, body.chatid);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API错误: ${response.status} ${errorText}`);
    }

    if (!response.body) {
      throw new Error('API没有返回流数据');
    }
    
    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            processChunk(buffer, event.node.res);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          processChunk(line, event.node.res);
        }
      }
    } catch (error) {
      console.error('流处理错误:', error);
      event.node.res.write(`event: error\ndata: ${JSON.stringify({
        error: '流处理错误',
        message: error.message
      })}\n\n`);
    } finally {
      event.node.res.write('event: close\ndata: [DONE]\n\n');
      event.node.res.end();
    }

    event.node.req.on('close', () => {
      reader.cancel();
      console.log('客户端关闭连接');
    });
  } catch (error) {
    console.error('处理请求出错:', error);

    if (event.node.res.headersSent) {
      event.node.res.write(`event: error\ndata: ${JSON.stringify({
        error: '处理请求失败',
        message: error.message
      })}\n\n`);
      event.node.res.end();
      return;
    }

    return {
      error: '处理请求失败',
      message: error.message,
      details: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : undefined
    };
  }
});