# Flow Titration Portal

这是一个基于 `Next.js + PostgreSQL` 的自托管流式滴定数据平台，支持：

- 账号登录与角色权限
- 访客只读查询
- 管理员管理抗体滴定记录
- 管理员上传、替换、删除滴定结果图片

## 技术栈

- Next.js 16
- React 19
- Prisma
- PostgreSQL
- Docker Compose

## 环境变量

复制 `.env.example` 为 `.env`，并按实际部署修改：

```bash
cp .env.example .env
```

关键变量：

- `DATABASE_URL`
- `AUTH_SECRET`
- `APP_URL`
- `UPLOAD_DIR`

## 本地开发

1. 启动 PostgreSQL

```bash
docker compose up -d db
```

2. 安装依赖

```bash
npm install
```

3. 生成 Prisma Client 并执行迁移

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

4. 创建首个管理员

先生成密码哈希：

```bash
npm run hash-password -- your-admin-password
```

然后手工写入数据库，例如：

```sql
INSERT INTO users (id, username, password_hash, role, status, created_at, updated_at)
VALUES (
  'admin-bootstrap',
  'admin',
  '<上一步生成的哈希>',
  'ADMIN',
  'ACTIVE',
  NOW(),
  NOW()
);
```

5. 导入现有 Excel 数据与图片

```bash
npm run import:flow
```

6. 启动开发服务器

```bash
npm run dev
```

## 生产部署

使用单服务器自托管方式：

```bash
docker compose up --build -d
```

说明：

- `web` 服务运行 Next.js 应用
- `db` 服务运行 PostgreSQL
- `storage/uploads` 作为图片持久化目录挂载

## 数据导入说明

- `Flow titration data.xlsx` 仅作为首次导入来源
- `assets/flow-titration-images` 中的已提取图片会按当前记录顺序导入
- 导入后数据库成为唯一数据真源
