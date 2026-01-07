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
          <rect x="2" y="16" width="20" height="4" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="5" y="6" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },

    {
      to: "/leaderboard",
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
          <path d="M16 4h.01" />
          <path d="M16 20h.01" />
          <path d="M8 4h.01" />
          <path d="M8 20h.01" />
          <path d="M12 4h.01" />
          <path d="M12 20h.01" />
          <path d="M2 8h20" />
          <path d="M2 12h20" />
          <path d="M2 16h20" />
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
    <nav className={clsx("fixed bottom-8 left-1/2 -translate-x-1/2", "flex justify-around gap-1", "p-1 rounded-full bg-white/5", "glass")}>
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
