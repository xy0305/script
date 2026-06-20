let body = $response.body;

try {
  let obj = JSON.parse(body);

  // 整理好我们要强行塞入的“满配 VIP 数据”
  let fakeData = {
    "vip_status": true,
    "max_devices": 999,
    "vip_time": "2099-12-31T23:59:59.000Z",
    "can_claim_trial": true,
    "membership": {
      "current_plan": "premium",
      "auto_renewal": true,
      "plan_start_time": 1718000000,
      "plan_expire_time": 4102415999,
      "previous_plan": "free",
      "plan_status": "active",
      "previous_plan_expire_time": 0,
      "plan_id": "vip_yearly"
    },
    "quota": {
      "channel_sub_limit": 999,
      "channel_create_limit": 99,
      "tts_used": 0,
      "article_key_points_limit": 999,
      "channel_sub_used": 0,
      "article_breakdown_limit": 999,
      "daily_voice_limit": 999,
      "channel_create_used": 0,
      "export_used": 0,
      "daily_voice_used": 0,
      "article_breakdown_used": 0,
      "article_key_points_used": 0,
      "tts_limit": 999,
      "export_limit": 999
    }
  };

  // 1. 处理“分片同步” (带有 chunk_info)
  if (obj.chunk_info && obj.chunk_info.key && obj.data) {
    let key = obj.chunk_info.key;
    if (key === 'algorithm') {
      obj.data.algorithm = ""; 
    } else if (key === '__compressed') {
      obj.data.__compressed = false;
    } else if (key === 'payload') {
      obj.data.payload = JSON.stringify(fakeData);
    } else if (fakeData[key] !== undefined) {
      obj.data[key] = fakeData[key];
    }
  } 
  // 2. 处理“完整同步” (如登录接口，或完整的加密 sync 接口)
  else if (obj.data) {
    if (obj.data.__compressed === true) {
      // 如果发现是加密包：关闭加密标记，删除乱码
      obj.data.__compressed = false;
      delete obj.data.payload;
      delete obj.data.algorithm;
    }
    // 将我们准备好的 fakeData 强行合并到 obj.data 中
    // 这样无论原本数据长什么样，都会被满配 VIP 数据覆盖
    Object.assign(obj.data, fakeData);
  }

  body = JSON.stringify(obj);
} catch (e) {
  console.log("JSON解析或替换失败: " + e);
}

$done({ body });
