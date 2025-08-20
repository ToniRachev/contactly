import { UserProfileType } from "@/lib/types/user";
import { MapPinIcon, CalendarIcon, SchoolIcon, House } from "lucide-react";
import SectionWrapper from "./section-wrapper";

const labels = {
    currentCity: 'Lives in',
    hometown: 'From',
    birthDate: 'Born on',
    school: 'Studied at'
}

type AboutItemProps = {
    icon: React.ReactNode;
    text: string | null;
    label: string;
}

type AboutProps = {
    user: UserProfileType;
}

const AboutItem = ({ icon, text, label }: Readonly<AboutItemProps>) => {
    return (
        <li className="flex items-center gap-1">
            {icon}
            <p className="text-sm text-stone-200">{label}</p>
            <p className="text-sm text-stone-200">{text ?? "N/A"}</p>
        </li>
    )
}

export default function About({ user }: Readonly<AboutProps>) {
    return (
        <SectionWrapper title="About">
            <ul className="flex flex-col gap-3">
                <AboutItem icon={<House />} text={user.biography.currentCity} label={labels.currentCity} />
                <AboutItem icon={<MapPinIcon />} text={user.biography.hometown} label={labels.hometown} />
                <AboutItem icon={<CalendarIcon />} text={user.biography.birthDate} label={labels.birthDate} />
                <AboutItem icon={<SchoolIcon />} text={user.biography.school} label={labels.school} />
            </ul>
        </SectionWrapper>
    )
}