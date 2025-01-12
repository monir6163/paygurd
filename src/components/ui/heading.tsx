/* eslint-disable @typescript-eslint/no-explicit-any */

export const Heading = ({ title, description }: any) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
