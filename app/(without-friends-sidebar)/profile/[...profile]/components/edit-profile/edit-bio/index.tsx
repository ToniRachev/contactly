'use client';

import { useAuthenticatedUser } from "@/lib/context/user.context";
import { SectionWrapper } from "..";
import {
    UpdateHometownSchemaType,
    UpdateHometownSchemaErrorType,
    UpdateCurrentCitySchemaErrorType,
    UpdateCurrentCitySchemaType,
    UpdateHighSchoolSchemaErrorType,
    UpdateHighSchoolSchemaType,
    UpdateBirthDateSchemaErrorType,
    UpdateBirthDateSchemaType
} from "@/lib/validations/userSchema";
import EditField from "./edit-field";
import { useMemo } from "react";
import { Building2, Calendar, Home, School } from "lucide-react";
import { FieldConfig } from "./types";

export default function EditBio() {
    const { user } = useAuthenticatedUser();

    const editFields: FieldConfig[] = useMemo(() => [
        {
            name: 'hometown',
            data: user.biography.hometown,
            label: 'Hometown',
            dbField: 'hometown',
            icon: <Home />,
            type: 'text',
            placeholder: 'Add hometown',
            initialState: {
                data: {
                    hometown: user.biography.hometown,
                } as UpdateHometownSchemaType,
                success: false,
                errors: {} as UpdateHometownSchemaErrorType,
            },
        },
        {
            name: 'currentCity',
            data: user.biography.currentCity,
            label: 'Current city',
            dbField: 'current_city',
            icon: <Building2 />,
            type: 'text',
            placeholder: 'Add current city',
            initialState: {
                data: {
                    currentCity: user.biography.currentCity,
                } as UpdateCurrentCitySchemaType,
                success: false,
                errors: {} as UpdateCurrentCitySchemaErrorType,
            },
        },
        {
            name: 'school',
            dbField: 'school',
            data: user.biography.school,
            label: 'High school',
            icon: <School />,
            type: 'text',
            placeholder: 'Add high school',
            initialState: {
                data: {
                    school: user.biography.school,
                } as UpdateHighSchoolSchemaType,
                success: false,
                errors: {} as UpdateHighSchoolSchemaErrorType,
            },
        },
        {
            name: 'birthDate',
            data: user.biography.birthDate,
            icon: <Calendar />,
            type: 'date',
            placeholder: 'Add birth date',
            dbField: 'birth_date',
            label: 'Birth date',
            initialState: {
                data: {
                    birthDate: user.biography.birthDate ? new Date(user.biography.birthDate) : undefined,
                } as UpdateBirthDateSchemaType,
                success: false,
                errors: {} as UpdateBirthDateSchemaErrorType,
            },
        }
    ], [user]);

    return (
        <SectionWrapper title="Edit your bio">
            <ul className="w-full">
                {editFields.map((field) => (
                    <EditField key={field.name} config={field} />
                ))}
            </ul>
        </SectionWrapper>
    )
}