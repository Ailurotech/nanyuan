import { ReactNode } from "react";

export function InputsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">{children}</div>
  );
}
