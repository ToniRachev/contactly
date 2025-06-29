'use client';

import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useState } from "react";

type FilterItemProps = {
    value: string;
    label: string;
    caption: string;
}

const FilterItem = ({ value, label, caption }: Readonly<FilterItemProps>) => {
    return (
        <SelectItem value={value} className="text-stone-100 focus:bg-stone-700 focus:text-stone-100 data-[state=checked]:bg-stone-600 my-1 py-2">
            <div className="flex flex-col gap-2 max-w-[15vw] cursor-pointer">
                <p>{label}</p>
                <p className="text-sm">{caption}</p>
            </div>
        </SelectItem>
    )
}

export default function Filter({ filters }: Readonly<{ filters: FilterItemProps[] }>) {
    const [selectedFilter, setSelectedFilter] = useState<string>('mostRecent');

    const filter = filters.find((f) => f.value === selectedFilter);

    return (
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px] border-none !text-stone-100">
                <span>{filter?.label}</span>
            </SelectTrigger>
            <SelectContent className="bg-surface">
                {filters.map((filter) => (
                    <FilterItem key={filter.value} {...filter} />
                ))}
            </SelectContent>
        </Select>
    )
}