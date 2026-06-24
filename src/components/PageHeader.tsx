export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-rock-800/80 bg-gradient-to-b from-rock-900/60 to-rock-950">
      <div className="container-content py-14 sm:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight text-rock-50 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-rock-300">{description}</p>
        )}
      </div>
    </div>
  );
}
