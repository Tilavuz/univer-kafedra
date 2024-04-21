import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AlignJustify } from "lucide-react"
export default function Header() {
  return (
    <header className="fixed top-2 left-0 w-full">
        <div className="flex items-center justify-between container py-4 bg-white shadow">
          <Link className="text-4xl font-bold" to={'/'}>KM</Link>
          <nav className="lg:flex gap-4 hidden">
              <Button variant={'link'} asChild>
                <Link className="text-xl" to={'/'}>Fayllar</Link>
              </Button>
              <Button variant={'link'} asChild>
                <Link className="text-xl" to={'/teachers'}>Ustozlar</Link>
              </Button>
              <Button variant={'link'} asChild>
                <Link className="text-xl" to={'/settings'}>Sozlamalar</Link>
              </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button>
                <AlignJustify />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col">
                  <Button variant={'link'} asChild>
                    <Link className="text-xl" to={'/'}>Fayllar</Link>
                  </Button>
                  <Button variant={'link'} asChild>
                    <Link className="text-xl" to={'/teachers'}>Ustozlar</Link>
                  </Button>
                  <Button variant={'link'} asChild>
                    <Link className="text-xl" to={'/settings'}>Sozlamalar</Link>
                  </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
    </header>
  )
}
