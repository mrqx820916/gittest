// 手机号验证
export const isPhone = (value) => {
  return /^1[3-9]\d{9}$/.test(value)
}

// 邮箱验证
export const isEmail = (value) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}

// 密码验证（至少6位，包含数字和字母）
export const isPassword = (value) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
}

// 身份证号验证
export const isIdCard = (value) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

// 金额验证（最多两位小数）
export const isAmount = (value) => {
  return /^(([1-9]\d*)|\d)(\.\d{1,2})?$/.test(value)
}

// 表单验证规则
export const rules = {
  phone: [
    { required: true, message: '请输入手机号' },
    { validator: isPhone, message: '手机号格式不正确' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { validator: isEmail, message: '邮箱格式不正确' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { validator: isPassword, message: '密码必须包含数字和字母，且不少于6位' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号' },
    { validator: isIdCard, message: '身份证号格式不正确' }
  ],
  amount: [
    { required: true, message: '请输入金额' },
    { validator: isAmount, message: '金额格式不正确' }
  ]
} 