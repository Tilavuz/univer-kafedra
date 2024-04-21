import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Trash2, Pencil, UserPlus } from "lucide-react";
import { useRef, MouseEvent, useEffect, useState, FormEvent, useCallback } from "react";

import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const url = "http://localhost:3000/api";

type Admin = {
  name: string;
  departmentName: string;
  loginId: number;
  role: string;
};

type Teacher = {
  _id: string;
  name: string;
  adminId: number;
  loginId: number;
  role: string;
};


export default function Teachers() {
  const teacherName = useRef<HTMLInputElement>(null);
  const teacherAddPassword = useRef<HTMLInputElement>(null);
  const [teachData, setTeachData] = useState<Admin | null>(null);
  const [cookies] = useCookies(["accessToken"]);
  const accessToken: string = cookies.accessToken;
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const { toast } = useToast();
  const [putTeachData, setPutTeachData] = useState<Teacher | null>(null)
  const [putPassword, setPutPassword] = useState<string | null>(null)
  const [putName, setPutName] = useState<string | null>(null)
  const [teach, setTeach] = useState<number | null>(null)

  const getTeachData = (data: Teacher) => {
    setPutName(data.name)
    setPutTeachData(data)
  }

  const getAllTeachers = useCallback( async () => {
    const res = await axios.get(url + "/teachers", {
      headers: {
        "x-auth-token": accessToken,
      },
    });
    setTeachers(res.data);
  }, [accessToken])

  const deleteTeacher = async () => {
    try {
      const res = await axios.delete(url + `/teach/${teach}`, {
        headers: {
          'x-auth-token': accessToken
        }
      })
      getAllTeachers()
      toast({
        description: `${res.data.message} ✅`
      })
    }catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (cookies) {
      const data: Admin = jwtDecode(accessToken);
      setTeachData(data);
    }
  }, [cookies, accessToken]);

  useEffect(() => {
    if (cookies.accessToken) getAllTeachers();
  }, [cookies.accessToken, getAllTeachers]);

  const addTeacher = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const data = {
        name: teacherName.current?.value,
        password: teacherAddPassword.current?.value,
        adminId: teachData?.loginId,
        departmentName: teachData?.departmentName
      };

      if (data.name && data.password && data.adminId && data.departmentName) {
        const res = await axios.post(url + "/teacher", data, {
          headers: {
            "x-auth-token": accessToken,
          },
        });
        toast({
          description: `${res.data.message} ✅`,
        });
        getAllTeachers()
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

  const putTeacher = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await axios.put(url + '/teacher', { loginId: putTeachData?.loginId, password: putPassword, name: putName }, {
        headers: {
          'x-auth-token': cookies.accessToken
        }
      })
      toast({
        description: res.data.message
      });
    }catch (err) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage: string =
        errorResponse.response?.data?.message || "Unknown error occurred";
      toast({
        description: errorMessage,
      });

  }
  }
  return (
    <div className="flex flex-col">
      <Dialog>
        <div className="flex justify-between items-center container m-0">
          <h2 className="font-bold text-2xl border-l-[18px] mx-8 my-4 border-black px-2">
            Ustozlar
          </h2>
          <DialogTrigger asChild>
            <Button>
              <UserPlus size={32} />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <form className="flex flex-col gap-2">
            <Label htmlFor="id" className="font-bold">
              Ustoz ism va familyasi:
            </Label>
            <Input
              ref={teacherName}
              id="id"
              name="name"
              placeholder="full name"
            />
            <Label htmlFor="password" className="font-bold">
              Parol:
            </Label>
            <Input
              ref={teacherAddPassword}
              id="password"
              name="password"
              placeholder="password"
            />
            <Button className="font-bold" onClick={(e) => addTeacher(e)}>
              Bajarish
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <AlertDialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-xl">
                  Ism:
                </TableHead>
                <TableHead className="font-bold text-black text-xl">
                  Id:
                </TableHead>
                <TableHead className="font-bold text-black text-xl">
                  Amallar:
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.loginId}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => getTeachData(item)}>
                        <Pencil size={22} />
                      </Button>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" onClick={() => setTeach(item.loginId)}>
                        <Trash2 size={22} />
                      </Button>
                    </AlertDialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Siz bu ustozni o'chirmoqchimisiz
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bu ustoz va ustozning barcha malumotlari o'chib ketadi!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Yo'q</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTeacher()}>Ha</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ustoz malumotlarini tahrirlash</DialogTitle>
            <DialogDescription>
              Siz faqatgina utozning parolini taxrirlashingiz mumkin!
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={(e) => putTeacher(e)}>
            <Label htmlFor="id" className="font-bold">
              Ustoz id:
            </Label>
            <Input id="id" type="number" value={putTeachData?.loginId.toString()} disabled />
            <Label htmlFor="text" className="font-bold">
              Ism, familya:
            </Label>
            <Input id="text" name="text" placeholder="Full name" value={putName! || ''} onChange={(e) => setPutName(e.target.value)} />
            <Label htmlFor="password" className="font-bold">
              Yangi parol:
            </Label>
            <Input id="password" name="password" placeholder="password" onChange={(e) => setPutPassword(e.target.value)} />
            <Button className="font-bold">Bajarish</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
