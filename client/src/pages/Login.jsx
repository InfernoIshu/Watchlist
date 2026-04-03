import AuthForm from '../components/AuthForm'

export default function Login() {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center">
       <div className="absolute top-0 right-0 w-[800px] h-full bg-red-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
       
       <div className="relative z-10 w-full">
         <AuthForm type="login" />
       </div>
    </div>
  )
}
