import { formatDate } from "date-fns";
import DeleteButton from "./delete-button";
import { Pencil } from "lucide-react";
import { FieldConfig } from "./types";

type FieldDisplayRowProps = {
    config: FieldConfig;
    handleOpenEditing: () => void;
    handleCloseEditing: () => void;
}

export default function FieldDisplayRow({ config, handleOpenEditing }: Readonly<FieldDisplayRowProps>) {
    return (
        <li className="flex justify-between py-2">
            <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleOpenEditing}
            >
                {config.icon}
                <p>{config.type === 'date' && typeof config.data === 'string' ? formatDate(config.data, "MMM d, yyyy") : config.data}</p>
            </button>

            <div className="grid grid-cols-2 gap-2">
                <DeleteButton
                    config={config}
                />

                <div>
                    <button onClick={handleOpenEditing}>
                        <Pencil width={20} className="cursor-pointer" />
                    </button>
                </div>
            </div>
        </li>
    )
}