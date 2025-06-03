import { href } from "react-router";

import Loading from "~/components/ui/loading";
import { NavLink } from "~/components/ui/nav-link";

export default () => (
  <nav className="flex-none p-4">
    <ul className="[&_li>*]:rounded-none bg-base-200 menu menu-lg menu-vertical p-0">
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/signup")}
        >
          {({ isPending }) => (
            <>
              <span>signup</span>
              {isPending && <Loading c_size="xs" />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/signin")}
        >
          {({ isPending }) => (
            <>
              <span>signin</span>
              {isPending && <Loading c_size="xs" />}
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-active" : "")}
          end
          to={href("/signout")}
        >
          {({ isPending }) => (
            <>
              <span>signout</span>
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
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "menu-active" : "")}
              end
              to={href("/dashboard/user-poc-information/create")}
            >
              {({ isPending }) => (
                <>
                  <span>User POC Information Create</span>
                  {isPending && <Loading c_size="xs" />}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "menu-active" : "")}
              end
              to={href("/dashboard/user-poc-information/read")}
            >
              {({ isPending }) => (
                <>
                  <span>User POC Information Read</span>
                  {isPending && <Loading c_size="xs" />}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "menu-active" : "")}
              end
              to={href("/dashboard/user-poc-view/create")}
            >
              {({ isPending }) => (
                <>
                  <span>User POC View Create</span>
                  {isPending && <Loading c_size="xs" />}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "menu-active" : "")}
              end
              to={href("/dashboard/user-poc-view/read")}
            >
              {({ isPending }) => (
                <>
                  <span>User POC View Read</span>
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
