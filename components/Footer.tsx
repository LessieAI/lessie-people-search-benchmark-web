import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Built by{' '}
          <a
            href="https://lessie.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Lessie AI
          </a>
        </p>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="GitHub"
        >
          <Github className="size-4" />
        </a>
      </div>
    </footer>
  );
}
