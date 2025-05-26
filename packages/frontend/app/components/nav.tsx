import { href, NavLink } from "react-router";

import Spinner from "~/components/spinner";

export default () => (
  <nav>
    <ul className="menu menu-lg menu-vertical bg-base-200 p-0 [&_li>*]:rounded-none">
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/")}
        >
          {({ isPending }) => (
            <>
              <span>Home</span>
              {isPending && <Spinner />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/about")}
        >
          {({ isPending }) => (
            <>
              <span>About</span>
              {isPending && <Spinner />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/dashboard")}
        >
          {({ isPending }) => (
            <>
              <span>Dashboard</span>
              {isPending && <Spinner />}
            </>
          )}
        </NavLink>
        <ul>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "menu-active" : "")}
              end
              to={href("/dashboard/user-poc/create")}
            >
              {({ isPending }) => (
                <>
                  <span>User POC Create</span>
                  {isPending && <Spinner />}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "menu-active" : "")}
              end
              to={href("/dashboard/user-poc/read")}
            >
              {({ isPending }) => (
                <>
                  <span>User POC Read</span>
                  {isPending && <Spinner />}
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
);
