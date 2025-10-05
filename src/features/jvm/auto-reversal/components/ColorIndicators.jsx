import { ColorIndicatorGroup } from "../../../../components/ColorIndicator";

// Main component to render all color indicators for Auto Reversal
const ColorIndicators = () => (
  <ColorIndicatorGroup 
    statuses={['active', 'completed']} 
  />
);

export default ColorIndicators;
