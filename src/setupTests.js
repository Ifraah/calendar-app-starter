import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import "jest-enzyme"

configure({ adapter: new Adapter() })

// Needed for dynamic ComplianceTableWithControls footer styling
Element.prototype.getClientRects = () => {
  return [{ height: 100 }]
}
