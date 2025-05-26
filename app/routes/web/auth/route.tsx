/**
 * 嗨 Dolphin 這邊寫給您。
 * 步驟：
 * 1. 在 <LoginForm> 裡面，有個 onLogin 的變數，必須要傳入一個 Function，
 這邊我已經先定義 function 是在線面的 const onLogin = (email: string)
 * 2. LoginForm 會調用這個 Func 並傳入 email
 * 3. 取得 email 後，您要調用 authClient 裡面的 `emailOtp.sendVerificationOtp`，
 這個是發送驗證碼的 API，你可以看 /app/routes/papa/auth/signin-form.tsx 看到相關內容
 * 4. 在成功傳送 otp 後（onSuccess），要將 opt 輸入框顯示出來（調用 `setOptSent(true)`）
 One-Time Password（一次性密碼）
 * 5. 接下來在 onVerifyOtp 裡面，您要調用 `authClient.signIn.emailOtp`，
 這個是驗證碼登入的 API，並傳入 email 和 otp
 * 6. 如果成功，則跳轉到首頁：/
 * 7. 如果失敗，則調用 `toast.error('驗證碼錯誤')` 顯示錯誤訊息
 *
 * p.s. toast 是一個顯示通知的 function，您可以在這邊使用它來顯示成功或失敗的訊息，
 請見 https://sonner.emilkowal.ski/
 */

import { useNavigate } from 'react-router'
import { useState } from 'react'
//是否顯示OTP輸入欄
import { toast } from 'sonner'
//顯示錯誤或成功的訊息
import { authClient } from '~/lib/auth/auth-client'
//驗證API客戶端
import { LoginForm } from './components/form'
//顯示email跟OTP輸入欄位
export async function loader() {
	console.log('web auth loader')

	return {
		hi: 'return anything as json',
	}
}

// If this is going to be a component route instead of an api route, add a default export component
export default function Auth() {
	const [otpSent, setOtpSent] = useState(false)
	const navigate = useNavigate()
//第 1 步補完：實作 onLogin 中的 API 呼叫
	const onLogin = async (email: string) => {
	try {
		// 發送 OTP 到使用者的 email
		await authClient.emailOtp.sendVerificationOtp({
			email,
			type: 'sign-in',
		})

		// 成功後顯示 OTP 輸入欄
		toast.success('驗證碼已寄出')
		setOtpSent(true)
	} catch (err) {
		console.error('發送 OTP 失敗：', err)
		toast.error('發送驗證碼失敗，請稍後再試')
	}
}
//第 2 步：實作 onVerifyOtp(email, otp) 的 OTP 驗證邏輯與跳轉首頁

	const onVerifyOtp = async (email: string, otp: string) => {
		try {
	// 驗證 OTP
			await authClient.signIn.emailOtp({
				email, 
				otp})
		// 成功 → 顯示成功訊息並導向首頁
			toast.success('登入成功')
			navigate('/')
		} catch (err) {
			console.error('OTP 驗證失敗：', err)
			toast.error('驗證碼錯誤，請重新輸入')
		}
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
