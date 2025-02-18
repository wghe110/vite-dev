export default {
  tenantAccount: [
    { required: true, message: "请输入租户名", trigger: "blur" },
  ],
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  passhword: [{ required: true, message: "请输入密码", trigger: "blur" }],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    {
      pattern: /^[^\u4E00-\u9FFF]+$/g,
      message: "验证码不允许存在中文",
      trigger: "blur"
    }],
}