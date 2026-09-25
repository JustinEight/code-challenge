import {
  DropdownMenu,
  type DropdownMenuItem,
} from "@/shared/components/DropdownMenu/DropdownMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import "./UserGreeting.css";

interface UserGreetingProps {
  menuItems: readonly DropdownMenuItem[];
}

export function UserGreeting({ menuItems }: UserGreetingProps) {
  const state = useCurrentUser();

  if (state.status !== "success") return null;

  const { name } = state.data;

  return (
    <DropdownMenu
      label="Account"
      triggerClassName="user-greeting"
      items={menuItems}
      trigger={
        <>
          <span className="user-greeting__avatar" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="user-greeting__text">Hello, {name}!</span>
        </>
      }
    />
  );
}
