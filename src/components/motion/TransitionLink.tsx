"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { playCurtain } from "./Curtain";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * next/link with the curtain transition. Uses Link's `onNavigate`, which runs only for
 * plain same-tab client navigations: Ctrl/Cmd/Shift/middle-click, downloads and
 * target="_blank" are left to the browser, and prefetching is unchanged. Links to the
 * current page (or a hash on it) navigate without the curtain.
 */
export function TransitionLink({ href, onNavigate, replace, scroll, ...rest }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      onNavigate={(event) => {
        onNavigate?.(event);
        const target = new URL(href, window.location.href);
        if (target.origin !== window.location.origin || target.pathname === pathname) return;
        const go = () => (replace ? router.replace(href, { scroll }) : router.push(href, { scroll }));
        if (playCurtain(pathname, go)) event.preventDefault();
      }}
      {...rest}
    />
  );
}
