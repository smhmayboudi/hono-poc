import { href, NavLink } from "react-router";

import Loading from "~/components/ui/loading";

export default () => (
  <nav>
    <ul className="menu menu-lg menu-vertical bg-base-200 p-0 [&_li>*]:rounded-none">
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/login")}
        >
          {({ isPending }) => (
            <>
              <span>login</span>
              {isPending && <Loading c_size="xs" />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/logout")}
        >
          {({ isPending }) => (
            <>
              <span>logout</span>
              {isPending && <Loading c_size="xs" />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/image/gallery")}
        >
          {({ isPending }) => (
            <>
              <span>image/gallery</span>
              {isPending && <Loading c_size="xs" />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/")}
        >
          {({ isPending }) => (
            <>
              <span>Home</span>
              {isPending && <Loading c_size="xs" />}
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
              {isPending && <Loading c_size="xs" />}
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
              {isPending && <Loading c_size="xs" />}
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
                  {isPending && <Loading c_size="xs" />}
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
                  {isPending && <Loading c_size="xs" />}
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
);
