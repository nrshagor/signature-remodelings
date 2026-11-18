import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  /** Colours for dark backgrounds (ink sections, over images). */
  onDark?: boolean;
  /** Full width on small screens. */
  block?: boolean;
  className?: string;
}

type LinkButtonProps = CommonProps & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

function classesFor({ variant = "primary", onDark, block, className }: CommonProps) {
  return [styles.button, styles[variant], onDark && styles.onDark, block && styles.block, className]
    .filter(Boolean)
    .join(" ");
}

/** A link styled as a button when `href` is given, otherwise a native <button>. */
export function Button(props: ButtonProps) {
  const className = classesFor(props);

  if (props.href !== undefined) {
    const { href, children } = props;
    // Internal routes use next/link; anything else (tel:, mailto:, external) a plain <a>.
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className} data-button="">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className} data-button="">
        {children}
      </a>
    );
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    children,
    variant: _variant,
    onDark: _onDark,
    block: _block,
    className: _className,
    type = "button",
    ...rest
  } = props;
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return (
    <button type={type} className={className} data-button="" {...rest}>
      {children}
    </button>
  );
}
