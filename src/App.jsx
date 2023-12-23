import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { WaterBackground } from "./components/Background";

function App() {
  return (
    <>
    <Canvas>
        <WaterBackground/>
    </Canvas>
    </>
  );
}

export default App;
