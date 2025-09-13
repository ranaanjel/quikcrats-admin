import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BACKEND_URL } from "@/config"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { toast, Toaster } from "sonner"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export function Login() {
  let navigate  = useNavigate();
    useEffect(function() {
      let data = localStorage.getItem("data");
      if(data) {
        navigate("/") 
      }
    },[])

       return <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <img src="/favicon.svg" width={50} height={50} className="" alt="logo" />
          </div>
          Quikcrats Service Private Limited
        </a>
        <LoginForm />
      </div>
    </div>
}


function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    let inputPassword = useRef<HTMLInputElement>(null);
    let inputEmail = useRef<HTMLInputElement>(null);
    let navigate = useNavigate();

    function login() {
        let value = inputEmail.current?.value.trim();
        let password = inputPassword.current?.value.trim();
        if(value == "" || password == "") {
            toast.error("Make email and password have value")
            return;
        }
        let url = BACKEND_URL+ "login"

        axios.post(url, {
          username:value,
          password
        },{withCredentials:true}).then( item => {
          // no storage of local value in the localstorage
          localStorage.setItem("data", JSON.stringify({user_data:item.data.object}));
          navigate("/");
        }).catch(err => {
        console.log(value, password,url)
          console.log(err)
          navigate("/login")
          localStorage.setItem("data", "");
        })
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your designated mail account @google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    
                    ref={inputEmail}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required 
                    ref={inputPassword} />
                    <a
                      href="mailto:quikcrats@gmail.com"
                      className=" text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password? Contact Admin
                    </a>
                </div>
                <Button onClick={function () {
                    login()
                }} type="button" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster></Toaster>
    </div>
  )
}
export function Help() {
    return <div className="p-5">
        <code>
            Contact Developer
            @whatsapp
        </code>
    </div>
}
export function Setting() {
return <div className="p-5 pb-20 h-screen flex justify-between flex-col">
        <div>Features to be introduced in v2</div>
        <code>
            Contact Developer
            @whatsapp
        </code>
    </div>
}

