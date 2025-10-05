import { ColorIndicatorGroup } from "../../../../components/ColorIndicator";

// Main component to render all color indicators for JV
const ColorIndicators = () => (
  <ColorIndicatorGroup 
    statuses={['approved', 'pending', 'declined']} 
  />
);

export default ColorIndicators;
