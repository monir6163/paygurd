/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export default function LoadingButton({ children, loading, ...props }: any) {
  return (
    <Button variant="outline" {...props} disabled={props.disabled || loading}>
      <span className="flex items-center justify-center gap-1">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </span>
    </Button>
  );
}
