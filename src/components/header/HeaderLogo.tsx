import { Link } from "react-router-dom";

import logo from "../../assets/pre-vet logo.png";

interface HeaderLogoProps {
  to?: string;
}

export default function HeaderLogo({ to = "/" }: HeaderLogoProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2"
      aria-label="Pre-Vet home"
    >
      <img src={logo} alt="Pre-Vet" className="h-10 w-auto" />
    </Link>
  );
}