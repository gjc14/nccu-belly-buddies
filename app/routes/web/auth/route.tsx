import { LoginForm } from './components/form'

export async function loader() {
	console.log('web auth loader')

	return {
		hi: 'return anything as json',
	}
}

// If this is going to be a component route instead of an api route, add a default export component
export default function Auth() {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<LoginForm />
		</div>
	)
}
