"use client"
import { importImage } from "@/app/server-action/import"
import { useActionState } from "react";
import ImportData from "./components/ImportData";


export default function Page() {
    const [state, formAction] = useActionState(importImage, null);
  return (
    <>
    <ImportData />    
    <form action={formAction}>
        <input name="images" type="file" accept="image/jpeg, image/jpg" multiple/>
        <button>import</button>
    </form>
    </>
  )
}
