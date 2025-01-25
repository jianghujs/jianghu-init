/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "loginV4", table: "_user", pageName: "登录", version: "v3", jhMenu: false,
  includeList: [
    "{% include 'utility/jianghuJs/prepareDeviceIdV4.html' %}"
  ],
  pageContent: [
    /*html*/`
      <v-row class="align-center" style="height: 100vh">
        <v-col cols="12" align="center">
          <div class="mb-10 text-h7 font-weight-bold success--text"><$ ctx.app.config.appTitle $></div>
          <v-card class="login-form-card pa-8 mb-20">
            <v-card-text class="pa-0">
              <div class="title">登录您的账户</div>
              <v-form ref="loginForm" lazy-validation>
                <!-- 表单 [注：登录表单包含密码输入框，chrome密码自动填充的时候会与vuetify的v-input组件样式冲突，使用原生input避免冲突] -->
                <v-row class="my-0">
                  <v-col cols="12">
                    <input class="jh-cus-input" v-model="userId" placeholder="用户名"/>
                  </v-col>
                  <v-col cols="12">
                    <div class="password-wrapper">
                      <input
                        class="jh-cus-input"
                        v-model="password"
                        :type="isPasswordShown ? 'text' : 'password'"
                        data-type="password"
                        @keyup.enter.exact="doUiAction('login')"
                        placeholder="密码"
                      />
                      <v-icon @click="isPasswordShown = !isPasswordShown" small class="mdi-eye">{{isPasswordShown ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}}</v-icon>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox class="jh-v-input" dense single-line filled v-model="isRememberPassword" color="success" label="记住密码"/>
                  </v-col>
                </v-row>
                <!-- 操作按钮 -->
                <v-row class="my-0 px-3">
                  <v-btn block color="success" @click="doUiAction('login')" small>登录</v-btn>
                  <v-btn v-if="isWXEnv" class="mt-2" block @click="toWXLoginUrl">
                    <v-icon color="primary" class="mr-2">mdi-wechat</v-icon>
                    微信登录
                  </v-btn>
                  <div v-if="isWXEnv" class="mt-1 flex items-center text-sm">
                    微信尚未绑定账号？去
                    <v-btn class="!px-1" small text @click="toBindAccount">绑定账号</v-btn>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="loading" v-if="loading && isWXEnv">
        <div>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
          <div>{{tip}}</div>
        </div>
      </div>
    `
  ],
  common: {
    data: {
      userId: '',
      password: '',
      isPasswordShown: false,
      isRememberPassword: true,
      loading: false,
      isWorkWechat: true,
      isAutoLogin: false,
      tip: '',
      loading: false
    },
    computed: {
      isWXEnv() {
        let ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') !== -1;
      }
    },
    async mounted() {
      this.loading = false;
      const urlParams = new URLSearchParams(location.search);

      this.doUiAction('getUrlObj');

      if (this.isAutoLogin && this.isAutoLogin == "true") {
        this.toWecomOauthUrl();
        return;
      }

      // code登录
      if (urlParams.get('code')) {
        this.doUiAction('wxLogin');
      }
    },
    doUiAction: {
      getUrlObj: ['getUrlObj'],
      login: ['prepareLoginData', 'doLogin', 'setLocalStorage', 'redirectToPreLoginURL'],
      wxLogin: ['prepareLoginData', 'wxLogin'],
    },
    methods: {

      toWXLoginUrl() {
        let currentUrl = location.href.split('?')[0]
        // appId, wxAuthUrlPrefix, authUrl
        const appId = '<$ ctx.app.config.wechat.appId $>'
        const wxAuthUrlPrefix = '<$ ctx.app.config.wechat.wxAuthUrlPrefix $>'
        location.replace(`${wxAuthUrlPrefix}?appid=${appId}&redirect_uri=${encodeURIComponent(currentUrl)}&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect`);
      },
      async wxLogin() {
        this.tip = '微信登录中...'
        this.loading = true
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code')
        try {
          const resultData = (await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'login',
                actionId: 'wxLogin',
                actionData: { code, deviceId: this.deviceId },
              }
            }
          })).data.appData.resultData;
          this.loginResult = resultData;

        } catch (error) {
          console.error(error);
          setTimeout(() => {
            this.loading = false;
            this.tip = '';
          }, 1000);
        }
      },
      // ---------- getUrlObj uiAction >>>>>>>>>> --------
      async getUrlObj() {
        const urlObj = new URLSearchParams(location.search);

        if (urlObj.get('errorReason')) {
          window.vtoast.fail(urlObj.get('errorReason'));
        }

        this.redirectUrl = urlObj.get('redirectUrl');

        let transformRedirectUrl = decodeURIComponent(this.redirectUrl)
        // 使用正则获取isAutoLogin的值
        var regex = /[?&]isAutoLogin(=([^&#]*)|&|#|$)/;
        var results = regex.exec(transformRedirectUrl);
        if (!results || !results[2]) {
          this.isAutoLogin = null;
        } else {
          this.isAutoLogin = decodeURIComponent(results[2].replace(/\+/g, " "));
        }
      },
      // ---------- <<<<<<<<<<< getUrlObj uiAction  --------

      // ---------- login uiAction >>>>>>>>>> --------
      async prepareLoginData() {
        this.deviceId = window.deviceId;
        this.userId = _.replace(this.userId, /\s+/g, '');;
        this.password = _.toString(this.password);
      },
      async doLogin() {
        try {
          const resultData = (await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'login',
                actionId: 'passwordLogin',
                actionData: {
                  userId: this.userId,
                  password: this.password,
                  deviceId: this.deviceId
                },
              }
            }
          })).data.appData.resultData;
          this.loginResult = resultData;

          window.vtoast.success('登录成功');
        } catch (error) {
          const { errorCode, errorReason } = error || {};
          if (errorCode) {
            window.vtoast.fail(errorReason);
            throw new Error("登录失败", { errorCode, errorReason });
          } else {
            window.vtoast.fail('登录失败');
            throw new Error("登录失败");
          }
        }
      },
      async setLocalStorage() {
        localStorage.setItem(`${window.appInfo.authTokenKey}_authToken`, this.loginResult.authToken);
        localStorage.setItem(`${window.appInfo.authTokenKey}_userId`, this.loginResult.userId);
        localStorage.setItem(`${window.appInfo.authTokenKey}_deviceId`, this.deviceId);
      },
      async redirectToPreLoginURL() {
        let redirectTo = `/${window.appInfo.appId}`;
        if (this.redirectUrl) {
          redirectTo = decodeURIComponent(this.redirectUrl);
        }
        window.location.href = redirectTo;
      },
      // ---------- <<<<<<<<<<< login uiAction  --------
      toBindAccount() {
        window.location.href = '/system/page/bindWx';
      }
    }
  },
  style: /*css*/`
    .login-form-card {
      width: 400px;
    }

    /* ---------- 输入框 >>>>>>>>>> -------- */
    .jh-cus-input {
      border: 1px solid rgba(0, 0, 0, .06);
      width: 100%;
      height: 32px;
      border-radius: 6px;
      padding: 0 12px;
      color: #5E6278 !important;
      outline: none;
      font-size: 13px !important;
    }

    .jh-cus-input:focus,
    .jh-cus-input:focus-visible,
    input:focus-visible {
      border: thin solid #4caf50 !important;
    }

    /* ---------- <<<<<<<<<<< 输入框 -------- */

    /* ---------- 密码框 >>>>>>>>>> -------- */
    .password-wrapper {
      position: relative;
    }

    .password-wrapper .mdi-eye {
      position: absolute;
      right: 8px;
      top: 8px;
    }

    /* ---------- <<<<<<<<<<< 密码框 -------- */


    .loading {
      pointer-events: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 100%;
      height: 100%;
      background-color: rgb(49 49 49 / 58%);
      text-align: center;
    }
    .loading > div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 153px;
      /* background: rgba(255, 255, 255, 83%); */
      background: #4c4c4c;
      color: white;
      border-radius: 10px;
    }
    .loading .v-progress-circular {
      margin-top: 40px;
      margin-bottom: 20px;
    }
  `
}

module.exports = content;