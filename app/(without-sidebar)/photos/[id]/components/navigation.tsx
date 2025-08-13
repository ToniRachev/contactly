import { ChevronLeft, ChevronRight } from "lucide-react"

type NavigationButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
}

type NavigationProps = {
    navigation: {
        handlePreviousPhoto: () => void;
        handleNextPhoto: () => void;
    }
}

const NavigationButton = ({ children, onClick }: Readonly<NavigationButtonProps>) => {
    return (
        <button
            onClick={onClick}
            className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 cursor-pointer z-50"
        >
            {children}
        </button>
    )
}

export default function Navigation({ navigation }: Readonly<NavigationProps>) {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-6">
            <NavigationButton onClick={navigation.handlePreviousPhoto}>
                <ChevronLeft />
            </NavigationButton>

            <NavigationButton onClick={navigation.handleNextPhoto}>
                <ChevronRight />
            </NavigationButton>
        </div>
    )
}