import * as React from "react"

// Create a state-less router mimicking the original popstate navigation.
let listeners: Array<() => void> = []

export function navigate(to: string) {
  if (to.startsWith("#")) {
    window.history.pushState({}, "", to)
    const id = to.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    listeners.forEach((l) => l())
    return
  }

  window.history.pushState({}, "", to)
  listeners.forEach((l) => l())

  if (to.includes("#")) {
    const id = to.split("#")[1]
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  } else {
    window.scrollTo(0, 0)
  }
}

export function useRouter() {
  const [path, setPath] = React.useState(window.location.pathname)

  React.useEffect(() => {
    const handleChange = () => {
      setPath(window.location.pathname)
    }
    listeners.push(handleChange)
    window.addEventListener("popstate", handleChange)

    return () => {
      listeners = listeners.filter((l) => l !== handleChange)
      window.removeEventListener("popstate", handleChange)
    }
  }, [])

  return path
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  onClick?: () => void
  children: React.ReactNode
}

export function Link({ to, onClick, className, children, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    e.preventDefault()
    navigate(to)
    if (onClick) {
      onClick()
    }
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
