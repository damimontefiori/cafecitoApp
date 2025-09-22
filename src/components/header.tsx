import { CoffeeIcon } from './coffee-icon';

export function Header() {
  return (
    <header className="py-8 px-4 text-center">
      <div className="inline-flex items-center gap-4">
        <CoffeeIcon className="h-12 w-12 text-primary" />
        <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground">
          Coffee Queue
        </h1>
      </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Pide tu café online y recógelo en el momento perfecto. Sin colas, solo buen café.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Desarrollada por Dami Montefiori
      </p>
    </header>
  );
}
