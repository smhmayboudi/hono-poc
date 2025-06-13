import { useBannerVisibility } from "~/components/banner-visibility-provider";
import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";

export default () => {
  const { isVisible, updateVisibility } = useBannerVisibility();

  return isVisible ? (
    <div role="alert" className="alert alert-info">
      <Icon c_name="outline-info" />
      <span>Don't miss our banner!</span>
      <Button c_size="xs" onClick={() => updateVisibility(false)}>
        Hide
      </Button>
    </div>
  ) : (
    <></>
  );
};
