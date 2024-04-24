import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { MouseEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const url = import.meta.env.VITE_APP_BACKEND_URL;

export default function Login() {
  const regName = useRef<HTMLInputElement>(null);
  const regDepartmentName = useRef<HTMLInputElement>(null);
  const regPassword = useRef<HTMLInputElement>(null);
  const logInId = useRef<HTMLInputElement>(null);
  const logInPass = useRef<HTMLInputElement>(null);
  const [, setCookies] = useCookies(["accessToken"]);
  const { toast } = useToast();
  const [pending, setPending] = useState<boolean>(false)

  const navigate = useNavigate();

  const registration = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setPending(true)
      const regData = {
        name: regName.current?.value,
        departmentName: regDepartmentName.current?.value,
        password: regPassword.current?.value,
      };

      if (regData.name && regData.departmentName && regData.password) {
        const res = await axios.post(url + "/registration", regData);
        setCookies("accessToken", res.data.token, { maxAge: 21600 });
        navigate("/");
        return;
      }
    } catch (err) {
      console.log(err);
    }finally{
      setPending(false)
    }
  };

  const logIn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const regData = {
        loginId: logInId.current?.value,
        password: logInPass.current?.value,
      };

      if (regData.loginId && regData.password) {
        const res = await axios.post(url + "/login", regData);
        setCookies("accessToken", res.data.token, { maxAge: 21600 });
        navigate("/");
        return;
      }
    } catch (err) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage: string =
        errorResponse.response?.data?.message || "Unknown error occurred";
      toast({
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="login" className="max-w-[500px] w-full">
        <TabsList className="flex w-full">
          <TabsTrigger className="flex-1" value="login">
            Login
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="registration">
            Registration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Tizimga kirish!</CardTitle>
              <CardDescription>
                Id raqamingizni va passwordingizni muduringizdan so'rang!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-2">
                <Label htmlFor="id" className="font-bold">
                  Ustoz ID:
                </Label>
                <Input
                  ref={logInId}
                  type="number"
                  id="id"
                  placeholder="teacher id"
                />
                <Label htmlFor="password" className="font-bold">
                  Parolingiz:
                </Label>
                <Input
                  ref={logInPass}
                  type="password"
                  id="password"
                  placeholder="password"
                />
                <Button onClick={(e) => logIn(e)}>Kirish</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Ro'yhatdan o'tish!</CardTitle>
              <CardDescription>
                Bu tizim sizga kafedrangizda malumot almashi uchun kerak
                bo'ladi!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-2">
                <Label htmlFor="name" className="font-bold">
                  Ims va Familya:
                </Label>
                <Input
                  ref={regName}
                  type="name"
                  id="name"
                  placeholder="full name"
                />

                <Label htmlFor="department-name" className="font-bold">
                  Kafedra nomi:
                </Label>
                <Input
                  ref={regDepartmentName}
                  type="name"
                  id="department-name"
                  placeholder="department name"
                />

                <Label htmlFor="password" className="font-bold">
                  Parolingiz:
                </Label>
                <Input
                  ref={regPassword}
                  type="password"
                  id="password"
                  placeholder="password"
                />

                <Button onClick={(e) => registration(e)}>{pending ? 'Loading...' : 'Kirish'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <Toaster />
      </Tabs>
    </div>
  );
}
