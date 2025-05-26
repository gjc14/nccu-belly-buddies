// example-plugin/example-admin-page/route.tsx
import { Form, useFetcher } from 'react-router'

import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { db } from '~/lib/db/db.server'
import {
	AdminActions,
	AdminContent,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'
import {
	AdminDataTableMoreMenu,
	DataTable,
} from '~/routes/papa/admin/components/data-table'
// Admin route does not need metadata, which is for seo

import { action } from '~/routes/web/api/restaurant'

import type { Route } from './+types/route'

export { action }

export const loader = async () => {
	const restaurants = await db.query.restaurant.findMany()

	return { restaurants }
}

export default function AdminExample({ loaderData }: Route.ComponentProps) {
	const { restaurants } = loaderData
	const fetcher = useFetcher<typeof action>()

	const isSubmitting = fetcher.state === 'submitting'

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Restaurant"></AdminTitle>
				<AdminActions>
					<Dialog>
						<DialogTrigger asChild>
							<Button>Create New Restaurant</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Restaurant</DialogTitle>
								<DialogDescription></DialogDescription>
								<Form
									className="space-y-2"
									onSubmit={e => {
										e.preventDefault()

										fetcher.submit(e.currentTarget, { method: 'post' })
									}}
								>
									<Input name="name" placeholder="Restaurant Name" required />
									<Input
										name="description"
										placeholder="Description"
										required
									/>
									<Input name="address" placeholder="Address" required />
									<Input name="phone" placeholder="Phone" required />
									<Input
										name="openingHours"
										placeholder="Opening Hours"
										required
									/>
									<Input
										name="cuisineType"
										placeholder="Cuisine Type"
										required
									/>
									<Input name="priceRange" placeholder="Price Range" required />
									<Input
										name="rating"
										placeholder="Rating"
										type="number"
										required
									/>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? 'Creating...' : 'Create Restaurant'}
									</Button>
								</Form>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</AdminActions>
			</AdminHeader>

			<AdminContent>
				<DataTable columns={columns} data={restaurants}></DataTable>
			</AdminContent>
		</AdminSectionWrapper>
	)
}

type LoaderData = Awaited<ReturnType<typeof loader>>

const columns: ColumnDef<LoaderData['restaurants'][number]>[] = [
	{
		accessorKey: 'id',
		header: 'Edit',
		cell: ({ row }) => {
			const fetcher = useFetcher()

			const id = row.original.id
			const name = row.original.name

			return (
				<>
					<AdminDataTableMoreMenu
						id={id}
						deleteTarget={name}
						onDelete={() => {
							fetcher.submit(
								{},
								{
									action: '/api/restaurant/' + id,
									method: 'DELETE',
								},
							)
						}}
					></AdminDataTableMoreMenu>
				</>
			)
		},
	},
	{ accessorKey: 'name', header: 'name' },
	{ accessorKey: 'address', header: 'address' },
	{ accessorKey: 'description', header: 'description' },
	{ accessorKey: 'phone', header: 'phone' },
	{ accessorKey: 'openingHours', header: 'openingHours' },
	{ accessorKey: 'cuisineType', header: 'cuisineType' },
	{ accessorKey: 'priceRange', header: 'priceRange' },
	{ accessorKey: 'rating', header: 'rating' },
]
