/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "bindMfaApp", pageName: "MFA多因子认证绑定",
  pageHook: {

  },
  resourceList: [
    /**
     * bindMfaApp	getSecretKey	✅获取MFA密钥和二维码	service	{}	{"service": "mfaService", "serviceFunction": "getSecretKey"}
bindMfaApp	verifyMfaCode	✅验证MFA验证码	service	{}	{"service": "mfaService", "serviceFunction": "verifyMfaCode"}
     */
    {
      actionId: "getSecretKey",
      resourceType: "service",
      desc: "✅获取MFA密钥和二维码",
      resourceData: { service: "mfaService", serviceFunction: "getSecretKey" }
    },
    {
      actionId: "verifyMfaCode",
      resourceType: "service",
      desc: "✅验证MFA验证码",
      resourceData: { service: "mfaService", serviceFunction: "verifyMfaCode" }
    }

  ],
  includeList: [
    "{% include 'component/mfaVerification.html' %}"
  ],
  headContent: [

  ],
  pageContent: [
    {
      tag: 'v-col',
      value: /*html*/`
          <v-card class="pa-6 elevation-2">
            <v-card-title class="justify-center">
              <h2 class="text-h5 font-weight-bold">绑定Microsoft Authenticator</h2>
            </v-card-title>
            
            <v-card-text>
              <!-- 步骤说明 -->
              <v-stepper v-model="currentStep" vertical>
                <v-stepper-step :complete="currentStep > 1" step="1">
                  获取二维码
                  <small>生成您的专属二维码</small>
                </v-stepper-step>
                
                <v-stepper-content step="1">
                  <div class="text-center mb-4">
                    <v-btn 
                      color="primary" 
                      :loading="isLoadingQR"
                      @click="doUiAction('getSecretKey')"
                      v-if="!qrCodeData.challengeId"
                    >
                      生成二维码
                    </v-btn>
                    
                    <!-- 二维码显示区域 -->
                    <div v-if="qrCodeData.challengeId" class="mt-4">
                      <div class="qr-code-container text-center">
                        <img :src="qrCodeData.qrCodeImage" alt="MFA绑定二维码" style="max-width: 200px;">
                      </div>
                      <v-alert type="info" class="mt-4">
                        <div><strong>请在Microsoft Authenticator中扫描此二维码</strong></div>
                        <div class="mt-2">或者手动输入密钥：{{ qrCodeData.manualKey || '正在生成...' }}</div>
                      </v-alert>
                      
                      <!-- 刷新按钮 -->
                      <v-btn 
                        color="warning" 
                        outlined 
                        small 
                        @click="doUiAction('refreshQRCode')"
                        class="mt-2"
                      >
                        刷新二维码
                      </v-btn>
                    </div>
                  </div>
                  
                  <v-btn 
                    color="primary" 
                    @click="currentStep = 2" 
                    :disabled="!qrCodeData.challengeId"
                  >
                    下一步
                  </v-btn>
                </v-stepper-content>

                <v-stepper-step :complete="currentStep > 2" step="2">
                  验证绑定
                  <small>输入APP生成的验证码</small>
                </v-stepper-step>
                
                <v-stepper-content step="2">
                  <!-- MFA验证组件 -->
                  <mfa-verification-component
                    :challenge-id="qrCodeData.challengeId"
                    page-id="bindMfaApp"
                    action-id="verifyMfaCode"
                    submit-button-text="验证并绑定"
                    @verification-success="onMfaSuccess"
                    @verification-failed="onMfaFailed"
                    @challenge-expired="onNeedRefresh"
                    @max-retry-exceeded="onNeedRefresh"
                    @timer-expired="onNeedRefresh"
                    @system-error="onMfaFailed"
                  ></mfa-verification-component>
                  
                  <v-btn text @click="currentStep = 1" class="mr-4">
                    返回上一步
                  </v-btn>
                </v-stepper-content>

                <v-stepper-step :complete="bindingSuccess" step="3">
                  绑定完成
                  <small>MFA已成功绑定</small>
                </v-stepper-step>
                
                <v-stepper-content step="3" v-if="bindingSuccess">
                  <v-alert type="success">
                    <div class="text-h6">🎉 绑定成功!</div>
                    <div class="mt-2">您的账户已成功绑定Microsoft Authenticator多因子认证。</div>
                    <div class="mt-2 text-caption">2秒后将自动跳转到登录页面...</div>
                  </v-alert>
                  
                  <v-btn color="primary" @click="goToLogin">
                    立即前往登录页面
                  </v-btn>
                </v-stepper-content>
              </v-stepper>
            </v-card-text>
          </v-card>
        `
    }
  ],
  common: {
    data: {
      currentStep: 1,
      isLoadingQR: false,
      qrCodeData: {
        challengeId: null,
        qrCodeImage: null,
        manualKey: null
      },
      bindingSuccess: false,
      isHelpPageDrawerShown: false,
      isHelpPageDrawerLoaded: false,
      breadcrumbs: [
        { text: '首页', disabled: true },
        { text: 'MFA绑定', disabled: true }
      ]
    },
    async mounted() {
      console.log("bindMfaApp页面初始化");
      // 自动开始获取二维码
      await this.doUiAction('getSecretKey');
    },
    doUiAction: {
      getSecretKey: ['getSecretKey'],
      refreshQRCode: ['refreshQRCode'],
      handleMfaSuccess: ['handleMfaSuccess'],
      handleMfaFailed: ['handleMfaFailed'],
      handleNeedRefresh: ['handleNeedRefresh'],
    },
    methods: {
      /**
       * 获取用户的secretKey，生成二维码
       */
      async getSecretKey() {
        this.isLoadingQR = true;

        try {
          await window.jhMask.show();
          await window.vtoast.loading("生成二维码中...");

          const userId = localStorage.getItem(`${window.appInfo.appId}_userId`); // 从localStorage获取userId

          const result = (await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'bindMfaApp',
                actionId: 'getSecretKey',
                actionData: { userId }
              }
            }
          })).data.appData.resultData;

          await window.jhMask.hide();

          if (result.success) {
            this.qrCodeData = {
              challengeId: result.challengeId,
              qrCodeImage: result.qrCodeImage,
              manualKey: result.secretKey
            };
            await window.vtoast.success("二维码生成成功");
          } else {
            if (result.errorType === 'ALREADY_BOUND') {
              await window.vtoast.fail(result.message || '用户已经绑定MFA');
            } else {
              await window.vtoast.fail(result.message || '获取二维码失败');
            }
          }
        } catch (error) {
          console.error('获取二维码失败:', error);
          await window.jhMask.hide();
          await window.vtoast.fail('系统错误，请稍后重试');
        } finally {
          this.isLoadingQR = false;
        }
      },

      /**
       * 刷新二维码
       */
      async refreshQRCode() {
        // 重置数据
        this.qrCodeData = {
          challengeId: null,
          qrCodeImage: null,
          manualKey: null
        };
        this.currentStep = 1;
        this.bindingSuccess = false;
      },

      /**
       * MFA验证成功处理
       */
      async handleMfaSuccess(result) {
        this.bindingSuccess = true;
        this.currentStep = 3;
        await window.vtoast.success('MFA绑定成功！');

        // 2秒后自动跳转到登录页面
        setTimeout(() => {
          this.goToLogin();
        }, 2000);
      },

      /**
       * MFA验证失败处理
       */
      async handleMfaFailed(error) {
        console.error('MFA验证失败:', error);
        await window.vtoast.fail('验证失败，请重试');
      },

      /**
       * 需要刷新二维码处理
       */
      async handleNeedRefresh() {
        if (await window.confirmDialog({
          title: "提示",
          content: "验证码已过期或超过重试次数，需要刷新二维码重新绑定？"
        })) {
          await this.doUiAction('refreshQRCode');
        }
      },

      /**
       * 前往登录页面（执行登出操作）
       */
      async goToLogin() {
        try {
          await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'allPage',
                actionId: 'logout'
              }
            }
          });
          this.routeToLoginPage();
        } catch (error) {
          this.routeToLoginPage();
        }
      },

      // 导航到登陆页
      routeToLoginPage() {
        localStorage.removeItem(`${window.appInfo.authTokenKey}_authToken`);
        setTimeout(() => {
          location.href = '<$ ctx.app.config.loginPage $>';
        }, 700);
      },

      // ========== 组件事件处理器 ==========
      onMfaSuccess(result) {
        this.doUiAction('handleMfaSuccess', result);
      },

      onMfaFailed(error) {
        this.doUiAction('handleMfaFailed', error);
      },

      onNeedRefresh() {
        this.doUiAction('handleNeedRefresh');
      }
    }
  },
  style: /*css*/``
}

module.exports = content;