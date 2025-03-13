"use client"

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MenuItem } from "primereact/menuitem";
import { MultiSelect } from "primereact/multiselect"
import { SelectButton } from "primereact/selectbutton";
import { SplitButton } from "primereact/splitbutton";
import { useState } from "react";

interface Item {
    name: string;
    value: number;
}

export default function PlayerController() {
    const [value, setValue] = useState<Item>(null);
    const items: Item[] = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ];
    const items2: MenuItem[] = [
        {
            label: '.csv',
            icon: 'pi pi-refresh'
        },
        {
            label: '.kml',
            icon: 'pi pi-times'
        }
    ];
    return (
        <div>
            <form>
                <Dropdown value={value} options={items} optionLabel="name"
                    placeholder="Select a City" className="w-full md:w-14rem" />
                <InputTextarea rows={5} cols={30} />
                <SelectButton
                    value={value}
                    onChange={(e) => setValue(e.value)}
                    optionLabel="name"
                    options={items}
                    multiple
                />
                <div className="flex flex-row justify-between">
                    <Button label="apply" />
                    <SplitButton severity="secondary" label="export" icon="pi pi-plus" model={items2} />
                </div>
            </form>
        </div>
    )
}
