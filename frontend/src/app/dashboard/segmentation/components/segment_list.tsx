"use client"
import { Clusters } from '@prisma/client';
import { DataView } from 'primereact/dataview';
import { useSegmentContext } from '../utils/context';

export default function SegmentList() {
    const list = useSegmentContext();
    const listTemplate = (items: Clusters[]) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return <div>test</div>;
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };
    return (
        <div>
            <DataView value={list} listTemplate={listTemplate} />
        </div>
    )
}
