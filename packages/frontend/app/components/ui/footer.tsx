export default () => (
  <footer className="footer footer-horizontal footer-center bg-base text-base-content p-10">
    <aside>
      <p>
        Powered by&nbsp;
        <a
          className="link link-hover"
          href="https://github.com/remix-run/react-router"
        >
          React Router
        </a>
      </p>
      <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
    </aside>
  </footer>
);
