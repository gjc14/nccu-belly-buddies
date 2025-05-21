# BellyBuddy

## Structure

- **Framework**: React Router v7 (TypeScript + Node.js)
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Style**: [tailwindcss](https://tailwindcss.com/)
- **UI LIbrary**: [shadcn/ui](https://ui.shadcn.com/)
- **Email SDK**: [Resend](https://resend.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Text Editor**: [Tiptap](https://tiptap.dev/)

## Explanations

### React Router v7

這個是個 React 全端框架，提供兩個伺服器端的函數：

1. `loader()`
2. `action()`

處理來自前端或任何地方的
[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)。所以呢，要建立一個 route 有兩步驟：

1. 在某個地方建立一個
   `blablabla.ts`（如果單純是 api 而沒有 html 檔案的話，例如：`app/routes/auth.ts`） or
   `blablabla.tsx`（如果你需要在 TypeScript 中撰寫
   `<HTMX>`，例如：`app/routes/web/layout.tsx`）
2. 然後在 `app/routes.ts`（記住是檔案）裡面照格式加入
   `route('/route-in-browser', './your/blablabla.ts')`

接著詳細說說這兩個 functions

1. `loader()` 這個 function，通常會使用 `async function loader() {}` 而不是直接
   `function loader() {}`，因為從資料庫取得資料是「非同步的」，也就是你的 function 1.「從資料庫取得資料」跟 2.「返回 Response」不能同步處理，因為你必須等待資料庫回傳資料才有資料，在 Python 中預設就是 async 的沒有問題，但因為 JavaScript 原本是設計給「前端」應用程式，沒有先後問題，所以通常不會有需要等待。
2. `action()` 是 React Router v7 提供的第二個重要伺服器端函數，與 `loader()`
   相對應，主要用於處理非 `GET` 請求的 HTTP 方法：

   - POST (add)
   - PUT (update)
   - DELETE
   - PATCH (部分更新)

   回應格式：每個伺服器都需要有 Respond，如果是伺服器通常會是
   `return Response.json({}, {})`，第一個 param 放入你要回傳的 object，第二個是 Response
   options 例如 response code。但是 RRv7 也可以直接回傳一個 object
   `{}`，這樣在前端就不用再次處理 `Date()`（使用 `json` 的話 `Date()` 會變成
   `string`，在前端需要轉換成 `Date()`）。

### File Structure

```plaintext
.
├── app/                    # 主要應用程式程式碼
│   ├── components/         # 共用的 React component 例如 ui/*, editor
│   ├── lib/                # 共用的 library 例如 auth, db
│   │   ├── db/             # 從資料庫 CRUD 的 functions，先寫好就可以直接在 loader action 直接調用
│   │   │   └── schema.ts   # Drizzle 資料庫結構定義
│   │   └── utils/          # 工具們 debounce, email, seo
│   ├── routes/             # 路由定義 (React Router v7)
│   │   ├── web/            # 前台網站相關路由與頁面
│   │   ├── papa/           # 後台管理介面相關路由與頁面
│   │   └── auth.ts         # Better Auth 用的，具體 route 到 http://localhost:5173/auth
│   └── routes.ts           # route 設定檔
├── public/                 # 公開靜態檔案 (例如：favicon.ico)。例如可以直接前往 http://localhost:5173/logo.png
├── script/                 # 放一些執行 `npm run` 時跑的 script
├── .env.example            # 環境變數範例檔
├── package.json            # 這個 application 用到的所有 dependencies
├── tsconfig.json           # TypeScript 設定檔
└── README.md               # 就是這個檔案！
```

### Authentication

<!-- - The document `app/routes/auth.ts` is where all auth api functionalities
  resides. Better-Auth manages all, it exports useful functions like `signin()`
  or `signout()`. -->
<!-- - In RRv7 (React Router v7), `async loader()` is a function for responding `GET`
  request, where as `async action()` is going to responde to all other HTTP
  requests like `POST`(add), `PUT`(update), `DELETE`. For example, you enter the
  cart page, the browser page sends a `GET` request and you sees all products
  you want, later when you remove Bueno chocolete from your cart, the second you
  press, the browser sents a `PUT` request to request a modify in the database. -->

- 檔案 `app/routes/auth.ts`
  儲存所有身份驗證 api 功能，但我們使用 Better-Auth 處理，他有所有需要用到的 api
  handles 像是「`signin()`、`signout()`」之類的。
- RRv7 中，HTTP methods 分成 loacer `GET` 跟 action (`POST`(add/insert),
  `PUT`(update), `DELETE`) 兩個 server handle，在頁面第一次渲染/出現時會呼叫
  `GET`，之後在例如按鈕、表單，可能會傳送其他的 `POST`, `PUT`, `DELETE`
  之類的其他 method 到後端，舉例來說，我們進到購物車頁面，第一個 `GET`
  會回傳所有資料與頁面 Layout，而當你點擊移除不想吃的 Bueno 巧克力時，這個按鈕會傳送一個
  `PUT` 到伺服器請求（Request）從資料庫刪除 Bueno 巧克力。

#### Authentication Concept & Process

1. 點擊登入按鈕 -> 傳送 user and password 到伺服器
2. 伺服器檢查是否正確
3. 確認使用者資料並將登入資訊儲存到伺服器端的記憶體或儲存（Better-Auth 直接存到 PostgreSQL）中 Session，同時使用 Session 的 id 建立 Cookie 後放在 Header
4. 前端收到 response（包含 Cookie）的 Header
5. 未來只要 Cookie 沒被刪除，伺服器就只要對 Cookie 跟 Session 資料就可以確認身份
   [Better-Auth Session Cookie](https://www.better-auth.com/docs/concepts/session-management#session-table)
   [RRv7 Sessions and Cookies Docs](https://reactrouter.com/explanation/sessions-and-cookies)
   [Remix Cookies Explained](https://www.youtube.com/watch?v=ivmumaIZrJM)

身份驗證呢有兩種方式，分為前後端，前端 `authClient.blablabla()`
這個 function 所可以調用的所有 functions 其實就是發送 requests 到伺服器，具體路徑是在
`app/routes/papa/auth` 檔案的 `handleSignIn()`（在 `app/routes.ts`
裡面有設定路徑對應到的檔案）；但是如果是在 server 端（loader、action）裡面會需要使用
`auth.api.blablabla()`，因為前端是無法使用 `auth.api`
的，避免沒有權限的人去修改其他人的資料。這個 `auth.api`
會執行所有真的重要的動作，例如直接在資料庫刪除使用者、直接新增使用者。

### Database & Drizzle

這個專案用的是 [PostgreSQL](https://www.postgresql.org/) 資料庫，加上
[Drizzle](https://orm.drizzle.team/)
作為 ORM，從 Drizzle 出來的資料就會有 TypeScript
types 而不用再自己定義這筆從伺服器來的資料的樣貌。然後雖然助教上課教的都是在自己電腦架設資料庫，但為了開發方便我們就直接用
[neon](https://neon.tech/) 這個已經幫你部署好的線上 PostgreSQL。

#### 定義範例：

資料庫定義有兩個步驟：

1. 在 `app/lib/db/schema` 裡面加入資料庫 relations 定義，包含 attribute types
   and constraints and indexes；
2. 把剛剛新增的檔案，從 `app/lib/db/schema/index.ts`
   統一會出！這樣在其他地方匯入會比較清楚；
3. 在終端機執行 `npm run db:push`
   把資料庫結構推上去 PostgreSQL，這樣在資料庫就會是我們定義的這個格式了！

```ts
// app/lib/db/schema/posts.ts
export const postsTable = pgTable('posts', {
	id: serial('id').primaryKey(), // id 會自動增加，是一個數字 (serial)，是 primary key
	createdAt: timestamp('created_at').notNull().defaultNow(), // 預設是現在，建立日期當然 not null
	updatedAt: timestamp('updated_at') // 當新增的時候使用 new Date() 作為時間戳
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	slug: varchar('slug').notNull().unique(), // 這篇文章的...蛞蝓？？？就是指向這篇文的唯一網址，通常會用 title 產生，例如 This Is My First Post，slug 就是 this-is-my-first-post
	title: varchar('title').notNull(),
	content: text('content'), // 內文
	excerpt: varchar('excerpt'), // 簡介
	featuredImage: varchar('featured_image'),
	status: varchar('status', { length: 50 }).notNull(), // 發佈狀態

	authorId: text('author_id').references(() => user.id, {
		onDelete: 'set null', // 當 user 被刪除的時候，文章不要跟著被刪掉，如果要跟著刪除，使用 'cascade'
	}),
})
```

#### 使用範例：

先在 `app/lib/db/seo.server.ts` 寫好：

```ts
// app/lib/db/seo.server.ts
import { db } from './db.server'

// ... 其他 import

export const getSEO = async (route: string): Promise<{ seo: Seo | null }> => {
	const seo =
		(await db.query.seosTable.findFirst({
			where: (t, { eq }) => eq(t.route, route),
		})) ?? null
	return { seo }
}

export const createSEO = async (props: {
	route: string
	metaTitle: string
	metaDescription: string
	autoGenerated: boolean
	keywords: string
}): Promise<{ seo: Seo }> => {
	const [seo] = await db.insert(seosTable).values(props).returning()
	return { seo }
}

export const deleteSEO = async (id: number): Promise<{ seo: Seo }> => {
	const [seo] = await db
		.delete(seosTable)
		.where(eq(seosTable.id, id))
		.returning()
	return { seo }
}
```

在 `app/routes/web/index/route.tsx` loader 就可以調用，取得 seo 資料：

```ts
// app/routes/web/blog
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)

	// meta 在一個頁面中會放在 head，定義這個網頁的 title 跟 description 跟其他東東
	const meta = seo ? createMeta(seo, new URL(request.url)) : null

	try {
		return { meta }
	} catch (error) {
		console.error(error)
		return { meta }
	}
}

// 這個 meta function 也會被 react router 讀取，然後把他丟去頁面的 meta，具體來說是在 `app/root.tsx` 的 <Meta /> 裡面
export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}
```

---

# Papa

<!-- prettier-ignore -->
> [!NOTE]
> Welcome to Papa, this is an open-source project for building modern web with React and TypeScript.

## Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/home/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Storage**:
  [Cloudflare R2](https://www.cloudflare.com/zh-tw/developer-platform/products/r2/)
- **Style**: [tailwindcss](https://tailwindcss.com/)
- **UI LIbrary**: [shadcn/ui](https://ui.shadcn.com/)
- **Email SDK**: [Resend](https://resend.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Text Editor**: [Tiptap](https://tiptap.dev/)

<!-- prettier-ignore -->
> [!NOTE]
> Optimized for performance, start with **score 100**, tested by [PageSpeed](https://pagespeed.web.dev/).

---

## Before you start

1. Prepare an useful IDE. (e.g.
   [Visual Studio Code](https://code.visualstudio.com/))
2. Get a PostgreSQL database, either host locally or use
   [Neon](https://neon.tech/), which provides 0.5G storage for up to 10
   projects. 512MB is capable of more than 17,000 of
   [What is Papa (30kB)](https://papacloud.vercel.app/blog/what-is-papa) post.
3. Have a [Resend](https://resend.com/) account to send email. Every Resend
   account has a [free 3,000 emails/mo quota](https://resend.com/pricing).
4. Setup an object storage either in
   [Cloudflare R2 (10GB free tier)](https://www.cloudflare.com/developer-platform/products/r2/)
   or [AWS S3](https://aws.amazon.com/s3/).
5. Have either
   [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/),
   [reCAPTCHA v3](https://www.google.com/recaptcha/about/) (coming soon) or
   [hCaptcha](https://www.hcaptcha.com/) (coming soon) to secure your form.
6. Chose where to deploy your Papa application.

### Set up [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)

1. Navigate to `Cloudflare dashboard > R2 Object Storage`.
2. `{} API > Manage API Tokens`: Click **Create API Token** button, and set
   Permissions to Admin Read & Write and TTL to Forever.
3. Paste it into `.env` as `OBJECT_STORAGE_ACCESS_KEY_ID`,
   `OBJECT_STORAGE_SECRET_ACCESS_KEY`.
4. As for `OBJECT_STORAGE_ACCOUNT_ID`, you will find it by opening
   `{} API > Use R2 with APIs`.
5. In `.env` please configure your desired `BUCKET_NAME`, papa will create a
   bucket with this given name, default to `papa`.

### Set up [AWS S3](https://aws.amazon.com/s3/)

Coming soon

---

## Usage

### 1. Clone and configure the required environment variables

```sh
# Clone the repo
git clone https://github.com/gjc14/papa.git

# Navigate to project and copy .env.example
cd papa && mv .env.example .env
```

<!-- prettier-ignore -->
> [!WARNING]
> VITE will expose any environment variable with _VITE_\_ prefix, please use it carefully.

1.  `DATABASE_URL`: We connect to PostgreSQL using node-postgres (pg), so both
    direct and pooled connections are supported.

    - Direct connections provide a one-to-one connection from your app to the
      database. They are ideal for long-lived environments like VMs or
      containers.
    - Pooled connections (e.g., via PgBouncer in transaction or session pooling
      mode) allow sharing a limited number of database connections across many
      stateless requests. This is especially important when running on
      serverless platforms, where each request may create a new database
      connection.

    - **When using stateless/serverless architecture, we recommend using pooled
      connections to avoid hitting connection limits and to ensure
      scalability.**

2.  (optional) Set `TURNSTILE_SITE_KEY`: This key is used to
    [get Turnstile token](https://developers.cloudflare.com/turnstile/get-started/)
    in client, if you use
    [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) as
    captcha, so should be exposed in the frontend with _VITE_\_ prefix.
3.  (optional) `TURNSTILE_SECRET_KEY`: Used to
    [verify Turnstile token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
    get in the frontend in the backend
4.  `AUTH_SECRET`: Use
    `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
    to generate a random secret with node.
5.  `AUTH_EMAIL`: The email address sending authentication emails.
6.  `VITE_BASE_URL`: This is the domain where you're hosting this app. In dev
    mode, probably `http://localhost:5173`. In production environment, please
    use where your app is. E.g. `https://papa.delicioso`.
7.  `APP_NAME`: What you call your app.
8.  `RESEND_API_KEY`: Send emails via Resend.
9.  (optional) `GOOGLE_GENERATIVE_AI_API_KEY`, `OPENAI_API_KEY`,
    `ANTHROPIC_API_KEY`: For use of Generative AI in `/admin/api/ai`
10. `BUCKET_NAME`,`OBJECT_STORAGE_ACCESS_KEY_ID`,
    `OBJECT_STORAGE_SECRET_ACCESS_KEY`, `OBJECT_STORAGE_ACCOUNT_ID`: Where you
    save your objects, accept S3 compatible services. Using in route
    `/admin/assets/resource`

### 2. Install and push database schema

```sh
npm install
```

### 3. Initialize the project

This command will start the project by adding an admin with default posts.

You will be asked for **Email** and your **Name**. Enter them in the teminal.

```sh
npm run init
```

🎉 Now your project should be running on
[http://localhost:5173](http://localhost:5173). Go to
[http://localhost:5173/admin](http://localhost:5173/admin), sign in to see the
admin panel.

---

# Documents

## Routes

To add customized routes in this project, just defines a `routes.ts` in the
top-level of your plugin folder. Defines with
[React Router Routes](https://reactrouter.com/start/framework/routing)

```tsx
// plugins/cv/routes.ts
import {
	index,
	layout,
	prefix,
	type RouteConfig,
} from '@react-router/dev/routes'

const systemRoutes = [
	...prefix('/cv', [
		layout('./plugins/cv/layout.tsx', [index('./plugins/cv/index/route.tsx')]),
	]),
] satisfies RouteConfig

export const cv = () => {
	return systemRoutes
}
```

## Action

### Conventional Return

Refer to: [Definitions in lib/utils](./app/lib/utils/index.tsx)

```ts
return { msg: 'Action success 🎉' } satisfies ConventionalActionResponse
return { err: 'Something went wrong 🚨' } satisfies ConventionalActionResponse
```

```ts
import { type ActionFunctionArgs } from 'react-router'

import { type ConventionalActionResponse } from '~/lib/utils'

type ReturnData = {
	name: string
}

export const action = async ({ request }: ActionFunctionArgs) => {
	if (a) {
		return {
			msg: `Welcome to PAPA!`,
			data: { name: newName },
		} satisfies ConventionalActionResponse<ReturnData>
	} else {
		return {
			err: 'Method not allowed',
		} satisfies ConventionalActionResponse
	}
}

// If you use fetcher, you could benefit from the generic return data
const fetcher = useFetcher<ReturnType>()

useEffect(() => {
	if (fetcher.status === 'loading' && fetcher.data.data) {
		const returnedData = fetcher.data.data // Typed ReturnType
	}
}, [fetcher])
```

## Auth

### Hierarchy

```ts
Organization
├── (Team)
└── └── Member
```

### Sign Up

- For new admin user, they should always be invited/added by current admin.

### Sign In

- For safety concern, now only Magic Link method is available.

## Admin Components

### Data Table

- Reference:
  [Tanstack Table Columns Definitions Guide](https://tanstack.com/table/latest/docs/guide/column-defs)

```tsx
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '~/routes/papa/admin/components/data-table'

type TagType = {
    name: string
    id: string
    postIds: string[]
}

const tags: TagType[] = [
    {
        name: 'Travel',
        id: 'unique-id-1',
        postIds: ['post-1', 'post-2', 'post-3'],
    },
    {
        name: 'Education',
        id: 'unique-id-2',
        postIds: ['post-4', 'post-5', 'post-6'],
    },
]

const tagColumns: ColumnDef<TagType>[] = [
    {
        // accessorKey is the key of the data your pass into <DataTable>
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'postIds',
        header: 'Posts',
        cell: ({ row }) => {
            // `row.original` gives you tags data you pass into <DataTable>
            return row.original.postIds.length
        },
    },
    {
        // If header is a function, please pass in id key.
        // Some of the functions refer to "id" to display as column header,
        // when header is not a string
        id: 'Action',
        accessorKey: 'id',
        header: () => <div className="w-full text-right">Action</div>,
        cell: ({ row }) => (
            <div className="w-full flex">
                <DeleteTaxonomyButton
                    id={row.original.id}
                    actionRoute={'/admin/blog/taxonomy/resource'}
                    intent={'tag'}
                />
            </div>
        ),
    },
]

// Usage
<DataTable columns={tagColumns} data={tags} />
```

### Data Table with customized conditional row style

```tsx
export function MyComponent() {
	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())

	return (
		<DataTable
			columns={columns}
			// Pass in rowsDeleting set state into table
			data={users.map(u => ({
				...u,
				setRowsDeleting,
			}))}
			// Configure style if row id matches rowsDeleting
			rowGroupStyle={[
				{
					rowIds: rowsDeleting,
					className: 'opacity-50 pointer-events-none',
				},
			]}
			hideColumnFilter
		>
			{/* DataTable passes a table ref for you to use table api */}
			{table => (
				<Input
					placeholder="Filter email..."
					value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			)}
		</DataTable>
	)
}
```
