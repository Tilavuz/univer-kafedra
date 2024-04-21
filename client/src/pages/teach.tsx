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
import { Trash2, FilePlus, Eye } from "lucide-react";
import { useEffect, useState, FormEvent, useRef, useCallback } from "react";

import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

const url = "http://localhost:3000/api";
const url2 = "http://localhost:3000";


type FileData = {
  _id: string;
  title: string;
  file: string;
  desc: number;
  pending: boolean | null;
  answer: string;
};


export default function Teach() {

  const [cookies] = useCookies(["accessToken"]);
  const accessToken: string = cookies.accessToken;
  const [files, setFiles] = useState<FileData[] | null>(null);
  const file = useRef<HTMLInputElement | null>(null)
  const fileTitle = useRef<HTMLInputElement | null>(null)
  const fileDesc = useRef<HTMLTextAreaElement | null>(null)
  const { toast } = useToast();
  const [getFileName, setGetFileName] = useState<string | null>()
  const [fileData, setFileData] = useState<FileData | null>()
  

  const addFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {

      const fileInput = file.current?.files?.[0];
      const fileTitleData = fileTitle.current?.value
      const fileDescData = fileDesc.current?.value
      
      const fileData = {
        file: fileInput,
        title: fileTitleData,
        desc: fileDescData
      }      

      const res = await axios.post(url + '/file', fileData, {
        headers: {
          'x-auth-token': accessToken,
          "Content-Type": "multipart/form-data",
        }
      })
      toast({
        description: `${res.data.message} ✅`
      })
      getAllFiles()
    }catch(err) {
      const error = err as { response: { data: { message: string } } }
      toast({
        description: `${error.response.data.message} ❌`
      })
    }

  }

  const getAllFiles = useCallback(async () => {
    try {
      const res = await axios.get(url + "/files", {
        headers: {
          "x-auth-token": accessToken,
        },
      });
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [accessToken]);


  const deleteFile = async () => {
    try{
      const res = await axios.delete(url + `/file/${getFileName}`, {
        headers: {
          'x-auth-token': accessToken
        }
      })
      toast({
        description: `${res.data.message} ✅`
      })
      getAllFiles()
    }catch(err) {
      const error = err as { response: { data: { message: string } } }
      toast({
        description: `${error.response.data.message} ❌`
      })
    }
  }


  useEffect(() => {
    if (cookies.accessToken) getAllFiles();
  }, [cookies.accessToken, getAllFiles]);
  
  return (
    <div className="flex flex-col">
      <Dialog>
        <div className="flex justify-between items-center container m-0">
          <h2 className="font-bold text-2xl border-l-[18px] mx-8 my-4 border-black px-2">
            Fayllar
          </h2>
          <DialogTrigger asChild>
            <Button>
              <FilePlus size={32} />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <form className="flex flex-col gap-2" onSubmit={(e) => addFile(e)}>
            <Input
              name="file"
              type="file"
              required
              ref={file}
            />
            <Label htmlFor="title" className="font-bold">
              Sarlavha
            </Label>
            <Input 
              id="title"
              required
              ref={fileTitle}
            />
            <Label htmlFor="desc" className="font-bold">
              Tavsif
            </Label>
            <Textarea
              id="desc"
              required
              ref={fileDesc}
            />
            <Button className="font-bold">
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
                  Sarlavha
                </TableHead>
                <TableHead className="font-bold text-black text-xl">
                  Fayllar
                </TableHead>
                <TableHead className="font-bold text-black text-xl">
                  Javoblar
                </TableHead>
                <TableHead className="font-bold text-black text-xl">
                  Amallar:
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files?.length !== 0 ? files?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell><Link to={`${url2}/uploads/${item.file}`} className="underline text-cyan-500" download>Fayl yuklash</Link></TableCell>
                  <TableCell className="text-lg">
                    {
                      item.pending === undefined && 'Jarayonda ♻️'
                    }
                    {
                      item.pending === true && 'Tasdiqlandi ✅👌'
                    }
                    {
                      item.pending === false && 'Rad etildi ❌'
                    }
                  </TableCell>
                  <TableCell className="flex items-center gap-2 flex-wrap">
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" onClick={() => setGetFileName(item.file)}>
                        <Trash2 size={22} />
                      </Button>
                    </AlertDialogTrigger>
                    <DialogTrigger asChild>
                      <Button variant={'outline'} onClick={() => setFileData(item)}>
                        <Eye />
                      </Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell className="font-bold"><i>Sizda hozircha fayllar mavjut emas</i></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Siz bu faylni o'chirmoqchimisiz
              </AlertDialogTitle>
              <AlertDialogDescription>
                O'chirib yuborilgan fayl qayta tiklanmaydi!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Yo'q</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteFile()}>Ha</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DialogContent>
            <DialogHeader>
              {
                fileData?.pending === undefined && <DialogTitle>Hali ko'rilmadi</DialogTitle>
              }
              {
                fileData?.pending === false && <DialogTitle className="text-red-500">Inkor etildi</DialogTitle>
              }
              {
                fileData?.pending === true && <DialogTitle className="text-green-500">Tasdiqlandi</DialogTitle>
              }
              <DialogDescription>
                {
                  fileData?.answer ? fileData?.answer : '...'
                }
              </DialogDescription>
            </DialogHeader>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
