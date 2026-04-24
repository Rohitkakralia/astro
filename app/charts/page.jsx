import { Suspense } from "react";
import ChartsClient from "./ChartsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChartsClient />
    </Suspense>
  );
}
