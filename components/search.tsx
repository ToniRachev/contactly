import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function Search() {
    return (
        <div className="relative">
            <Input name='search'
                placeholder="Search"
                className=" pl-8 bg-[#51525B] border-none backdrop:opacity-15 placeholder:text-stone-200"
            />
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-2" width={18} />
        </div>
    )
}