let body = $response.body;

body = body.replace(/"vip_status":false/g, '"vip_status":true');
body = body.replace(/"max_devices":1/g, '"max_devices":999');
body = body.replace(/"vip_time":null/g, '"vip_time":"2099-12-31T23:59:59.000Z"');

$done({ body });
