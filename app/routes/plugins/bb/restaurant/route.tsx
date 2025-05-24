// example-plugin/example-admin-page/route.tsx
import { useEffect } from 'react'
import { useFetcher } from 'react-router'

import { Button } from '~/components/ui/button'
import type { ConventionalActionResponse } from '~/lib/utils'
import {
	AdminActions,
	AdminContent,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

import type { Route } from './+types/route'

// Admin route does not need metadata, which is for seo

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData()
	const client = formData.get('client')

	// Data got from the form is typed `FormDataEntryValue | null` so we need to check the type
	if (!client || typeof client !== 'string') {
		throw new Error('Client is not a string')
	}

	if (client === 'failed') {
		return {
			err: 'Hello from the action with conventional error return',
		} satisfies ConventionalActionResponse
	}

	return {
		msg: 'Hello from the action',
	} satisfies ConventionalActionResponse
}

export default function AdminExample() {
	const fetcher = useFetcher<typeof action>()

	const handleClickError = async () => {
		alert('Your going to see an intentional Internal Server Error')
		fetcher.submit({ client: 'failed' }, { method: 'post' })
	}

	const handleClickSuccess = async () => {
		alert('Sending correct data to the server action')
		fetcher.submit({ client: 'success' }, { method: 'post' })
	}

	const handleClickTypeError = async () => {
		alert('Sending type error data to the server action')
		fetcher.submit({}, { method: 'post' })
	}

	useEffect(() => {
		// Effect will run when the fetcher data changes (when the action is called)
		if (fetcher.data) {
			// This data will be typed because we assigned <typeof action> to fetcher
			const data = fetcher.data
			console.log('fetcher.data', data)
		}
	}, [fetcher.data])

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Admin Route Example"></AdminTitle>
				<AdminActions>
					{/* You may put some buttons here */}
					<Button
						onClick={() => {
							// Your function here
							handleClickTypeError()
						}}
					>
						Type Error
					</Button>
					<Button
						onClick={() => {
							// Your function here
							handleClickError()
						}}
					>
						Error
					</Button>
					<Button
						onClick={() => {
							// Your function here
							handleClickSuccess()
						}}
					>
						Success
					</Button>
				</AdminActions>
			</AdminHeader>

			<AdminContent>
				{/* Your main content goes here */}
				Write some content here
				<p className="text-2xl font-bold">Main Content</p>
			</AdminContent>
		</AdminSectionWrapper>
	)
}
