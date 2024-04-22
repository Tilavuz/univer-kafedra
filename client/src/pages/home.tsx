import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const url = import.meta.env.VITE_APP_BACKEND_URL;


type FileData = {
  _id: string;
  title: string;
  file: string;
  desc: number;
  pending: boolean | null;
  answer: string;
  author: string
};

export default function Home() {

  const [files, setFiles] = useState<FileData[] | null>(null);
  const [cookies] = useCookies(["accessToken"]);
  const accessToken: string = cookies.accessToken;
  const [fileData, setFileData] = useState<FileData | null>()



  const getAllFiles = useCallback(async () => {
    try {
      const res = await axios.get(url + "/all-files", {
        headers: {
          "x-auth-token": accessToken,
        },
      });
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [accessToken]);


  useEffect(() => {
    if (cookies.accessToken) getAllFiles();
  }, [cookies.accessToken, getAllFiles]);


  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-2xl border-l-[18px] mx-8 my-4 border-black px-2">Yangi kelgan fayllar</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-black text-xl">
              Ism, Familya
            </TableHead>
            <TableHead className="font-bold text-black text-xl">
              Fayllar
            </TableHead>
            <TableHead className="font-bold text-black text-xl">
              Javoblar
            </TableHead>
            <TableHead className="font-bold text-black text-xl">
              Tafsifi
            </TableHead>
          </TableRow>
        </TableHeader>
        <Dialog>
          <TableBody>
            {files?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.author}</TableCell>
                <TableCell>
                  <Link to={`/file/${item.file}`} className="underline text-cyan-500">
                    {item.file}
                  </Link>
                </TableCell>
                <TableCell className="text-xl">
                  {
                    item.pending === undefined && 'Javobingizni kutmoqda ♻️'
                  }
                  {
                    item.pending === false && 'Inkor qildingiz ❌'
                  }
                  {
                    item.pending === true && 'Tasdiqladingiz ✅👌'
                  }
                </TableCell>
                <TableCell>
                  <DialogTrigger asChild>
                    <Button variant={'outline'} onClick={() => setFileData(item)}>
                      <Eye />
                    </Button>
                  </DialogTrigger>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Siz tomondan yozilgan izoh</DialogTitle>
              <DialogDescription>
                {
                  fileData?.answer
                }
              </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
      </Table>
    </div>
  );
}
