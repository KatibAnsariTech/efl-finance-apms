import { ColorIndicatorGroup } from "../../../../components/ColorIndicator";

const ColorIndicators = () => (
  <ColorIndicatorGroup 
    statuses={['approved', 'pending', 'declined']} 
  />
);

export default ColorIndicators;
