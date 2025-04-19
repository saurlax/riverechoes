import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { Readable } from 'stream';
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
  console.log("签名内容:", signingString);
  const signature = crypto.createHmac('sha256', appKey)
    .update(Buffer.from(signingString, 'utf-8'))
    .digest('base64');
  console.log("生成的签名:", signature);
  return {
    timestamp,
    nonce,
    signature,
    signedHeaders: "x-ai-gateway-app-id;x-ai-gateway-timestamp;x-ai-gateway-nonce"
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.chatid || !body.question) {
    return createError({
      statusCode: 400,
      statusMessage: '缺少必要参数 chatid 或 question'
    });
  }
  const appId = process.env.BLUEHEART_APP_ID || '2025432539';
  const appKey = process.env.BLUEHEART_APP_KEY || 'GJmWCkkwVdqtjLPj';
  const requestId = uuidv4();
  const params = { requestId };
  const uri = '/vivogpt/completions/stream';
  const method = 'POST';
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
      "X-AI-GATEWAY-SIGNATURE": signature
    };

    console.log("请求详情:", { url, headers });

    setResponseHeaders(event, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
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
          top_p: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', response.status, errorText);
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

    return;
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

function processChunk(line, res) {
  line = line.trim();
  if (!line) return;

  console.log('收到数据:', line);
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
      console.error('解析数据出错:', e, line);
      res.write(`${line}\n\n`);
    }
    return;
  }

  res.write(`${line}\n`);
}