/**
 * 嗨 Dolphin 這邊寫給您。
 * 步驟：
 * 1. 在 <LoginForm> 裡面，有個 onLogin 的變數，必須要傳入一個 Function，這邊我已經先定義 function 是在線面的 const onLogin = (email: string)
 * 2. LoginForm 會調用這個 Func 並傳入 email
 * 3. 取得 email 後，您要調用 authClient 裡面的 `emailOtp.sendVerificationOtp`，這個是發送驗證碼的 API，你可以看 /app/routes/papa/auth/signin-form.tsx 看到相關內容
 * 4. 在成功傳送 otp 後（onSuccess），要將 opt 輸入框顯示出來（調用 `setOptSent(true)`）
 * 5. 接下來在 onVerifyOtp 裡面，您要調用 `authClient.signIn.emailOtp`，這個是驗證碼登入的 API，並傳入 email 和 otp
 * 6. 如果成功，則跳轉到首頁：/
 * 7. 如果失敗，則調用 `toast.error('驗證碼錯誤')` 顯示錯誤訊息
 *
 * p.s. toast 是一個顯示通知的 function，您可以在這邊使用它來顯示成功或失敗的訊息，請見 https://sonner.emilkowal.ski/
 */
import { useState } from 'react'

import { toast } from 'sonner'

import { authClient } from '~/lib/auth/auth-client'

import { LoginForm } from './components/form'

export async function loader() {
	console.log('web auth loader')

	return {
		hi: 'return anything as json',
	}
}

// If this is going to be a component route instead of an api route, add a default export component
export default function Auth() {
	const [otpSent, setOtpSent] = useState(false)

	const onLogin = (email: string) => {
		alert('Login with email: ' + email)
		toast('Login with email: ' + email)
		// 在這邊調用 authClient 裡面的 `emailOtp.sendVerificationOtp`
		// 並設定 onSuccess 時要顯示 opt 輸入框（調用 `setOtpSent(true)`）
		setOtpSent(true)

		// 設定 onError 時要顯示錯誤訊息（調用 `toast.error('發送驗證碼失敗')`）
	}

	const onVerifyOtp = async (email: string, otp: string) => {
		// 這邊要調用 `authClient.signIn.emailOtp`
		// 並傳入 email 和 otp
		// 如果成功，則跳轉到首頁：/
	}

	return (
		<div className="w-full h-screen flex items-center justify-center">
			<div className="mx-auto max-w-2xl">
				<LoginForm
					onLogin={onLogin}
					showOtpInput={otpSent}
					onVerifyOtp={onVerifyOtp}
				/>
			</div>
		</div>
	)
}
