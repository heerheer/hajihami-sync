declare global {
  namespace NodeJS {
    interface ProcessEnv {
      D1: D1Database;
    }
  }
}

// 确保此文件成为模块
export {}
