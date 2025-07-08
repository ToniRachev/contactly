"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format, formatDate } from "date-fns"
import { Input } from "./ui/input"

type DatePickerProps = {
    value: Date | undefined;
    name: string;
}

export function DatePicker({ value, name }: Readonly<DatePickerProps>) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(value);

    console.log(date);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                Date of birth
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!date}
                        className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Input
                type="date"
                hidden
                name={name}
                defaultValue={date ? formatDate(date, "yyyy-MM-dd") : ""}
            />
        </div>
    )
}
