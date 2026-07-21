import { redirect } from "next/navigation";

/** Legacy routes redirect to the NN course. */
export default function PlaygroundPage() {
  redirect("/learn");
}
