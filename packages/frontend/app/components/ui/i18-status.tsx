import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import { Link } from "~/components/ui/link";
import { supportedLanguages } from "~/localization/resource";

export default () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  return (
    <div
      className={`fixed flex gap-2 p-2 top-0 z-10 ${i18n.dir() === "ltr" ? "right-0" : "left-0"}`}
    >
      {supportedLanguages.map((language) => (
        <Link
          className="btn btn-xs"
          keepSearchParams
          key={language}
          language={language}
          onClick={() => i18n.changeLanguage(language)}
          to={location.pathname}
        >
          {language.toUpperCase()}
        </Link>
      ))}
    </div>
  );
};
