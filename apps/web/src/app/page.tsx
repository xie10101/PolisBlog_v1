import { APP_NAME, type Post } from "@polisblog/shared";

const samplePost: Post = {
  id: "1",
  title: "欢迎来到 PolisBlog",
  slug: "welcome",
  summary: "monorepo 骨架已就绪",
  content: "全栈个人博客 + 个人知识库系统。",
  tags: ["intro"],
  status: "published",
  createdAt: "2026-08-17T00:00:00.000Z",
  updatedAt: "2026-08-17T00:00:00.000Z",
};

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <h1>{APP_NAME}</h1>
      <p>全栈个人博客 + 个人知识库（monorepo 骨架已就绪）。</p>
      <article>
        <h2>{samplePost.title}</h2>
        <p>{samplePost.summary}</p>
        <p>{samplePost.content}</p>
      </article>
    </main>
  );
}
