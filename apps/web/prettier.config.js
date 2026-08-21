// prettier.config.js
module.exports = {
  // 基础格式
  semi: true, // 使用分号
  singleQuote: true, // 使用单引号
  trailingComma: 'all', // 尾随逗号
  tabWidth: 2, // 缩进 2 空格
  printWidth: 80, // 每行最大 80 字符
  useTabs: false, // 使用空格而非 Tab

  // 对象/数组格式
  bracketSpacing: true, // 对象花括号间有空格 { a: 1 }
  bracketSameLine: false, // JSX 标签闭合括号换行
  arrowParens: 'avoid', // 箭头函数参数省略括号

  // 特殊语言支持
  plugins: ['prettier-plugin-tailwindcss'], // Tailwind 类名排序

  // 其他
  proseWrap: 'always', // Markdown 自动换行
  htmlWhitespaceSensitivity: 'css', // HTML 空格敏感度
};
