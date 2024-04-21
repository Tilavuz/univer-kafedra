import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const url = "http://localhost:3000/api";
const url2 = "http://localhost:3000";

type FileData = {
  _id: string;
  title: string;
  file: string;
  desc: string;
  pending: boolean | undefined;
  answer: string;
  author: string;
};

export default function File() {
  const [isRight, setIsRight] = useState<boolean>(false);
  const { file } = useParams();
  const [cookies] = useCookies(["accessToken"]);
  const accessToken: string = cookies.accessToken;
  const [fileData, setFileData] = useState<FileData | null>(null);
  const descAnswer = useRef<HTMLTextAreaElement | null>(null);
  const { toast } = useToast();



  useEffect(() => {
    const getFile = async () => {
      const res = await axios.get(url + `/admin-file/${file}`, {
        headers: {
          "x-auth-token": accessToken,
        },
      });
      setFileData(res.data.file);
    };
    getFile();
  }, [accessToken, file]);


  const answer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const editData = {
        ...fileData,
        pending: isRight,
        answer: descAnswer.current?.value,
      };
      if (editData.answer) {
        const res = await axios.put(url + "/file", editData, {
          headers: {
            "x-auth-token": accessToken,
          },
        });
        toast({
          description: `${res.data.message} ✅`,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-[500px] w-full">
        <CardHeader>
          <CardTitle>{fileData?.title}</CardTitle>
          <CardDescription>
            {fileData?.desc ? fileData.desc : "..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-12">
          <Link
            to={`${url2}/uploads/${fileData?.file}`}
            download
            className="flex justify-center"
          >
            <FileDown size={96} />
          </Link>
          <Dialog>
            <CardFooter className="flex justify-between flex-wrap">
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRight(true);
                  }}
                >
                  Tasdiqlash
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsRight(false);
                  }}
                >
                  Inkor qilish
                </Button>
              </DialogTrigger>
            </CardFooter>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isRight ? "Faylni tasdiqlash" : "Faylni inkor etish"}
                </DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-4" onSubmit={(e) => answer(e)}>
                <Textarea ref={descAnswer} placeholder="Habar qoldirish..." />
                <Button>Yuborish</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
