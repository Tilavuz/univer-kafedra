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
const url = "http://localhost:3000/api";

type Teach = {
  name: string,
  departmentName: string,
  loginId: number,
  password: string,
  role: string
}

export default function TeachSettings() {
  const [cookies, setcookies] = useCookies(["accessToken"]);
  const accessToken: string = cookies.accessToken || ''; 

  const [teachData, setTeachData] = useState<Teach | null>(null);
  const { toast } = useToast()
  const [departmentName, setDepartmentName] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement | null>(null);
  const departmentNameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    if (accessToken) {
      const data: Teach | null = jwtDecode(accessToken);
      setTeachData(data); 
    }
  }, [accessToken]);

  useEffect(() => {
    const getAdminData = async () => {
      const res = await axios.get(url + '/admin-teach', {
        headers: {
          'x-auth-token': accessToken
        }
      })
      setDepartmentName(res.data.departmentName)
    }
    getAdminData()
  }, [accessToken]);

  const handleChange = () => {
    const updatedData: Teach = {
      ...teachData!,
      name: nameRef.current?.value || '',
      departmentName: departmentNameRef.current?.value || '',
      password: passwordRef.current?.value || '',
    };
    setTeachData(updatedData);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    try {
      const updateData = {
        name: teachData?.name,
        password: teachData?.password,
        loginId: teachData?.loginId
      };
      

      const res = await axios.put(url + '/teacher-teach', updateData, {
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
          <Input ref={nameRef} id="name" type="text" name="name" defaultValue={teachData?.name || ''} required/>
          <Label className="font-bold text-lg" htmlFor="kf">Kafedra nomi</Label>
          <Input id="kf" type="text" name="departmentName" disabled value={departmentName! || ''}/>
          <Label className="font-bold text-lg" htmlFor="login-id">Login uchun id</Label>
          <Input id="login-id" type="text" name="loginId" defaultValue={teachData?.loginId.toString() || ''} disabled required/>
          <Label className="font-bold text-lg" htmlFor="password">Yangi parol</Label>
          <Input ref={passwordRef} id="password" type="password" placeholder="Parolni o'zgartirishigiz mumkin!" name="password"/>
          <Button type="submit" className="w-32 font-bold mt-4">O'zgartish</Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  )
}
