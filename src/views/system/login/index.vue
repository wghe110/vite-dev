<template>
  <div class="wrap-login">
    <section class="content" @keydown.enter="submitFn">
      <aside class="alert">
        <Alert :title="alert.title" :type="alert.type" v-model:visible="alert.visible" />
      </aside>

      <div class="inner-con">
        <img src="/logo.png" alt="" class="logo">
        <h1 class="logo-name">示例前端项目</h1>

        <el-form :model="form" :rules="rules" ref="formRef" label-width="0" style="width: 100%">
          <el-form-item label="租户名" prop="tenantAccount">
            <el-input v-model.trim="form.tenantAccount" autocomplete="off" placeholder="请输入租户名" :disabled="loading"
              style="width: 100%">
              <template #prefix>
                <el-icon>
                  <img src="@/assets/login/icon-4.svg" alt="" class="icon">
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model.trim="form.userName" autocomplete="off" placeholder="请输入用户名" :disabled="loading"
              style="width: 100%">
              <template #prefix>
                <el-icon>
                  <img src="@/assets/login/icon-3.svg" alt="" class="icon">
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passhword">
            <el-input v-model="form.passhword" autocomplete="off" placeholder="请输入密码" :disabled="loading" show-password
              auto-complete="new-password" style="width: 100%">
              <template #prefix>
                <el-icon>
                  <img src="@/assets/login/icon-2.svg" alt="" class="icon">
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="code">
            <el-input v-model.trim="form.code" autocomplete="off" placeholder="请输入验证码" class="code-input"
              :disabled="loading" style="width: 100%">
              <template #prefix>
                <el-icon>
                  <img src="@/assets/login/icon-1.svg" alt="" class="icon">
                </el-icon>
              </template>
              <template #suffix>
                <div class="box-code" v-loading="loadingCode" element-loading-spinner="el-icon-loading"
                  @click.stop="!loadingCode && getCodeFn()">
                  <img :src="code.url" alt="验证码" class="pic-code" />
                </div>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn-submit" :loading="loading"
              @click="!isSuccess && !loading && submitFn()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/apis/system/login";
import { encryptPassword } from "@/utils/tool";
import { formatLockedTime } from "./utils";
import rules from "./rules";
import Alert from "./Alert.vue";
import { ElMessageBox } from 'element-plus'
import globalStore from "@/store/modules/global";

import router from "@/router/index";

export default {
  components: {
    Alert,
  },
  data() {
    return {
      form: {
        tenantAccount: '',
        userName: "",
        passhword: "",
        code: "",
      },
      rememberMe: false,
      rules,
      loading: false,
      loadingCode: true,
      code: {
        Biyicaptchakey: "",
        url: "",
      },

      alert: {
        type: "error",
        title: "--",
        visible: false,
      },
      isSuccess: false,
    };
  },
  created() {
    this.getCodeFn();
    const store = globalStore();
    console.log(store)
    store.preload = false;
  },
  methods: {
    getCodeFn() {
      this.loadingCode = true;
      api
        .getCode()
        .then((res) => {
          if (!res || Object.keys(res).length === 0)
            return this.customerAlertFn({
              message: `获取验证码失败`,
            });

          this.code.Biyicaptchakey = Object.keys(res)[0];
          this.code.url = Object.values(res)[0];
        })
        .finally(() => {
          this.loadingCode = false;
        });
    },
    submitFn() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loginFn();
        }
      });
    },
    loginFn() {
      const headers = this.getHeadersFn();
      const params = this.getParamsFn();

      this.loading = true;
      api
        .login(params, headers)
        .then(this.loginSucFn)
        .catch(this.loginFailFn)
        .finally(() => {
          this.loading = false;
        });
    },
    loginSucFn(res) {
      const { userName, tenantAccount } = this.form;
      localStorage.setItem("userName", userName);
      localStorage.setItem("tenantAccount", tenantAccount);

      const { pswdStatus } = res;

      if (pswdStatus) {
        const msg =
          pswdStatus === 1
            ? "初始密码强度较弱，请修改后再重新登录！"
            : "密码已使用3个月，请修改后再重新登录！";

        return ElMessageBox.alert(msg, "修改密码", {
          confirmButtonText: "确定",
          showClose: false,
          callback: () => {
            router.replace({
              path: "/change-pwd",
              query: {
                userName,
                tenantAccount
              }
            });
          },
        });
      }

      this.isSuccess = true;

      const { token } = res;
      localStorage.setItem("token", token);

      this.customerAlertFn({
        type: "success",
        message: `登录成功`,
      });

      setTimeout(() => {
        router.replace("/");
      }, 300);
    },
    loginFailFn(err) {
      this.getCodeFn();

      const { status } = err;

      if (status === 401) {
        if (err.data.data.attempts) {
          return this.customerAlertFn({
            message: `登录失败，您还有 ${err.data.data.attempts} 尝试机会！`,
          });
        }

        const locktime = formatLockedTime(err.data.data.lockoutTime);
        return this.customerAlertFn({
          message: `登录失败，您的账号已被锁定，请在 ${locktime} 后重试！`,
        });
      }

      if (err.data && err.data.message) {
        if (err.data.message === 'error.null.null') {
          return this.customerAlertFn({
            message: '登录的用户名未注册，请确认后重填或联系管理员',
          });
        }

        return this.customerAlertFn({
          message: err.data.message,
        });
      }

      this.customerAlertFn({
        message: "登录失败，用户名或密码错误！",
      });
    },
    getHeadersFn() {
      const {
        form: { code },
        code: { Biyicaptchakey },
      } = this;

      return {
        Biyicaptchakey,
        Biyicaptcha: JSON.stringify({
          code,
        }),
      };
    },
    getParamsFn() {
      const {
        form: { tenantAccount, userName, passhword },
        rememberMe,
      } = this;

      return {
        rememberme: rememberMe ? "1" : "0",
        tenantAccount,
        username: userName,
        password: encryptPassword(passhword),
      };
    },
    customerAlertFn({ type = "error", message = "--" }) {
      this.alert.title = message;
      this.alert.type = type;
      this.alert.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-image: url("@/assets/login/bg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  >.content {
    width: 440px;
    min-height: 520px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-right: 8.33%;
    padding: 24px 60px 36px;
    position: relative;
    box-shadow: 0px 0px 100px 0px rgba(164, 180, 196, 0.3);
    animation: fadeIn .3s .3s both;

    >.inner-con {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      >.logo {
        width: 88px;
        margin-bottom: 6px;
      }

      >.logo-name {
        margin-bottom: 36px;
        margin-top: 0;
        font-size: 30px;
        line-height: 1.2;
        font-weight: 300;
      }
    }
  }

  .btn-submit {
    width: 100%;
    height: 48px;
    font-size: 14px;
    margin-top: 16px;
  }

  .pic-code {
    cursor: pointer;
    height: 38px;
    width: 114px;
  }

  .box-code {
    line-height: 0;
    margin-right: -10px;

    :deep(.el-loading-spinner) {
      margin-top: -8px;
    }
  }

  .alert {
    position: absolute;
    left: -2px;
    right: -2px;
    top: -2px;
  }

  // 自定义表单样式
  .code-input {
    :deep(.el-input__inner) {
      height: 40px;
      line-height: 40px;
    }
  }

  .icon {
    position: relative;
    left: 4px;
    width: 18px;
    height: 18px;
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-form-item__label) {
    overflow: hidden;
    padding: 0;
    height: 0;
  }

  :deep(.el-input__inner) {
    overflow: hidden;
    height: 44px;
    line-height: 44px;
  }

  :deep(.el-input-group__prepend) {
    padding: 0 14px;
  }

  :deep(.el-input__inner) {
    padding: 0 7px;
  }

  :deep(.el-input-group__append) {
    padding: 0;
  }

  :deep(.el-form-item.is-error) {

    .el-input-group__prepend,
    .el-input-group__append {
      border-color: #f56c6c;
    }
  }
}
</style>