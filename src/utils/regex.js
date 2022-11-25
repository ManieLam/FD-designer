/* 正则表达式
* TODO 配置信息转移到服务端 */
// import { regexps } from 'anso-ui'

export default {
  // 英文和数字
  enAndNumber: { regex: /^[A-Za-z0-9]+$/, label: '支持英文和数字', name: 'enAndNumber' },
  // 仅支持数字（不包括小数点）
  int: { name: 'int', label: '支持整数', regex: /^[0-9]+$/ },
  // 正数、负数、和小数
  number: { name: 'number', label: '支持正/负/小数', regex: /^(-|\+)?\d+(\.\d+)?$/ },
  // 支持整数和保留两位的小数
  moneyFixTwo: { name: 'moneyFixTwo', label: '支持整数或保留两位小数', regex: /^0*(\.0{1,2})?$|^\d{1,13}(\.\d{1,2})?$/ },
  // 支持数字，小数点
  // money: { name: 'money', label: '', regex: /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/ },
  // 支持正负整数
  pnNum: { name: 'pnNum', label: '支持正负整数', regex: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/ },
  // 手机号码
  mobile: { name: 'mobile', label: '支持移动电话', regex: /^(1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8})?$/ },
  // 座机
  phone: { name: 'phone', label: '支持座机（xxxx-xxxxxxx）', regex: /^0\d{2,3}-?\d{7,8}$/ },
  // 支持座机和手机号码
  mobilePhone: { regex: /^(((0\d{2,3}|8\d{2,3})-\d{7,8})|(1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}))$/, label: '支持座机和手机号码', name: 'mobilePhone' },
  // 邮箱
  email: { regex: /^([a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6})?$/, label: '支持邮箱', name: 'email' },
  companyEmail: { regex: /@\w+([-.]\w+)*\.[a-zA-Z0-9]{2,6}?$/, label: '支持企业邮箱', name: 'companyEmail' }, // 企业邮箱暂不需要对@前做验证
  // 空格
  space: { regex: /^[^ ]+$/, label: '不允许空格', name: 'space' },
  // 银行账号
  bank: { regex: /^([1-9]{1})(\d{15}|\d{18})$/, label: '支持银行账号', name: 'bank' },
  // 身份证
  identityCard: { regex: /(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, label: '支持身份证', name: 'identityCard' },
  // 军官证
  officerCard: { regex: /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/, label: '支持军官证', name: 'officerCard' },
  // 护照：E03497615
  passPortCard: { regex: /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/, label: '支持护照', name: 'passPortCard' },
  // 营业执照：91330212MA2AG46J1L
  bussinessCard: { regex: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/, label: '支持营业执照', name: 'bussinessCard' },
  // 港澳居民往来内地返乡证
  MTPFHKAMR: { regex: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/, label: '支持港澳居民往来内地返乡证', name: 'MTPFHKAMR' },
  // 台湾居民往来大陆通行证
  MTPFTR: { regex: /^([0-9]{10}|[0-9]{8})$/, label: '支持台湾居民往来大陆通行证', name: 'MTPFTR' },
  // 中文、日文、韩文
  Chiness: { regex: /[\u4E00-\u9FA5\uF900-\uFA2D]/, label: '支持中文、日文、韩文', name: 'Chiness' },
  // 不允许中文
  noChiness: { regex: /^[^\u4E00-\u9FA5\uF900-\uFA2D]+$/, label: '不允许中文', name: 'noChiness' },
  // 中文数字英文
  onlyChinessNumEng: { regex: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, label: '支持中文数字英文', name: 'onlyChinessNumEng' },
  // 标点符号
  punctuation: { regex: /^[^ %&',;=?$\x22]+$/, label: '不允许标点符号', name: 'punctuation' }
}
