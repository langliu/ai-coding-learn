declare module 'bun' {
  interface Env {
    /** OpenAI API 密钥 */
    OPENAI_API_KEY: string
    /** OpenAI 兼容服务基础路径 */
    OPENAI_API_BASE_URL: string
    /** OpenAI 模型 */
    OPENAI_MODEL: string
    /** OpenAI 嵌入模型 */
    OPENAI_EMBEDDING_MODEL: string
  }
}
