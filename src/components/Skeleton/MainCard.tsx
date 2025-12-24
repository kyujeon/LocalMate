import { Skeleton } from "../ui";

function MainCard() {
  return (
    <div className="w-full">
      <Skeleton className="w-full aspect-square rounded-lg bg-muted/60" />
    </div>
  );
}

export { MainCard };
