import "./components/typewriter/component";
import "./components/accordion/component";
import "./components/counter/component";
import "./components/switch/component";
import { find_between } from "./lib/AttributeParser";

console.log(find_between("<element id='yee\'t'> </element>", "id='", "'"))