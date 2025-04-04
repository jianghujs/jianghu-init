/* eslint-disable */
const content = {
    pageType: "jh-page", pageId: "loginV4", table: "_user", pageName: "登录",
    pageHook: {

    },
    resourceList: [],
    includeList: [
      "{% include 'utility/jianghuJs/prepareDeviceIdV4.html' %}"
    ],
    headContent: [

    ],
    pageContent: [
      /*html*/`
      <v-row class="align-center" style="height: 100vh">
      <v-col cols="12" align="center">
        <div class="mb-10 text-h7 font-weight-bold primary--text"><$ ctx.app.config.appTitle $></div>
        <v-card class="login-form-card pa-8">
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
                <v-col cols="12" v-if="captchaSvg">
                  <div class="captcha-wrapper">
                    
                    <div 
                      class="captcha-image" 
                      @click="getCaptcha" 
                      title="点击刷新验证码"
                    >
                      <img :src="captchaSvg" class="captcha-img" alt="验证码" />
                    </div>
                    <input
                      class="jh-cus-input captcha-input"
                      v-model="captchaCode"
                      type="text"
                      placeholder="请输入左边的算数答案"
                    />
                    <div class="captcha-change  cursor-pointer primary--text" @click="getCaptcha">
                      换一个
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-checkbox class="jh-v-input" dense single-line filled v-model="isRememberPassword" color="primary" label="记住密码"/>
                </v-col>
              </v-row>
              <!-- 操作按钮 -->
              <v-row class="my-0 px-3">
                <v-btn block color="primary" @click="doUiAction('login')" small>登录</v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
      `
    ],
    common: {
        data: {
            userId: '',
            password: '',
            isPasswordShown: false,
            isRememberPassword: true,

            // 验证码
            enableLoginCaptcha: false,
            captchaCode: '',
            captchaSvg: ''
        },
        mounted() {
            this.enableLoginCaptcha = '<$ ctx.app.config.jianghuConfig.enableLoginCaptcha $>' == 'true';
            this.doUiAction('getUrlObj');
            this.doUiAction('getCaptcha');
        },
        methods: {
            async doUiAction(uiActionId, uiActionData) {
                switch (uiActionId) {
                    case 'getUrlObj':
                        await this.getUrlObj();
                        break;
                    case 'getCaptcha':
                        await this.getCaptcha();
                        break;
                    case 'login':
                        await this.prepareLoginData();
                        await this.doLogin();
                        await this.setLocalStorage();
                        await this.redirectToPreLoginURL();
                        break;
                    default:
                        console.error("[doUiAction] uiActionId not find", { uiActionId });
                        break;
                }
            },

            // ---------- getUrlObj uiAction >>>>>>>>>> --------
            async getUrlObj() {
                const urlObj = new URLSearchParams(location.search);

                if (urlObj.get('errorReason')) {
                    window.vtoast.fail(urlObj.get('errorReason'));
                }

                this.redirectUrl = urlObj.get('redirectUrl');
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
                                    captchaCode: this.captchaCode,
                                    deviceId: this.deviceId
                                },
                            }
                        }
                    })).data.appData.resultData;
                    this.loginResult = resultData;

                    window.vtoast.success('登录成功');
                } catch (error) {
                    this.getCaptcha();
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
            async getCaptcha() {
                if (!this.enableLoginCaptcha) {
                    return;
                }
                const result = await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'login',
                            actionId: 'getLoginCaptcha',
                            actionData: {
                                deviceId: window.deviceId
                            }
                        }
                    }
                });
                let captchaSvg = result.data.appData.resultData;
                if (captchaSvg) {
                    this.captchaSvg = captchaSvg;
                    this.captchaCode = '';
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
            }
            // ---------- <<<<<<<<<<< login uiAction  --------
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
        border: thin solid var(--cPrimaryColor) !important;
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
    
      /* ---------- 验证码 >>>>>>>>>> -------- */
      .captcha-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .captcha-input {
        flex: 1;
      }
      .captcha-image {
        width: 100px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 4px;
        overflow: hidden;
      }
      .captcha-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      /* ---------- <<<<<<<<<<< 验证码 -------- */
    `
}

module.exports = content;