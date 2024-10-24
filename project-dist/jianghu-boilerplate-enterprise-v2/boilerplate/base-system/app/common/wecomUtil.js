

const { BizError, errorInfoEnum } = require("../constant/error");
var axios = require('axios');

// 配置+变量
var corpId, corpSecret, agentId, apiHost, accessTokenData;
async function initConfig(config) {
  corpId = config.corpId;
  corpSecret = config.corpSecret;
  agentId = config.agentId;
  apiHost = config.apiHost;
}

// 请求微信
async function request({ method = 'GET', path = '', data = {}, params = {} }) {
  let result = await axios.request({ method, url: apiHost + path, data, params });
  console.log('======= WecomApiRequest ========>\n', { method, path, data, params, result: result.data }, '\n<===============================')
  if (result.data.errcode) {
    throw new BizError({
      errorCode: "wechat_api_error",
      errorReason: `企业微信接口调用失败！${result.data.errmsg}`
    });
  }
  return result.data
}

async function getAccessToken() {
  if (!accessTokenData || accessTokenData.expires_in < Date.now()) {
    accessTokenData = await request({ path: '/cgi-bin/gettoken', params: { corpid: corpId, corpsecret: corpSecret } });
    accessTokenData.expires_in = Date.now() + accessTokenData.expires_in * 1000;
  }
  return accessTokenData.access_token;
}

// 获取全量组织架构Id，
async function getDepartmentId() {
  let accessToken = await getAccessToken();
  return await request({
    method: 'GET',
    path: '/cgi-bin/department/list?access_token=' + accessToken
  });
}

// 根据组织架构Id获取部门信息
async function getUserInfoByDepartmentId(departmentId) {
  let accessToken = await getAccessToken();
  return await request({
    method: 'GET',
    path: '/cgi-bin/user/simplelist?access_token=' + accessToken + '&department_id=' + departmentId
  });
}





// 测试方法
(async () => {
  let config = {
    corpId: 'wwa5baaf514528f6cd',
    //预发布环境应用
    corpSecret: 'vQv5SX2o116KeBLNoitj-HeONZ0hBku2EA8JOhL1VJo',
    //企微通讯录的secret
    // corpSecret: 'tamP4aoM7eVTALIudssUnHLQaSBIH1iCuID1wkE77EU',
    agentId: '1000027',
    apiHost: 'https://qyapi.weixin.qq.com',
  }
  await initConfig(config);
  let accessToken = await getAccessToken();
  console.log('accessToken', accessToken, accessTokenData);

  let departMentIdList = await getDepartmentId();
  console.log('departMentIdList', departMentIdList)

  let allUserList = []
  //根据部门Id循环获取用户信息
  for (let item of departMentIdList.department) {
    let tempUserlist = await getUserInfoByDepartmentId(item.id)
    console.log('====tempUserlist.userlist====',tempUserlist.userlist)
    allUserList.push(...tempUserlist.userlist)
  }
  console.log('allUserList.length',allUserList.length)
  // console.log('allUserList',allUserList)

  //通过部门Id获取用户
  // let userInfolist = await getUserInfoByDepartmentId();
  // console.log('userInfolist', userInfolist)
  // console.log('userInfolist.userlist.length', userInfolist.userlist.length)

})
  ();

module.exports = {
  initConfig
  // sendMessage,
  // createAppchat,
  // updateAppchat,
  // sendAppchat
}

