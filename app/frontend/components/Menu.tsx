import { store } from "@/lib/store"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { NavLink } from "react-router"

const Menu = () => {
  const menuItems = [
    {
      to: "/",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      ),
    },
    {
      to: "/promote",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="16" width="20" height="4" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="5" y="6" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      to: "/home",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
  ]

  return (
    <nav className={clsx("fixed bottom-10 left-1/2 -translate-x-1/2", "flex justify-around gap-1", "p-1 rounded-full bg-white/5", "glass")}>
      {menuItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center",
              "p-2 px-3 rounded-full",
              "text-white/85 hover:text-white",
              "hover:bg-white/8",
              "menu-item",
              isActive && "bg-white/15 text-white menu-item--active",
            )
          }
          onClick={() => {
            if (store.getState().capabilities?.includes("haptics.selectionChanged")) sdk.haptics.selectionChanged()
          }}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  )
}

export default Menu
