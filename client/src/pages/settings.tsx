import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

const url = import.meta.env.VITE_APP_BACKEND_URL;

type Admin = {
  name: string,
  departmentName: string,
  loginId: number,
  password: string,
  role: string
}

export default function Settings() {
  const [cookies, setcookies] = useCookies(["accessToken"]);
  const accessToken: string = cookies.accessToken || ''; 

  const [adminData, setAdminData] = useState<Admin | null>(null); 
  const { toast } = useToast()

  const nameRef = useRef<HTMLInputElement | null>(null);
  const departmentNameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    if (accessToken) {
      const data: Admin | null = jwtDecode(accessToken);
      setAdminData(data); 
    }
  }, [accessToken]);

  const handleChange = () => {
    const updatedData: Admin = {
      ...adminData!,
      name: nameRef.current?.value || '',
      departmentName: departmentNameRef.current?.value || '',
      password: passwordRef.current?.value || '',
    };
    setAdminData(updatedData);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    try {
      const res = await axios.put(url + '/admin', adminData, {
        headers: {
          'x-auth-token': accessToken
        }
      })
      setcookies('accessToken', res.data.token)
      toast({
        description: `${res.data.message} ✅`
      })
    }catch(err) {
      console.log(err);
    }


  }

  return (
    <Card className="container border">
      <CardHeader>
        <CardTitle>Profil sozlamalari</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-2" onSubmit={(e) => handleSubmit(e)} onChange={handleChange}>
          <Label className="font-bold text-lg" htmlFor="name">Ism, familya</Label>
          <Input ref={nameRef} id="name" type="text" name="name" defaultValue={adminData?.name || ''} required/>
          <Label className="font-bold text-lg" htmlFor="kf">Kafedra nomi</Label>
          <Input ref={departmentNameRef} id="kf" type="text" name="departmentName" defaultValue={adminData?.departmentName || ''} required/>
          <Label className="font-bold text-lg" htmlFor="login-id">Login uchun id</Label>
          <Input id="login-id" type="text" name="loginId" defaultValue={adminData?.loginId.toString() || ''} disabled required/>
          <Label className="font-bold text-lg" htmlFor="password">Yangi parol</Label>
          <Input ref={passwordRef} id="password" type="password" placeholder="Parolni o'zgartirishigiz mumkin!" name="password"/>
          <Button type="submit" className="w-32 font-bold mt-4">O'zgartish</Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  )
}
