'use client';

import Avatar from "@/components/user-avatar";
import { searchUsers } from "@/lib/client/user.client";
import { SearchUserType } from "@/lib/types/user";
import { SearchIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchSidebarContentProps = {
    closeSearch: () => void;
}

type SearchResultProps = {
    result: SearchUserType;
    closeSearch: () => void;
}

type SearchInputProps = {
    setResults: (results: SearchUserType[]) => void;
}

const SearchResult = ({ result, closeSearch }: SearchResultProps) => {
    const router = useRouter();
    const handleNavigate = () => {
        router.push(`/profile/${result.id}`);
        closeSearch();
    }

    return (
        <button onClick={handleNavigate} className="w-full">
            <div className="flex items-center gap-2 p-2">
                <Avatar avatar={result.avatarUrl} size={'sm'} />
                <p className="font-medium">{result.fullName}</p>
            </div>
        </button>
    )
}

const SearchInput = ({ setResults }: SearchInputProps) => {
    const [search, setSearch] = useState('');

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = useCallback(async () => {
        const data = await searchUsers(search);
        setResults(data);
    }, [search, setResults]);

    useEffect(() => {
        debounceRef.current = setTimeout(() => {
            if (search.length > 2) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        }
    }, [search, handleSearch, setResults]);

    return (
        <div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2 w-full text-gray-500">
                <SearchIcon className="w-4 h-4" />
                <input type="text" placeholder="Search for people..." className="bg-transparent outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                {search && (
                    <button onClick={() => setSearch('')} className="hover:text-gray-700">
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

type SearchHeaderProps = {
    closeSearch: () => void;
}

const SearchHeader = ({ closeSearch }: SearchHeaderProps) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h6 className="text-lg font-medium">Search</h6>
            <button onClick={closeSearch}>
                <XIcon className="w-6 h-6" />
            </button>
        </div>
    )
}

type ListResultsProps = {
    results: SearchUserType[];
    closeSearch: () => void;
}

const ListResults = ({ results, closeSearch }: ListResultsProps) => {
    return (
        <div className="flex flex-col gap-2 mt-4">
            {results.map((result) => (
                <SearchResult key={result.id} result={result} closeSearch={closeSearch} />
            ))}
        </div>
    )
}

export default function SearchSidebarContent({ closeSearch }: Readonly<SearchSidebarContentProps>) {
    const [results, setResults] = useState<SearchUserType[]>([]);

    return (
        <div className="px-4 relative">
            <SearchHeader closeSearch={closeSearch} />

            <SearchInput setResults={setResults} />

            {results.length > 0 && (
                <ListResults results={results} closeSearch={closeSearch} />
            )}
        </div>
    )
}