let body = $response.body;

try {
  // 将响应体转换为 JSON 对象
  let obj = JSON.parse(body);
  
  // 确保 data 层级存在
  if (obj && obj.data) {
    // 直接修改对象的属性值，无需担心空格和格式问题
    obj.data.vip_status = true;
    obj.data.max_devices = 999;
    obj.data.vip_time = "2099-12-31T23:59:59.000Z";
    
    // 如果原数据有 null，也可以顺便修改
    if (obj.data.nickname === null) {
      obj.data.nickname = "破解版超级VIP";
    }
  }
  
  // 将修改后的对象重新转回字符串
  body = JSON.stringify(obj);
  
} catch (e) {
  console.log("JSON 解析失败: " + e);
}

$done({ body });
