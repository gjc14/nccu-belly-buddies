import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from '@react-router/dev/routes'

export const indexRoute = () => {
	return index('./routes/web/index/route.tsx')
}

export const blogRoute = () => {
	return route('/blog', './routes/web/blog/layout.tsx', [
		index('./routes/web/blog/index/route.tsx'),
		route(':postSlug', './routes/web/blog/post-slug/route.tsx'),
		route(':postSlug/edit', './routes/web/blog/post-slug-edit/route.tsx'),
		route('category', './routes/web/blog/category/route.tsx'),
		route('tag', './routes/web/blog/tag/route.tsx'),
		route('subscribe', './routes/web/blog/subscribe/route.tsx'),
	])
}

export const splatRoute = () => {
	return route('/*', './routes/web/$/route.tsx')
}

// Configure your customized routes here
const customizedRoutes = [
	// Add your customized routes here
] satisfies RouteConfig

const systemRoutes = [
	layout('./routes/web/layout.tsx', [
<<<<<<< HEAD
		index('./routes/web/index/route.tsx'),
		route('/blog', './routes/web/blog/layout.tsx', [
			index('./routes/web/blog/index/route.tsx'),
			route(':postSlug', './routes/web/blog/post-slug/route.tsx'),
			route(':postSlug/edit', './routes/web/blog/post-slug-edit/route.tsx'),
			route('category', './routes/web/blog/category/route.tsx'),
			route('tag', './routes/web/blog/tag/route.tsx'),
			route('subscribe', './routes/web/blog/subscribe/route.tsx'),
		]),
		route('/*', './routes/web/$/route.tsx'),

<<<<<<< HEAD
		// Adding customized web routes
	]),

	// 登入跟註冊放一起就好惹！可以直接在前端切換要調用的 function
	route('/auth', './routes/web/auth/route.tsx'),

	...prefix('/hello-world', [
		layout('./routes/web/hello-world/layout.tsx', [
			index('./routes/web/hello-world/index/route.tsx'),
			route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
=======
		...prefix('/hello-world', [
			layout('./routes/web/hello-world/layout.tsx', [
				index('./routes/web/hello-world/index/route.tsx'),
				route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
			]),
>>>>>>> 3d18136 (fix: customized admin routes and web under layout)
		]),
		// This is the same as the above, but using the `route` function
		// route('/hello-world/hello', './routes/web/hello-world/layout.tsx', [
		// 	index('./routes/web/hello-world/index/route.tsx'),
		// 	route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
		// ])

		// Adding customized web routes
		...customizedRoutes,
=======
		...(customizedRoutes.length === 0
			? [
					indexRoute(),
					blogRoute(),
					splatRoute(),
					...prefix('/hello-world', [
						layout('./routes/web/hello-world/layout.tsx', [
							index('./routes/web/hello-world/index/route.tsx'),
							route(
								':whateverParam',
								'./routes/web/hello-world/param/route.tsx',
							),
						]),
						// This is the same as the above, but using the `route` function
						// route('/hello-world/hello', './routes/web/hello-world/layout.tsx', [
						// 	index('./routes/web/hello-world/index/route.tsx'),
						// 	route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
						// ])
					]),
				]
			: // Adding customized web routes
				customizedRoutes),
>>>>>>> 8223d0f (fix: only show default page when no customized web routes set)
	]),
] satisfies RouteConfig

export const webPage = () => {
	return [...systemRoutes]
}
