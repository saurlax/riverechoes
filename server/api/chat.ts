import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { Readable } from "stream";
import { fetch } from "ofetch";

function needsPOIRecommendation(question: string): boolean {
  const actionKeywords = [
    "推荐",
    "附近",
    "哪里有",
    "参观",
    "游览",
    "去哪",
    "博物馆",
    "景点",
    "地点",
    "地方",
    "场所",
    "位置",
    "去处",
    "可以去",
    "有没有",
    "在哪",
    "怎么去",
    "如何前往",
    "观光",
    "旅游",
    "拜访",
    "游玩",
    "打卡",
    "导览",
    "展览",
    "展示",
    "文物",
    "古迹",
  ];

  const themeKeywords = [
    "满族",
    "清朝",
    "文化",
    "历史",
    "八旗",
    "皇家",
    "皇族",
    "皇室",
    "皇宫",
    "紫禁城",
    "故宫",
    "清史",
    "满清",
    "满汉",
    "东北",
    "民族",
    "传统",
    "风俗",
    "习俗",
    "服饰",
    "宫廷",
    "建筑",
    "园林",
    "陵墓",
  ];

  return (
    actionKeywords.some((keyword) => question.includes(keyword)) &&
    themeKeywords.some((keyword) => question.includes(keyword))
  );
}

// 从问题中提取可能的城市
function extractCity(question: string): string {
  const cities = [
    "北京",
    "上海",
    "广州",
    "深圳",
    "成都",
    "杭州",
    "南京",
    "武汉",
    "西安",
    "重庆",
    "沈阳",
    "大连",
    "青岛",
    "长春",
    "哈尔滨",
    "济南",
  ];

  for (const city of cities) {
    if (question.includes(city)) {
      return city;
    }
  }
  return "北京";
}

// 提取可能的关键词
function extractPOIKeywords(question: string): string[] {
  const specificCombinations = [];

  if (question.includes("满族博物馆")) specificCombinations.push("满族博物馆");
  else if (
    question.includes("满族") &&
    question.includes("历史") &&
    question.includes("博物馆")
  )
    specificCombinations.push("满族历史博物馆");
  else if (
    question.includes("满族") &&
    question.includes("文化") &&
    question.includes("博物馆")
  )
    specificCombinations.push("满族文化博物馆");
  else if (question.includes("清朝") && question.includes("博物馆"))
    specificCombinations.push("清朝博物馆");

  if (specificCombinations.length > 0) {
    return specificCombinations;
  }

  const baseKeywords = [];
  const specificTerms = [];

  if (question.includes("满族")) {
    if (question.includes("博物馆")) baseKeywords.push("满族博物馆");
    else if (question.includes("文化")) baseKeywords.push("满族文化");
    else if (question.includes("历史")) baseKeywords.push("满族历史");
    else baseKeywords.push("满族");
  }

  if (question.includes("清朝")) {
    if (question.includes("博物馆")) baseKeywords.push("清朝博物馆");
    else if (question.includes("历史")) baseKeywords.push("清朝历史");
    else if (question.includes("文化")) baseKeywords.push("清朝文化");
    else baseKeywords.push("清朝");
  }

  // 地点类型
  if (question.includes("博物馆")) specificTerms.push("博物馆");
  if (question.includes("历史")) specificTerms.push("历史博物馆");
  if (question.includes("文化")) specificTerms.push("文化馆");
  if (question.includes("遗址") || question.includes("古迹"))
    specificTerms.push("历史遗址");
  if (question.includes("公园") || question.includes("园林"))
    specificTerms.push("公园");
  if (question.includes("宫殿") || question.includes("宫"))
    specificTerms.push("宫殿");
  if (question.includes("陵墓") || question.includes("陵寝"))
    specificTerms.push("陵墓");
  if (question.includes("纪念馆") || question.includes("纪念"))
    specificTerms.push("纪念馆");
  if (question.includes("展览") || question.includes("展示"))
    specificTerms.push("展览馆");

  // 主题类型
  if (question.includes("服饰") || question.includes("服装"))
    specificTerms.push("满族服饰");
  if (question.includes("美食") || question.includes("饮食"))
    specificTerms.push("满族美食");
  if (question.includes("工艺") || question.includes("手工"))
    specificTerms.push("满族工艺");
  if (question.includes("表演") || question.includes("演出"))
    specificTerms.push("满族表演");
  if (question.includes("节日") || question.includes("庆典"))
    specificTerms.push("满族节日");

  // 地区特定关键词
  const city = extractCity(question);
  if (city === "北京" && baseKeywords.length === 0) {
    specificTerms.push("故宫博物院");
    specificTerms.push("清华大学艺术博物馆");
    specificTerms.push("颐和园");
  }

  if (baseKeywords.length === 0) {
    baseKeywords.push("满族");
    baseKeywords.push("清朝");
  }

  return [...baseKeywords, ...specificTerms];
}

function getCityLocation(city: string): string | undefined {
  const cityLocations = {
    北京: "116.397428,39.90923",
    上海: "121.490317,31.222771",
    广州: "113.330803,23.113901",
    深圳: "114.057868,22.543099",
    成都: "104.084717,30.657328",
    杭州: "120.211539,30.246611",
    南京: "118.802422,32.064653",
    武汉: "114.311582,30.598467",
    西安: "108.946266,34.347269",
    重庆: "106.551557,29.563761",
  };

  return cityLocations[city];
}

async function fetchPOIRecommendations(
  keywords: string,
  location?: string,
  city: string = "北京"
) {
  try {
    const AMAP_KEY = process.env.AMAP_KEY || "38a9e8f6f5b8e0a3d65e2bf9fcdbd0c1";

    const params = new URLSearchParams({
      key: AMAP_KEY,
      keywords: keywords,
      offset: "10",
      page: "1",
      extensions: "all",
      sortrule: "distance",
    });

    if (location) {
      params.append("location", location);
      params.append("radius", "5000");
      const url = `https://restapi.amap.com/v3/place/around?${params.toString()}`;
      console.log("使用周边搜索 API:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`高德 API 错误: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        "周边搜索 API 响应:",
        JSON.stringify(data).substring(0, 200) + "..."
      );

      if (data.status === "1" && data.pois && data.pois.length > 0) {
        return data.pois.slice(0, 5);
      }
    } else {
      params.append("city", city);
      const url = `https://restapi.amap.com/v3/place/text?${params.toString()}`;
      console.log("使用城市搜索 API:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`高德 API 错误: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        "城市搜索 API 响应:",
        JSON.stringify(data).substring(0, 200) + "..."
      );

      if (data.status === "1" && data.pois && data.pois.length > 0) {
        return data.pois.slice(0, 5);
      }
    }

    return [];
  } catch (error) {
    console.error("获取 POI 推荐失败:", error);
    return [];
  }
}

function escapeSSEText(text: string): string {
  return text.replace(/\n/g, "\\n").replace(/"/g, '\\"').replace(/\r/g, "\\r");
}

function formatPOIRecommendations(pois) {
  return pois
    .map(
      (poi, index) =>
        `${index + 1}. ${poi.name}\n   地址：${
          poi.address || "未提供"
        }\n   电话：${poi.tel || "未提供"}`
    )
    .join("\n\n");
}

function generatePOIIntroduction(question: string) {
  if (question.includes("满族")) {
    return "为您找到以下与满族文化相关的地点：";
  } else if (question.includes("清朝")) {
    return "以下是一些与清朝历史相关的推荐地点：";
  } else if (question.includes("博物馆")) {
    return "为您推荐以下可以参观的博物馆：";
  } else {
    return "根据您的需求，为您找到以下相关地点：";
  }
}

function generateNonce(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function buildQueryString(params) {
  return Object.keys(params)
    .sort()
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

function generateSignature(appId, appKey, method, uri, queryParams) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce(8);
  const canonicalQueryString = buildQueryString(queryParams);
  const signedHeadersString = `x-ai-gateway-app-id:${appId}\nx-ai-gateway-timestamp:${timestamp}\nx-ai-gateway-nonce:${nonce}`;
  const signingString = `${method.toUpperCase()}\n${uri}\n${canonicalQueryString}\n${appId}\n${timestamp}\n${signedHeadersString}`;
  console.log("签名内容:", signingString);
  const signature = crypto
    .createHmac("sha256", appKey)
    .update(Buffer.from(signingString, "utf-8"))
    .digest("base64");
  console.log("生成的签名:", signature);
  return {
    timestamp,
    nonce,
    signature,
    signedHeaders:
      "x-ai-gateway-app-id;x-ai-gateway-timestamp;x-ai-gateway-nonce",
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.chatid || !body.question) {
    return createError({
      statusCode: 400,
      statusMessage: "缺少必要参数 chatid 或 question",
    });
  }

  // 检查是否需要 POI 推荐
  if (needsPOIRecommendation(body.question)) {
    try {
      // 提取城市信息
      const city = extractCity(body.question);
      console.log("检测到城市:", city);

      // 获取位置信息
      let location;
      if (body.location) {
        location = body.location;
        console.log("使用客户端提供的位置:", location);
      } else if (city && body.question.includes("附近")) {
        location = getCityLocation(city);
        console.log(`使用${city}的默认位置:`, location);
      }

      const keywords = extractPOIKeywords(body.question).join("|");
      console.log("POI 搜索关键词:", keywords);

      const poiResults = await fetchPOIRecommendations(
        keywords,
        location,
        city
      );

      setResponseHeaders(event, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });

      if (poiResults && poiResults.length > 0) {
        console.log("成功获取 POI 结果! 共找到:", poiResults.length, "条记录");

        console.log("所有 POI 结果:");
        poiResults.forEach((poi, index) => {
          console.log(`[${index + 1}] ${poi.name} - ${poi.address}`);
        });

        const introduction = generatePOIIntroduction(body.question);

        const poiRecommendations = formatPOIRecommendations(poiResults);

        const escapedIntro = escapeSSEText(introduction);
        const escapedResults = escapeSSEText(poiRecommendations);

        event.node.res.write(`data: {"answer": "${escapedIntro}"}\n\n`);

        await new Promise((resolve) => setTimeout(resolve, 300));

        event.node.res.write(`data: {"answer": "\\n\\n${escapedResults}"}\n\n`);

        event.node.res.write("event: close\ndata: [DONE]\n\n");
        event.node.res.end();

        return;
      } else {
        console.log("POI 搜索无结果，关键词:", keywords);

        const errorMessage = escapeSSEText(
          `很抱歉，我没有在${city}找到与'${body.question}'相关的地点信息。您可以尝试用不同的关键词再次提问，或询问其他满族文化相关问题。`
        );
        event.node.res.write(`data: {"answer": "${errorMessage}"}\n\n`);
        event.node.res.write("event: close\ndata: [DONE]\n\n");
        event.node.res.end();

        return;
      }
    } catch (poiError) {
      console.error("获取 POI 推荐失败:", poiError);

      console.log("POI 查询失败，回退到大模型回答");
    }
  }

  const appId = process.env.BLUEHEART_APP_ID || "2025432539";
  const appKey = process.env.BLUEHEART_APP_KEY || "GJmWCkkwVdqtjLPj";
  const requestId = uuidv4();
  const params = { requestId };
  const uri = "/vivogpt/completions/stream";
  const method = "POST";
  try {
    const { timestamp, nonce, signature, signedHeaders } = generateSignature(
      appId,
      appKey,
      method,
      uri,
      params
    );

    const queryStr = buildQueryString(params);
    const url = `https://api-ai.vivo.com.cn${uri}?${queryStr}`;
    const headers = {
      "Content-Type": "application/json",
      "X-AI-GATEWAY-APP-ID": appId,
      "X-AI-GATEWAY-TIMESTAMP": timestamp,
      "X-AI-GATEWAY-NONCE": nonce,
      "X-AI-GATEWAY-SIGNED-HEADERS": signedHeaders,
      "X-AI-GATEWAY-SIGNATURE": signature,
    };

    console.log("请求详情:", { url, headers });

    setResponseHeaders(event, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt: body.question,
        model: "vivo-BlueLM-TB-Pro",
        sessionId: body.chatid,
        extra: {
          temperature: 0.9,
          top_p: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API错误:", response.status, errorText);
      throw new Error(`API错误: ${response.status} ${errorText}`);
    }

    if (!response.body) {
      throw new Error("API没有返回流数据");
    }
    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    let buffer = "";

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

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          processChunk(line, event.node.res);
        }
      }
    } catch (error) {
      console.error("流处理错误:", error);
      event.node.res.write(
        `event: error\ndata: ${JSON.stringify({
          error: "流处理错误",
          message: error.message,
        })}\n\n`
      );
    } finally {
      event.node.res.write("event: close\ndata: [DONE]\n\n");
      event.node.res.end();
    }

    event.node.req.on("close", () => {
      reader.cancel();
      console.log("客户端关闭连接");
    });

    return;
  } catch (error) {
    console.error("处理请求出错:", error);

    if (event.node.res.headersSent) {
      event.node.res.write(
        `event: error\ndata: ${JSON.stringify({
          error: "处理请求失败",
          message: error.message,
        })}\n\n`
      );
      event.node.res.end();
      return;
    }

    return {
      error: "处理请求失败",
      message: error.message,
      details: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : undefined,
    };
  }
});

function processChunk(line, res) {
  line = line.trim();
  if (!line) return;

  console.log("收到数据:", line);
  if (line.startsWith("event:")) {
    res.write(`${line}\n`);
    return;
  }

  if (line.startsWith("data:")) {
    try {
      const content = line.substring(5).trim();

      if (content === "[DONE]") {
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
      console.error("解析数据出错:", e, line);
      res.write(`${line}\n\n`);
    }
    return;
  }

  res.write(`${line}\n`);
}
