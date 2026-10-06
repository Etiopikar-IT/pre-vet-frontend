import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface BaseProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

interface LinkItemProps extends BaseProps {
  to: string;
}

interface ButtonItemProps extends BaseProps {
  to?: undefined;
}

type DropdownItemProps = LinkItemProps | ButtonItemProps;

const baseClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition";

function classesFor(variant: "default" | "danger") {
  return variant === "danger"
    ? `${baseClass} font-medium text-red-600 hover:bg-red-50`
    : `${baseClass} text-ink-700 hover:bg-ink-100`;
}

export default function DropdownItem(props: DropdownItemProps) {
  const variant = props.variant ?? "default";
  const className = classesFor(variant);

  if (props.to) {
    return (
      <Link to={props.to} onClick={props.onClick} className={className}>
        <span className="text-ink-500">{props.icon}</span>
        {props.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className={className}>
      <span className="text-ink-500">{props.icon}</span>
      {props.label}
    </button>
  );
}