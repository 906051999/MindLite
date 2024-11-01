import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file');
    
    // 创建新的 FormData，添加必需的 model 参数
    const apiFormData = new FormData();
    apiFormData.append('file', audioFile);
    apiFormData.append('model', 'FunAudioLLM/SenseVoiceSmall');
    
    // 添加 AbortController 处理超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      },
      body: apiFormData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    let data;
    const contentType = response.headers.get('content-type');
    try {
      // 尝试解析 JSON
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        // 如果不是 JSON，获取原始文本
        const text = await response.text();
        data = { text }; // 将文本包装成预期的格式
      }
    } catch (error) {
      console.error('Response parsing error:', error);
      return NextResponse.json(
        { error: '无法解析服务器响应' },
        { status: 500 }
      );
    }

    // 处理不同状态码
    switch (response.status) {
      case 200:
        return NextResponse.json(data);
      case 400:
        return NextResponse.json(
          { error: data.error || '无效的请求参数' },
          { status: 400 }
        );
      case 401:
        return NextResponse.json(
          { error: 'API密钥无效或已过期' },
          { status: 401 }
        );
      case 429:
        return NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { status: 429 }
        );
      case 503:
      case 504:
        return NextResponse.json(
          { error: '服务暂时不可用，请稍后再试' },
          { status: response.status }
        );
      default:
        return NextResponse.json(
          { error: data.error || '转录失败' },
          { status: response.status }
        );
    }
  } catch (error) {
    // 处理超时错误
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '请求超时，请稍后重试' },
        { status: 504 }
      );
    }
    
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: error.message || '音频转录失败' },
      { status: 500 }
    );
  }
} 